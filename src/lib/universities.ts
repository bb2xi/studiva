import { getTranslations } from "next-intl/server";
import baseData from "@/data/universities.json";
import factsData from "@/data/university-facts.json";
import { computeCompleteness } from "@/lib/discovery/facts";
import type {
  CompassMeta,
  DirectoryItem,
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

/** Slim records for the directory UI — only what its cards, table, map, search and filters use. */
export async function getDirectoryItems(locale: string): Promise<DirectoryItem[]> {
  return (await getUniversitySummaries(locale)).map((u) => ({
    slug: u.slug,
    name: u.name,
    cityLabel: u.cityLabel,
    cities: u.cities,
    state: u.state,
    type: u.type,
    badges: u.badges,
    level: u.level,
    lat: u.lat,
    lng: u.lng,
    multiCampus: u.multiCampus,
    popularPrograms: u.popularPrograms,
    completeness: { filled: u.completeness.filled, total: u.completeness.total },
    facts: u.facts && {
      officialName: u.facts.officialName,
      ownership: u.facts.ownership,
      nonEuTuition: { status: u.facts.nonEuTuition.status },
      semesterContribution: { amountEur: u.facts.semesterContribution.amountEur, term: u.facts.semesterContribution.term },
      uniAssistMember: u.facts.uniAssistMember,
      englishTaught: u.facts.englishTaught,
      subjectAreas: u.facts.subjectAreas,
      daad: u.facts.daad && { englishProgrammes: u.facts.daad.englishProgrammes },
      hsk: u.facts.hsk && {
        programmes: u.facts.hsk.programmes,
        undergraduate: u.facts.hsk.undergraduate,
        graduate: u.facts.hsk.graduate,
        english: u.facts.hsk.english,
      },
    },
  }));
}

export async function getUniversityDetail(locale: string, slug: string): Promise<UniversityDetail | null> {
  const base = BASE.find((u) => u.slug === slug);
  if (!base) return null;
  const localized = (await getLocalized(locale)).get(slug);
  return localized ? merge(base, localized) : null;
}
