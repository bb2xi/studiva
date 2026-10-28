import { SUBJECT_AREAS, type DirectoryFacts, type DirectoryItem, type SubjectArea } from "./types";

/*
 * The directory sends every university to the browser so filtering is instant.
 * As objects, the repeated key names were most of that payload; on the wire each
 * university is a fixed-order tuple instead (subject areas as a bit mask), and
 * the browser rebuilds the same DirectoryItem objects.
 */

type PackedFacts = [
  officialName: string | null,
  ownership: DirectoryFacts["ownership"],
  tuition: DirectoryFacts["nonEuTuition"]["status"],
  contributionEur: number | null,
  uniAssistMember: boolean | null,
  englishTaught: boolean | null,
  subjects: number | null,
  daadEnglish: number | null,
  hsk: [programmes: number, undergraduate: number, graduate: number, english: number] | null,
];

export type PackedItem = [
  slug: string,
  name: string,
  cityLabel: string,
  cities: string[],
  state: DirectoryItem["state"],
  type: DirectoryItem["type"],
  badges: string[],
  level: DirectoryItem["level"],
  lat: number,
  lng: number,
  popularPrograms: string[],
  filled: number,
  facts: PackedFacts | null,
];

const toMask = (areas: SubjectArea[]) => areas.reduce((mask, area) => mask | (1 << SUBJECT_AREAS.indexOf(area)), 0);
const fromMask = (mask: number) => SUBJECT_AREAS.filter((_, i) => mask & (1 << i));

export function packItems(items: DirectoryItem[]): PackedItem[] {
  return items.map((u) => [
    u.slug,
    u.name,
    u.cityLabel,
    u.cities,
    u.state,
    u.type,
    u.badges,
    u.level,
    u.lat,
    u.lng,
    u.popularPrograms,
    u.completeness.filled,
    u.facts && [
      u.facts.officialName,
      u.facts.ownership,
      u.facts.nonEuTuition.status,
      u.facts.semesterContribution.amountEur,
      u.facts.uniAssistMember,
      u.facts.englishTaught,
      u.facts.subjectAreas && toMask(u.facts.subjectAreas),
      u.facts.daad ? u.facts.daad.englishProgrammes : null,
      u.facts.hsk && [u.facts.hsk.programmes, u.facts.hsk.undergraduate, u.facts.hsk.graduate, u.facts.hsk.english],
    ],
  ]);
}

export function unpackItems(packed: PackedItem[]): DirectoryItem[] {
  return packed.map(([slug, name, cityLabel, cities, state, type, badges, level, lat, lng, popularPrograms, filled, f]) => ({
    slug,
    name,
    cityLabel,
    cities,
    state,
    type,
    badges,
    level,
    lat,
    lng,
    popularPrograms,
    completeness: { filled },
    facts: f && {
      officialName: f[0],
      ownership: f[1],
      nonEuTuition: { status: f[2] },
      semesterContribution: { amountEur: f[3] },
      uniAssistMember: f[4],
      englishTaught: f[5],
      subjectAreas: f[6] === null ? null : fromMask(f[6]),
      daad: f[7] === null ? null : { englishProgrammes: f[7] },
      hsk: f[8] && { programmes: f[8][0], undergraduate: f[8][1], graduate: f[8][2], english: f[8][3] },
    },
  }));
}
