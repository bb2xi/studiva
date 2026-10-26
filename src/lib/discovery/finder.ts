import type { StateCode, SubjectArea, UniversitySummary } from "./types";
import { STATE_CODES, SUBJECT_AREAS } from "./types";
import { TYPE_KEYS, TYPE_KEY_LIST, type TypeKey } from "./directory";

export type FinderAnswers = {
  level: "bachelor" | "master" | "phd" | null;
  subject: SubjectArea | null;
  english: boolean | null;
  states: StateCode[];
  types: TypeKey[];
  ownership: "public" | "any" | null;
  /** Max non-EU tuition per semester in EUR; null = no limit. */
  budget: number | null;
};

export const EMPTY_ANSWERS: FinderAnswers = { level: null, subject: null, english: null, states: [], types: [], ownership: null, budget: null };
export const BUDGET_OPTIONS = [0, 1500, 3000] as const;

type ParamsLike = { get(name: string): string | null };

export function parseAnswers(p: ParamsLike): FinderAnswers {
  const level = p.get("level");
  const subject = p.get("subject");
  const budget = p.get("budget");
  const list = <T extends string>(raw: string | null, allowed: readonly T[]) =>
    raw ? raw.split(",").filter((v): v is T => (allowed as readonly string[]).includes(v)) : [];
  return {
    level: level === "bachelor" || level === "master" || level === "phd" ? level : null,
    subject: subject && (SUBJECT_AREAS as readonly string[]).includes(subject) ? (subject as SubjectArea) : null,
    english: p.get("en") === "1" ? true : null,
    states: list(p.get("state"), STATE_CODES),
    types: list(p.get("type"), TYPE_KEY_LIST),
    ownership: p.get("own") === "public" ? "public" : p.get("own") === "any" ? "any" : null,
    budget: budget !== null && (BUDGET_OPTIONS as readonly number[]).includes(Number(budget)) ? Number(budget) : null,
  };
}

export function serializeAnswers(a: FinderAnswers, step: string) {
  const p = new URLSearchParams();
  if (a.level) p.set("level", a.level);
  if (a.subject) p.set("subject", a.subject);
  if (a.english) p.set("en", "1");
  if (a.states.length) p.set("state", a.states.join(","));
  if (a.types.length) p.set("type", a.types.join(","));
  if (a.ownership) p.set("own", a.ownership);
  if (a.budget !== null) p.set("budget", String(a.budget));
  p.set("step", step);
  return p.toString();
}

export type CriterionStatus = "met" | "notMet" | "unknown";
export type Criterion = {
  key: "level" | "subject" | "english" | "states" | "type" | "ownership" | "budget";
  status: CriterionStatus;
  /** Message key under discovery.finder.reasons plus its values. */
  reason: { key: string; values?: Record<string, string | number> };
};

export type FinderResult = { uni: UniversitySummary; criteria: Criterion[]; group: "exact" | "possible" | "partial" | "excluded" };

export function evaluate(
  u: UniversitySummary,
  a: FinderAnswers,
  labels: { level: (l: string) => string; state: (c: StateCode) => string; type: (t: string) => string; ownership: (o: string) => string; range: (min: number | null, max: number | null) => string }
): Criterion[] {
  const criteria: Criterion[] = [];

  if (a.level) {
    if (a.level === "phd") {
      criteria.push(
        u.type === "Universität"
          ? { key: "level", status: "met", reason: { key: "phdUniversity" } }
          : { key: "level", status: "unknown", reason: { key: "phdOther" } }
      );
    } else {
      const offers = u.level === "both" || u.level === a.level;
      criteria.push({ key: "level", status: offers ? "met" : "notMet", reason: { key: offers ? "levelMet" : "levelNotMet", values: { level: labels.level(a.level) } } });
    }
  }

  if (a.subject) {
    const areas = u.facts?.subjectAreas;
    if (!areas) criteria.push({ key: "subject", status: "unknown", reason: { key: "subjectUnknown" } });
    else criteria.push({ key: "subject", status: areas.includes(a.subject) ? "met" : "notMet", reason: { key: areas.includes(a.subject) ? "subjectMet" : "subjectUnknown" } });
  }

  if (a.english) {
    criteria.push(
      u.facts?.englishTaught && u.facts.daad
        ? { key: "english", status: "met", reason: { key: "englishMet", values: { count: u.facts.daad.englishProgrammes } } }
        : { key: "english", status: "unknown", reason: { key: "englishUnknown" } }
    );
  }

  if (a.states.length) {
    if (u.multiCampus) criteria.push({ key: "states", status: "unknown", reason: { key: "multiCampus" } });
    else if (!u.state) criteria.push({ key: "states", status: "unknown", reason: { key: "stateUnknown" } });
    else {
      const ok = a.states.includes(u.state);
      criteria.push({ key: "states", status: ok ? "met" : "notMet", reason: { key: ok ? "stateMet" : "stateNotMet", values: { state: labels.state(u.state) } } });
    }
  }

  if (a.types.length) {
    const ok = a.types.some((t) => TYPE_KEYS[t] === u.type);
    criteria.push({ key: "type", status: ok ? "met" : "notMet", reason: { key: ok ? "typeMet" : "typeNotMet", values: { type: labels.type(u.type) } } });
  }

  if (a.ownership === "public") {
    const own = u.facts?.ownership;
    if (!own) criteria.push({ key: "ownership", status: "unknown", reason: { key: "stateUnknown" } });
    else {
      const ok = own === "public";
      criteria.push({ key: "ownership", status: ok ? "met" : "notMet", reason: { key: ok ? "ownershipMet" : "ownershipNotMet", values: { ownership: labels.ownership(own) } } });
    }
  }

  if (a.budget !== null) {
    const tu = u.facts?.nonEuTuition;
    if (!tu || tu.status === "unknown") criteria.push({ key: "budget", status: "unknown", reason: { key: "budgetUnknown" } });
    else if (tu.status === "none") criteria.push({ key: "budget", status: "met", reason: { key: "budgetNone" } });
    else if (tu.minEur === null) criteria.push({ key: "budget", status: a.budget === 0 ? "notMet" : "unknown", reason: { key: "budgetChargedUnknown" } });
    else {
      const range = labels.range(tu.minEur, tu.maxEur);
      const max = tu.maxEur ?? tu.minEur;
      if (max <= a.budget) criteria.push({ key: "budget", status: "met", reason: { key: "budgetWithin", values: { range } } });
      else if (tu.minEur <= a.budget) criteria.push({ key: "budget", status: "unknown", reason: { key: "budgetSome", values: { range } } });
      else criteria.push({ key: "budget", status: "notMet", reason: { key: "budgetOver", values: { range } } });
    }
  }

  return criteria;
}

export function groupOf(criteria: Criterion[]): FinderResult["group"] {
  const notMet = criteria.filter((c) => c.status === "notMet").length;
  const unknown = criteria.filter((c) => c.status === "unknown").length;
  if (notMet === 0 && unknown === 0) return "exact";
  if (notMet === 0) return "possible";
  if (notMet === 1) return "partial";
  return "excluded";
}
