import { getTranslations } from "next-intl/server";
import baseData from "@/data/universities.json";
import factsData from "@/data/university-facts.json";
import { computeCompleteness } from "@/lib/discovery/facts";
import type {
  CompassMeta,
  UniversityBase,
  UniversityDetail,
  UniversityFacts,
  UniversitySummary,
} from "@/lib/discovery/types";

type LocalizedUniversity = {
  slug: string;
  name: string;
  city: string;
  description: string;
  history: string[];
  highlights: string[];
  pros: string[];
  cons: string[];
  quickFacts?: { students?: string; language?: string };
  popularPrograms: string[];
};

const BASE = baseData as UniversityBase[];
const FACTS = (factsData as { records: Record<string, UniversityFacts> }).records;

export const UNIVERSITY_SLUGS = BASE.map((u) => u.slug);
export const FACTS_GENERATED_AT = (factsData as { generatedAt: string | null }).generatedAt;
export const COMPASS = (factsData as unknown as { compass: CompassMeta }).compass;

export function getFacts(slug: string): UniversityFacts | null {
  return FACTS[slug] ?? null;
}

async function getLocalized(locale: string) {
  const t = await getTranslations({ locale, namespace: "universities" });
  const items = t.raw("items") as LocalizedUniversity[];
  return new Map(items.map((item) => [item.slug, item]));
}

function merge(base: UniversityBase, localized: LocalizedUniversity): UniversityDetail {
  const facts = getFacts(base.slug);
  return {
    ...base,
    name: localized.name,
    cityLabel: localized.city,
    description: localized.description,
    popularPrograms: localized.popularPrograms,
    students: localized.quickFacts?.students ?? null,
    languageSummary: localized.quickFacts?.language ?? null,
    state: facts?.state ?? null,
    facts,
    completeness: computeCompleteness(facts),
    history: localized.history,
    highlights: localized.highlights,
    pros: localized.pros,
    cons: localized.cons,
  };
}

function toSummary(detail: UniversityDetail): UniversitySummary {
  // Drop the long-form text so client components only receive what they render.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { history, highlights, pros, cons, ...summary } = detail;
  return summary;
}

export async function getUniversityDetails(locale: string): Promise<UniversityDetail[]> {
  const localized = await getLocalized(locale);
  return BASE.flatMap((base) => {
    const l = localized.get(base.slug);
    return l ? [merge(base, l)] : [];
  });
}

export async function getUniversitySummaries(locale: string): Promise<UniversitySummary[]> {
  return (await getUniversityDetails(locale)).map(toSummary);
}

export async function getUniversityDetail(locale: string, slug: string): Promise<UniversityDetail | null> {
  const base = BASE.find((u) => u.slug === slug);
  if (!base) return null;
  const localized = (await getLocalized(locale)).get(slug);
  return localized ? merge(base, localized) : null;
}
