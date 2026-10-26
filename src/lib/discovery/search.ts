/**
 * Small typo-tolerant search for the university directory. The dataset is
 * ~80 institutions, so an in-memory index is faster and simpler than a
 * server round-trip; the same functions run on server and client.
 */

export function normalize(input: string): string {
  return input
    .toLocaleLowerCase("de")
    .replace(/ß/g, "ss")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    // German transliterations ("muenchen", "tuebingen") fold to the same form as the umlaut.
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokenize(input: string): string[] {
  const n = normalize(input);
  return n ? n.split(" ") : [];
}

/** Levenshtein distance, aborting early once it exceeds `max`. */
export function editDistance(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, curr[j]);
    }
    if (rowMin > max) return max + 1;
    prev = curr;
  }
  return prev[b.length];
}

function allowedTypos(token: string) {
  if (token.length >= 8) return 2;
  if (token.length >= 4) return 1;
  return 0;
}

/** 0..1 quality of the best match for one query token against one field token. */
function tokenMatch(query: string, target: string): number {
  if (target === query) return 1;
  if (target.startsWith(query)) return query.length >= 2 ? 0.9 : 0;
  if (query.length >= 3 && target.includes(query)) return 0.6;
  const typos = allowedTypos(query);
  if (typos > 0) {
    if (editDistance(query, target, typos) <= typos) return 0.55;
    // Typo inside a word the user hasn't finished typing ("heidelbrg" → "heidelberg").
    if (target.length > query.length && editDistance(query, target.slice(0, query.length), typos) <= typos) return 0.45;
  }
  return 0;
}

export type SearchField = { text: string; weight: number };
export type SearchDoc = { id: string; fields: SearchField[] };

type IndexedField = { weight: number; tokens: string[]; normalized: string };
export type SearchIndex = { id: string; fields: IndexedField[] }[];

export function buildIndex(docs: SearchDoc[]): SearchIndex {
  return docs.map((doc) => ({
    id: doc.id,
    fields: doc.fields
      .filter((f) => f.text)
      .map((f) => ({ weight: f.weight, tokens: tokenize(f.text), normalized: normalize(f.text) })),
  }));
}

/**
 * AND semantics: every query token must match some field, otherwise the
 * document is excluded. Returns ids sorted by descending score.
 */
export function search(index: SearchIndex, query: string): { id: string; score: number }[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return index.map((d) => ({ id: d.id, score: 0 }));
  const phrase = normalize(query);
  const results: { id: string; score: number }[] = [];
  for (const doc of index) {
    let total = 0;
    let matchedAll = true;
    for (const q of queryTokens) {
      let best = 0;
      for (const field of doc.fields) {
        for (const t of field.tokens) {
          const quality = tokenMatch(q, t);
          if (quality > 0) best = Math.max(best, quality * field.weight);
        }
      }
      if (best === 0) {
        matchedAll = false;
        break;
      }
      total += best;
    }
    if (!matchedAll) continue;
    const top = doc.fields[0];
    if (top && phrase.length >= 3 && top.normalized.includes(phrase)) total += 15;
    results.push({ id: doc.id, score: total });
  }
  return results.sort((a, b) => b.score - a.score);
}

/** The closest candidate to a query that matched nothing — powers "Did you mean …?". */
export function closestCandidate(query: string, candidates: string[]): string | null {
  const q = normalize(query);
  if (q.length < 3) return null;
  let best: { text: string; distance: number } | null = null;
  for (const candidate of candidates) {
    const tokens = tokenize(candidate);
    for (const token of tokens) {
      const distance = editDistance(q, token, 3);
      if (distance <= 3 && (!best || distance < best.distance)) best = { text: candidate, distance };
    }
    const whole = editDistance(q, normalize(candidate), 3);
    if (whole <= 3 && (!best || whole < best.distance)) best = { text: candidate, distance: whole };
  }
  return best?.text ?? null;
}
