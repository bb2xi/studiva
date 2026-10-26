// Deep links into DAAD's "International Programmes in Germany" search. Studiva
// stores only per-institution counts (scripts/fetch-daad-programmes.mjs) and
// sends visitors to DAAD for the programme records themselves.

export const DAAD_PROGRAMMES_URL = "https://www2.daad.de/deutschland/studienangebote/international-programmes/en/";
export const DAAD_RESULT_URL = `${DAAD_PROGRAMMES_URL}result/`;

/** DAAD's facet values: degree 1 = bachelor, 2 = master; language 1 = German, 2 = English, 4 = German & English. */
const DEGREE = { bachelor: "1", master: "2" } as const;
const LANGS = { english: ["2", "4"], german: ["1", "4"] } as const;

export type DaadDegree = keyof typeof DEGREE;
export type DaadLanguage = keyof typeof LANGS;
export type DaadQuery = { q?: string; insId?: string; degree?: DaadDegree; language?: DaadLanguage };

/** Filter parameters exactly as DAAD's result page reads them (q is left to the caller). */
export function daadFilterParams({ insId, degree, language }: DaadQuery): [string, string][] {
  const params: [string, string][] = [];
  if (insId) params.push(["ins[]", insId]);
  if (degree) params.push(["degree[]", DEGREE[degree]]);
  if (language) for (const value of LANGS[language]) params.push(["lang[]", value]);
  return params;
}

export function daadSearchUrl(query: DaadQuery = {}) {
  const params = new URLSearchParams();
  const q = query.q?.trim();
  if (q) params.set("q", q);
  for (const [key, value] of daadFilterParams(query)) params.append(key, value);
  const qs = params.toString();
  return qs ? `${DAAD_RESULT_URL}?${qs}` : DAAD_PROGRAMMES_URL;
}
