import { buildIndex, search, type SearchIndex } from "./search";
import { levelOf } from "./facts";
import type { DirectoryItem, StateCode, SubjectArea } from "./types";
import { STATE_CODES, SUBJECT_AREAS } from "./types";
import { STATES } from "@/data/states";

export const TYPE_KEYS = { universitat: "Universität", hochschule: "Fachhochschule", dual: "Duale Hochschule" } as const;
export type TypeKey = keyof typeof TYPE_KEYS;
export const TYPE_KEY_LIST = Object.keys(TYPE_KEYS) as TypeKey[];

export const BADGE_KEYS = ["tu9", "excellence"] as const;
export type BadgeKey = (typeof BADGE_KEYS)[number];

export const SORT_KEYS = ["relevance", "programmes", "name", "city", "state", "english", "contribution", "verified"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const VIEW_KEYS = ["cards", "table", "map"] as const;
export type ViewKey = (typeof VIEW_KEYS)[number];

/** Upper limits offered for the verified semester contribution (EUR). */
export const CONTRIBUTION_CAPS = [200, 350, 450] as const;
export type ContributionCap = (typeof CONTRIBUTION_CAPS)[number];

/** Cards added per "show more" step. */
export const PAGE_SIZE = 24;

export type DirectoryState = {
  q: string;
  /** Still read from old links, but every listed university offers both levels, so there is no control for it. */
  level: "all" | "bachelor" | "master";
  types: TypeKey[];
  badges: BadgeKey[];
  states: StateCode[];
  city: string;
  subjects: SubjectArea[];
  ownership: "any" | "public" | "private";
  fee: "any" | "none" | "charged";
  english: boolean;
  /** How applications are made: through uni-assist, or directly (verified non-member). */
  route: "any" | "uniassist" | "direct";
  contributionMax: ContributionCap | null;
  /** null = the default for the current query (see effectiveSort). */
  sort: SortKey | null;
  /** Number of PAGE_SIZE batches shown in the card view. */
  page: number;
  view: ViewKey;
  /** University selected on the map. */
  focus: string;
};

export const DEFAULT_STATE: DirectoryState = {
  q: "",
  level: "all",
  types: [],
  badges: [],
  states: [],
  city: "",
  subjects: [],
  ownership: "any",
  fee: "any",
  english: false,
  route: "any",
  contributionMax: null,
  sort: null,
  page: 1,
  view: "cards",
  focus: "",
};

/** The order actually applied: "relevance" only means something while searching. */
export function effectiveSort(state: Pick<DirectoryState, "q" | "sort">): SortKey {
  if (state.sort === null) return state.q ? "relevance" : "programmes";
  return state.sort === "relevance" && !state.q ? "programmes" : state.sort;
}

type ParamsLike = { get(name: string): string | null };

function list<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  return [...new Set(raw.split(",").filter((v): v is T => (allowed as readonly string[]).includes(v)))];
}

const oneOf = <T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T =>
  raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;

export function parseDirectoryState(params: ParamsLike): DirectoryState {
  const level = params.get("level");
  const sort = params.get("sort");
  const ua = params.get("ua");
  const page = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    level: level === "bachelor" || level === "master" ? level : "all",
    types: list(params.get("type"), TYPE_KEY_LIST),
    badges: list(params.get("badge"), BADGE_KEYS),
    states: list(params.get("state"), STATE_CODES),
    city: (params.get("city") ?? "").slice(0, 60),
    subjects: list(params.get("subject"), SUBJECT_AREAS),
    ownership: oneOf(params.get("own"), ["public", "private"] as const, "any"),
    fee: oneOf(params.get("fee"), ["none", "charged"] as const, "any"),
    english: params.get("en") === "1",
    // ua=1 is the original "uni-assist" value and keeps working.
    route: ua === "1" || ua === "uniassist" ? "uniassist" : ua === "direct" ? "direct" : "any",
    contributionMax: CONTRIBUTION_CAPS.find((cap) => String(cap) === params.get("cmax")) ?? null,
    sort: sort && (SORT_KEYS as readonly string[]).includes(sort) ? (sort as SortKey) : null,
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 50) : 1,
    view: oneOf(params.get("view"), VIEW_KEYS, "cards"),
    focus: (params.get("focus") ?? "").slice(0, 40),
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
  if (state.subjects.length) p.set("subject", state.subjects.join(","));
  if (state.ownership !== "any") p.set("own", state.ownership);
  if (state.fee !== "any") p.set("fee", state.fee);
  if (state.english) p.set("en", "1");
  if (state.route !== "any") p.set("ua", state.route === "uniassist" ? "1" : "direct");
  if (state.contributionMax !== null) p.set("cmax", String(state.contributionMax));
  if (state.sort !== null) p.set("sort", state.sort);
  if (state.page > 1) p.set("page", String(state.page));
  if (state.view !== "cards") p.set("view", state.view);
  if (state.focus) p.set("focus", state.focus);
  return p.toString();
}

/** Filters only — sort, view, paging and map focus are not filters. */
export function activeFilterCount(state: DirectoryState) {
  return (
    (state.q ? 1 : 0) +
    (state.level !== "all" ? 1 : 0) +
    state.types.length +
    state.badges.length +
    state.states.length +
    (state.city ? 1 : 0) +
    state.subjects.length +
    (state.ownership !== "any" ? 1 : 0) +
    (state.fee !== "any" ? 1 : 0) +
    (state.english ? 1 : 0) +
    (state.route !== "any" ? 1 : 0) +
    (state.contributionMax !== null ? 1 : 0)
  );
}

/** The filters reset by "clear all": everything but the view. */
export function clearedState(state: DirectoryState): DirectoryState {
  return { ...DEFAULT_STATE, view: state.view };
}

/** Search index fields, strongest first. State names are indexed in all three languages. */
export function buildUniversityIndex(items: DirectoryItem[], subjectLabels: Record<string, string>): SearchIndex {
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

const isPrivate = (u: DirectoryItem) => u.facts?.ownership === "private" || u.facts?.ownership === "church";
const charges = (u: DirectoryItem) => u.facts?.nonEuTuition.status === "charged" || u.facts?.nonEuTuition.status === "varies";
const contributionOf = (u: DirectoryItem) => u.facts?.semesterContribution.amountEur ?? null;

/** One check per filter dimension; facet counts skip the dimension they count. */
const CHECKS = {
  level: (u: DirectoryItem, s: DirectoryState) => {
    const offered = levelOf(u);
    return s.level === "all" || offered === "both" || offered === s.level;
  },
  types: (u: DirectoryItem, s: DirectoryState) => !s.types.length || s.types.some((t) => TYPE_KEYS[t] === u.type),
  badges: (u: DirectoryItem, s: DirectoryState) => s.badges.every((b) => u.badges.includes(b)),
  states: (u: DirectoryItem, s: DirectoryState) => !s.states.length || (u.state !== null && s.states.includes(u.state)),
  city: (u: DirectoryItem, s: DirectoryState) => !s.city || u.cities.includes(s.city),
  subjects: (u: DirectoryItem, s: DirectoryState) => !s.subjects.length || s.subjects.some((a) => u.facts?.subjectAreas?.includes(a)),
  ownership: (u: DirectoryItem, s: DirectoryState) =>
    s.ownership === "any" || (s.ownership === "public" ? u.facts?.ownership === "public" : isPrivate(u)),
  fee: (u: DirectoryItem, s: DirectoryState) => s.fee === "any" || (s.fee === "none" ? u.facts?.nonEuTuition.status === "none" : charges(u)),
  english: (u: DirectoryItem, s: DirectoryState) => !s.english || u.facts?.englishTaught === true,
  route: (u: DirectoryItem, s: DirectoryState) =>
    s.route === "any" || u.facts?.uniAssistMember === (s.route === "uniassist" ? true : false),
  contribution: (u: DirectoryItem, s: DirectoryState) => {
    const amount = contributionOf(u);
    return s.contributionMax === null || (amount !== null && amount <= s.contributionMax);
  },
};
type Dimension = keyof typeof CHECKS;
const DIMENSIONS = Object.keys(CHECKS) as Dimension[];

function passes(u: DirectoryItem, s: DirectoryState, skip?: Dimension) {
  return DIMENSIONS.every((d) => d === skip || CHECKS[d](u, s));
}

export type DirectoryFacets = {
  fee: Record<"none" | "charged", number>;
  english: number;
  subjects: Record<SubjectArea, number>;
  states: Record<StateCode, number>;
  types: Record<TypeKey, number>;
  route: Record<"uniassist" | "direct", number>;
  contribution: Record<ContributionCap, number> & { unverified: number };
  ownership: Record<"public" | "private", number>;
  badges: Record<BadgeKey, number>;
};

/** Results each option would give with every other active filter applied. */
function facetsFor(searched: DirectoryItem[], s: DirectoryState): DirectoryFacets {
  const without = (d: Dimension) => searched.filter((u) => passes(u, s, d));
  const count = <K extends string>(keys: readonly K[], pool: DirectoryItem[], match: (u: DirectoryItem, key: K) => boolean) =>
    Object.fromEntries(keys.map((k) => [k, pool.filter((u) => match(u, k)).length])) as Record<K, number>;
  const contributionPool = without("contribution");
  return {
    fee: count(["none", "charged"] as const, without("fee"), (u, k) => (k === "none" ? u.facts?.nonEuTuition.status === "none" : charges(u))),
    english: without("english").filter((u) => u.facts?.englishTaught === true).length,
    subjects: count(SUBJECT_AREAS, without("subjects"), (u, k) => Boolean(u.facts?.subjectAreas?.includes(k))),
    states: count(STATE_CODES, without("states"), (u, k) => u.state === k),
    types: count(TYPE_KEY_LIST, without("types"), (u, k) => u.type === TYPE_KEYS[k]),
    route: count(["uniassist", "direct"] as const, without("route"), (u, k) => u.facts?.uniAssistMember === (k === "uniassist")),
    contribution: {
      ...(Object.fromEntries(
        CONTRIBUTION_CAPS.map((cap) => [cap, contributionPool.filter((u) => (contributionOf(u) ?? Infinity) <= cap).length])
      ) as Record<ContributionCap, number>),
      unverified: contributionPool.filter((u) => contributionOf(u) === null).length,
    },
    ownership: count(["public", "private"] as const, without("ownership"), (u, k) => (k === "public" ? u.facts?.ownership === "public" : isPrivate(u))),
    // Badges combine with AND, so each count keeps the other selected badges.
    badges: count(BADGE_KEYS, searched, (u, k) => u.badges.includes(k) && passes(u, { ...s, badges: s.badges.filter((b) => b !== k) })),
  };
}

const collator = (locale: string) => new Intl.Collator(locale === "tr" ? "tr" : "en", { sensitivity: "base" });

export function runDirectoryQuery(items: DirectoryItem[], index: SearchIndex, state: DirectoryState, locale: string) {
  const scores = new Map(search(index, state.q).map((r) => [r.id, r.score]));
  const searched = state.q ? items.filter((u) => scores.has(u.slug)) : items;
  const filtered = searched.filter((u) => passes(u, state));

  const c = collator(locale);
  const stateName = (u: DirectoryItem) => STATES.find((s) => s.code === u.state)?.name[locale === "tr" ? "tr" : "en"] ?? "~";
  const sorted = [...filtered];
  const sort = effectiveSort(state);
  // Unverified values (null) always sort last, whatever the direction.
  const nullsLast = (a: number | null | undefined, b: number | null | undefined, dir: 1 | -1) =>
    a == null ? (b == null ? 0 : 1) : b == null ? -1 : (a - b) * dir;
  sorted.sort((a, b) => {
    switch (sort) {
      case "relevance":
        return (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0) || c.compare(a.name, b.name);
      case "programmes":
        return nullsLast(a.facts?.hsk?.programmes, b.facts?.hsk?.programmes, -1) || c.compare(a.name, b.name);
      case "english":
        return nullsLast(a.facts?.daad?.englishProgrammes, b.facts?.daad?.englishProgrammes, -1) || c.compare(a.name, b.name);
      case "contribution":
        return nullsLast(contributionOf(a), contributionOf(b), 1) || c.compare(a.name, b.name);
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

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(state.page, pageCount);
  // Cards come in batches; the table and the map list every result.
  const visible = state.view === "cards" ? sorted.slice(0, page * PAGE_SIZE) : sorted;

  return {
    all: sorted,
    visible,
    page,
    total: sorted.length,
    remaining: sorted.length - visible.length,
    facets: facetsFor(searched, state),
    searchedCount: searched.length,
  };
}
