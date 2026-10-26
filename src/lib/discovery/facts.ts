import type { Completeness, CompletenessField, UniversityFacts } from "./types";
import { COMPLETENESS_FIELDS } from "./types";

const FIELD_PRESENT: Record<CompletenessField, (f: UniversityFacts) => boolean> = {
  officialUrl: (f) => Boolean(f.officialUrl),
  internationalUrl: (f) => Boolean(f.internationalUrl),
  state: (f) => Boolean(f.state),
  ownership: (f) => Boolean(f.ownership),
  nonEuTuition: (f) => f.nonEuTuition.status !== "unknown",
  semesterContribution: (f) => f.semesterContribution.amountEur !== null,
  uniAssist: (f) => f.uniAssistMember !== null,
  englishTaught: (f) => f.englishTaught !== null,
  subjectAreas: (f) => Boolean(f.subjectAreas && f.subjectAreas.length > 0),
};

export function computeCompleteness(facts: UniversityFacts | null): Completeness {
  const total = COMPLETENESS_FIELDS.length;
  if (!facts) return { filled: 0, total, missing: [...COMPLETENESS_FIELDS] };
  const missing = COMPLETENESS_FIELDS.filter((field) => !FIELD_PRESENT[field](facts));
  return { filled: total - missing.length, total, missing };
}

/** True only when a verified source says no tuition is charged to non-EU degree students. */
export function isVerifiedTuitionFreeForNonEu(facts: UniversityFacts | null) {
  return facts?.nonEuTuition.status === "none";
}

export function formatEur(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Exact amount as published, keeping cents when there are any (semester contributions). */
export function formatEurExact(amount: number, locale: string) {
  const cents = !Number.isInteger(amount);
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

const TERM_PATTERNS: [RegExp, Record<"en" | "tr", (year: string) => string>][] = [
  [/^WiSe (\d{4}\/\d{2})$/, { en: (y) => `winter semester ${y}`, tr: (y) => `${y} kış dönemi` }],
  [/^SoSe (\d{4})$/, { en: (y) => `summer semester ${y}`, tr: (y) => `${y} yaz dönemi` }],
  [/^FSS (\d{4})$/, { en: (y) => `spring semester ${y}`, tr: (y) => `${y} bahar dönemi` }],
];

/** "WiSe 2026/27" → "winter semester 2026/27" / "2026/27 kış dönemi"; unknown formats pass through. */
export function formatTerm(term: string, locale: string) {
  for (const [pattern, labels] of TERM_PATTERNS) {
    const match = term.match(pattern);
    if (match) return labels[locale === "tr" ? "tr" : "en"](match[1]);
  }
  return term;
}

export function formatEurRange(min: number | null, max: number | null, locale: string) {
  if (min === null && max === null) return null;
  if (min !== null && max !== null && min !== max) return `${formatEur(min, locale)}–${formatEur(max, locale)}`;
  return formatEur((min ?? max) as number, locale);
}

export function formatDate(iso: string, locale: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
