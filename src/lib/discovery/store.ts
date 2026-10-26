"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed stores for anonymous visitors (the site has no
 * accounts). Snapshots are cached so useSyncExternalStore gets a stable
 * reference, the server snapshot is the empty fallback (so hydration never
 * mismatches), and a `storage` listener keeps multiple tabs in sync.
 */
function createLocalStore<T>(key: string, fallback: T, parse: (raw: unknown) => T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? parse(JSON.parse(raw)) : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  }

  function write(next: T) {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage full or blocked (private mode): keep the in-memory value for this tab.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        cache = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, read, () => fallback);
  }

  return { read, write, useValue };
}

const SLUG_RE = /^[a-z0-9-]{1,40}$/;

function parseSlugList(max: number) {
  return (raw: unknown): string[] =>
    Array.isArray(raw) ? [...new Set(raw.filter((s): s is string => typeof s === "string" && SLUG_RE.test(s)))].slice(0, max) : [];
}

const EMPTY: string[] = [];

export const MAX_COMPARE = 4;
const MAX_FAVORITES = 100;

export const favoritesStore = createLocalStore<string[]>("studiva:favorites:v1", EMPTY, parseSlugList(MAX_FAVORITES));
export const compareStore = createLocalStore<string[]>("studiva:compare:v1", EMPTY, parseSlugList(MAX_COMPARE));

export function useFavorites() {
  return favoritesStore.useValue();
}

export function toggleFavorite(slug: string): boolean {
  const current = favoritesStore.read();
  const isSaved = current.includes(slug);
  favoritesStore.write(isSaved ? current.filter((s) => s !== slug) : [...current, slug].slice(-MAX_FAVORITES));
  return !isSaved;
}

export function clearFavorites() {
  favoritesStore.write(EMPTY);
}

export function useCompareList() {
  return compareStore.useValue();
}

export type CompareToggleResult = "added" | "removed" | "full";

export function toggleCompare(slug: string): CompareToggleResult {
  const current = compareStore.read();
  if (current.includes(slug)) {
    compareStore.write(current.filter((s) => s !== slug));
    return "removed";
  }
  if (current.length >= MAX_COMPARE) return "full";
  compareStore.write([...current, slug]);
  return "added";
}

export function setCompareList(slugs: string[]) {
  compareStore.write(parseSlugList(MAX_COMPARE)(slugs));
}

/* ---------------------------- Application planner --------------------------- */

export type PlannerTask = { id: string; label: string; done: boolean; custom: boolean };
export type PlannerEntry = {
  id: string;
  slug: string;
  program: string;
  deadline: string | null; // ISO yyyy-mm-dd, entered by the visitor
  notes: string;
  tasks: PlannerTask[];
  createdAt: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ENTRIES = 30;
const MAX_TEXT = 2000;

function clampText(value: unknown, max: number) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function parsePlanner(raw: unknown): PlannerEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_ENTRIES).flatMap((e): PlannerEntry[] => {
    if (!e || typeof e !== "object") return [];
    const entry = e as Record<string, unknown>;
    if (typeof entry.id !== "string" || typeof entry.slug !== "string" || !SLUG_RE.test(entry.slug)) return [];
    const tasks = Array.isArray(entry.tasks)
      ? entry.tasks.slice(0, 40).flatMap((t): PlannerTask[] => {
          if (!t || typeof t !== "object") return [];
          const task = t as Record<string, unknown>;
          if (typeof task.id !== "string") return [];
          return [{ id: task.id, label: clampText(task.label, 200), done: task.done === true, custom: task.custom === true }];
        })
      : [];
    return [
      {
        id: entry.id,
        slug: entry.slug,
        program: clampText(entry.program, 200),
        deadline: typeof entry.deadline === "string" && DATE_RE.test(entry.deadline) ? entry.deadline : null,
        notes: clampText(entry.notes, MAX_TEXT),
        tasks,
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
      },
    ];
  });
}

const EMPTY_PLANNER: PlannerEntry[] = [];
export const plannerStore = createLocalStore<PlannerEntry[]>("studiva:planner:v1", EMPTY_PLANNER, parsePlanner);

export function usePlanner() {
  return plannerStore.useValue();
}

export function updatePlanner(update: (entries: PlannerEntry[]) => PlannerEntry[]) {
  plannerStore.write(parsePlanner(update(plannerStore.read())));
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** False during SSR and the hydration pass, true afterwards — for skeletons that must not flash empty states. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
