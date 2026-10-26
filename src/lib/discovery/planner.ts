"use client";

import { newId, updatePlanner, plannerStore, type PlannerEntry } from "./store";

/** Default reminders — stored by key so they render in whichever language is active. */
export const DEFAULT_TASK_KEYS = ["requirements", "deadline", "uniAssist", "transcripts", "translations", "aps", "language", "visa"] as const;

/** Returns false when the university is already in the planner. */
export function addToPlanner(slug: string): boolean {
  if (plannerStore.read().some((e) => e.slug === slug)) return false;
  const entry: PlannerEntry = {
    id: newId(),
    slug,
    program: "",
    deadline: null,
    notes: "",
    tasks: DEFAULT_TASK_KEYS.map((key) => ({ id: newId(), label: key, done: false, custom: false })),
    createdAt: new Date().toISOString(),
  };
  updatePlanner((entries) => [...entries, entry]);
  return true;
}

/** Whole days from today (local) to an ISO date; negative when past. */
export function daysUntil(iso: string, today = new Date()) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}
