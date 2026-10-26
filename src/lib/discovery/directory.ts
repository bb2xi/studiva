import { buildIndex, search, type SearchIndex } from "./search";
import { levelOf } from "./facts";
import type { StateCode, SubjectArea, UniversitySummary } from "./types";
import { STATE_CODES, SUBJECT_AREAS } from "./types";
import { STATES } from "@/data/states";

export const TYPE_KEYS = { universitat: "Universität", hochschule: "Fachhochschule", dual: "Duale Hochschule" } as const;
export type TypeKey = keyof typeof TYPE_KEYS;
export const TYPE_KEY_LIST = Object.keys(TYPE_KEYS) as TypeKey[];

export const SORT_KEYS = ["relevance", "name", "city", "state", "verified"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const PAGE_SIZE = 12;

export type DirectoryState = {
  q: string;
  level: "all" | "bachelor" | "master";
  types: TypeKey[];
  badges: ("tu9" | "excellence")[];
  states: StateCode[];
  city: string;
  subject: SubjectArea | "";
  ownership: "any" | "public" | "private";
  fee: "any" | "none" | "charged";
  english: boolean;
  uniAssist: boolean;
  sort: SortKey;
  page: number;
};

export const DEFAULT_STATE: DirectoryState = {
  q: "",
  level: "all",
  types: [],
  badges: [],
  states: [],
  city: "",
  subject: "",
  ownership: "any",
  fee: "any",
  english: false,
  uniAssist: false,
  sort: "relevance",
  page: 1,
};

type ParamsLike = { get(name: string): string | null };

function list<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  return [...new Set(raw.split(",").filter((v): v is T => (allowed as readonly string[]).includes(v)))];
}

export function parseDirectoryState(params: ParamsLike): DirectoryState {
  const level = params.get("level");
  const ownership = params.get("own");
  const fee = params.get("fee");
  const subject = params.get("subject");
  const sort = params.get("sort");
  const page = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    level: level === "bachelor" || level === "master" ? level : "all",
    types: list(params.get("type"), TYPE_KEY_LIST),
    badges: list(params.get("badge"), ["tu9", "excellence"] as const),
    states: list(params.get("state"), STATE_CODES),
    city: (params.get("city") ?? "").slice(0, 60),
    subject: subject && (SUBJECT_AREAS as readonly string[]).includes(subject) ? (subject as SubjectArea) : "",
    ownership: ownership === "public" || ownership === "private" ? ownership : "any",
    fee: fee === "none" || fee === "charged" ? fee : "any",
    english: params.get("en") === "1",
    uniAssist: params.get("ua") === "1",
    sort: sort && (SORT_KEYS as readonly string[]).includes(sort) ? (sort as SortKey) : "relevance",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function serializeDirectoryState(state: DirectoryState): string {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.level !== "all") p.set("level", state.level);
  if (state.types.length) p.set("type", state.types.join(","));
  if (state.badges.length) p.set("badge", state.badges.join(","));
  if (state.states.length) p.set("state", state.states.join(","));
  if (state.city) p.set("city", state.city);
  if (state.subject) p.set("subject", state.subject);
  if (state.ownership !== "any") p.set("own", state.ownership);
  if (state.fee !== "any") p.set("fee", state.fee);
  if (state.english) p.set("en", "1");
  if (state.uniAssist) p.set("ua", "1");
  if (state.sort !== "relevance") p.set("sort", state.sort);
  if (state.page > 1) p.set("page", String(state.page));
  return p.toString();
}

export function activeFilterCount(state: DirectoryState) {
  return (
    (state.q ? 1 : 0) +
    (state.level !== "all" ? 1 : 0) +
    state.types.length +
    state.badges.length +
    state.states.length +
    (state.city ? 1 : 0) +
    (state.subject ? 1 : 0) +
    (state.ownership !== "any" ? 1 : 0) +
    (state.fee !== "any" ? 1 : 0) +
    (state.english ? 1 : 0) +
    (state.uniAssist ? 1 : 0)
  );
}

/** Search index fields, strongest first. State names are indexed in all three languages. */
export function buildUniversityIndex(items: UniversitySummary[], subjectLabels: Record<string, string>): SearchIndex {
  return buildIndex(
    items.map((u) => {
      const state = STATES.find((s) => s.code === u.state);
      return {
        id: u.slug,
        fields: [
          { text: u.name, weight: 10 },
          { text: u.facts?.officialName ?? "", weight: 8 },
          { text: u.slug, weight: 6 },
          { text: [u.cityLabel, ...u.cities].join(" "), weight: 6 },
          { text: state ? `${state.name.de} ${state.name.en} ${state.name.tr}` : "", weight: 4 },
          { text: `${u.type} ${u.badges.join(" ")} ${u.badges.includes("excellence") ? "exzellenz excellence" : ""}`, weight: 3 },
          { text: u.popularPrograms.join(" "), weight: 2 },
          { text: (u.facts?.subjectAreas ?? []).map((s) => subjectLabels[s] ?? s).join(" "), weight: 2 },
        ],
      };
    })
  );
}

function matchesLevel(u: UniversitySummary, level: DirectoryState["level"]) {
  const offered = levelOf(u);
  return level === "all" || offered === "both" || offered === level;
}

function matchesOwnership(u: UniversitySummary, ownership: DirectoryState["ownership"]) {
  if (ownership === "any") return true;
  const own = u.facts?.ownership;
  if (!own) return false;
  return ownership === "public" ? own === "public" : own === "private" || own === "church";
}

function matchesFee(u: UniversitySummary, fee: DirectoryState["fee"]) {
  if (fee === "any") return true;
  const status = u.facts?.nonEuTuition.status;
  return fee === "none" ? status === "none" : status === "charged" || status === "varies";
}

type FilterKey = "types" | "badges" | "other";

/** Applies every filter except the ones named in `skip` — used for facet counts. */
function passes(u: UniversitySummary, s: DirectoryState, skip: FilterKey[] = []) {
  if (!skip.includes("types") && s.types.length && !s.types.some((t) => TYPE_KEYS[t] === u.type)) return false;
  if (!skip.includes("badges") && s.badges.length && !s.badges.every((b) => u.badges.includes(b))) return false;
  if (skip.includes("other")) return true;
  if (!matchesLevel(u, s.level)) return false;
  if (s.states.length && !(u.state && s.states.includes(u.state))) return false;
  if (s.city && !u.cities.includes(s.city)) return false;
  if (s.subject && !(u.facts?.subjectAreas ?? []).includes(s.subject)) return false;
  if (!matchesOwnership(u, s.ownership)) return false;
  if (!matchesFee(u, s.fee)) return false;
  if (s.english && u.facts?.englishTaught !== true) return false;
  if (s.uniAssist && u.facts?.uniAssistMember !== true) return false;
  return true;
}

const collator = (locale: string) => new Intl.Collator(locale === "tr" ? "tr" : "en", { sensitivity: "base" });

export function runDirectoryQuery(
  items: UniversitySummary[],
  index: SearchIndex,
  state: DirectoryState,
  locale: string
) {
  const scores = new Map(search(index, state.q).map((r) => [r.id, r.score]));
  const searched = state.q ? items.filter((u) => scores.has(u.slug)) : items;
  const filtered = searched.filter((u) => passes(u, state));

  const c = collator(locale);
  const stateName = (u: UniversitySummary) => STATES.find((s) => s.code === u.state)?.name[locale === "tr" ? "tr" : "en"] ?? "~";
  const sorted = [...filtered];
  const sort = state.sort === "relevance" && !state.q ? "name" : state.sort;
  sorted.sort((a, b) => {
    switch (sort) {
      case "relevance":
        return (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0) || c.compare(a.name, b.name);
      case "city":
        return c.compare(a.cities[0] ?? "~", b.cities[0] ?? "~") || c.compare(a.name, b.name);
      case "state":
        return c.compare(stateName(a), stateName(b)) || c.compare(a.name, b.name);
      case "verified":
        return b.completeness.filled - a.completeness.filled || c.compare(a.name, b.name);
      default:
        return c.compare(a.name, b.name);
    }
  });

  const typeCounts = Object.fromEntries(
    TYPE_KEY_LIST.map((key) => [key, searched.filter((u) => passes(u, state, ["types"]) && u.type === TYPE_KEYS[key]).length])
  ) as Record<TypeKey, number>;
  const badgeCounts = {
    tu9: searched.filter((u) => passes(u, state, ["badges"]) && u.badges.includes("tu9")).length,
    excellence: searched.filter((u) => passes(u, state, ["badges"]) && u.badges.includes("excellence")).length,
  };

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(state.page, pageCount);
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { all: sorted, pageItems, page, pageCount, total: sorted.length, typeCounts, badgeCounts, searchedCount: searched.length };
}
