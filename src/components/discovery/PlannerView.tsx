"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarClock, Plus, Trash2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { newId, updatePlanner, useFavorites, useHydrated, usePlanner, type PlannerEntry } from "@/lib/discovery/store";
import { addToPlanner, daysUntil, DEFAULT_TASK_KEYS } from "@/lib/discovery/planner";
import { formatDate } from "@/lib/discovery/facts";
import type { UniversitySummary } from "@/lib/discovery/types";
import { toast } from "./Toaster";

const input = "w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

function patchEntry(id: string, patch: (e: PlannerEntry) => PlannerEntry) {
  updatePlanner((entries) => entries.map((e) => (e.id === id ? patch(e) : e)));
}

export default function PlannerView({ items }: { items: UniversitySummary[] }) {
  const t = useTranslations("discovery.planner");
  const locale = useLocale();
  const hydrated = useHydrated();
  const entries = usePlanner();
  const favorites = useFavorites();
  const bySlug = new Map(items.map((u) => [u.slug, u]));
  const nameOf = (slug: string) => bySlug.get(slug)?.name ?? slug;

  if (!hydrated) return <div className="h-64 animate-pulse rounded-sm bg-background-secondary" aria-busy="true" />;

  const planned = new Set(entries.map((e) => e.slug));
  const shortlistToAdd = favorites.filter((s) => bySlug.has(s) && !planned.has(s));
  const upcoming = entries
    .filter((e) => e.deadline)
    .map((e) => ({ e, days: daysUntil(e.deadline!) }))
    .sort((a, b) => a.days - b.days);

  function add(slug: string) {
    if (!slug) return;
    const ok = addToPlanner(slug);
    toast(ok ? t("added", { name: nameOf(slug) }) : t("alreadyAdded", { name: nameOf(slug) }), ok ? "success" : "info");
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1 text-sm font-semibold text-foreground-secondary">
            {t("add")}
            <select value="" onChange={(e) => add(e.target.value)} className={`${input} mt-1 font-normal`}>
              <option value="">{t("addPlaceholder")}</option>
              {items
                .filter((u) => !planned.has(u.slug))
                .map((u) => (
                  <option key={u.slug} value={u.slug}>
                    {u.name}
                  </option>
                ))}
            </select>
          </label>
          {shortlistToAdd.length > 0 && (
            <button
              type="button"
              onClick={() => shortlistToAdd.forEach((s) => addToPlanner(s))}
              className="inline-flex items-center gap-1.5 rounded-sm border border-forest px-4 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-white"
            >
              <Plus size={15} /> {t("fromShortlist")} ({shortlistToAdd.length})
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border-strong p-10 text-center">
            <CalendarClock size={32} className="mx-auto text-foreground-muted" />
            <p className="mt-4 font-display text-xl text-foreground">{t("empty")}</p>
            <p className="mt-2 text-sm text-foreground-secondary">{t("emptyBody")}</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {entries.map((entry) => (
              <PlannerCard key={entry.id} entry={entry} name={nameOf(entry.slug)} />
            ))}
          </ul>
        )}
        <p className="text-xs text-foreground-muted">{t("tasksNote")}</p>
      </div>

      <aside>
        <div className="sticky top-24 rounded-sm border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-medium text-foreground">{t("upcoming")}</h2>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-foreground-muted">{t("noDeadlines")}</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {upcoming.map(({ e, days }) => (
                <li key={e.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
                  <div className="min-w-0">
                    <a href={`#entry-${e.id}`} className="block truncate text-sm font-semibold text-foreground hover:text-forest">
                      {nameOf(e.slug)}
                    </a>
                    {e.program && <span className="block truncate text-xs text-foreground-muted">{e.program}</span>}
                    <span className="text-xs text-foreground-secondary">{formatDate(e.deadline!, locale)}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded-sm px-2 py-0.5 text-xs font-semibold ${
                      days < 0 ? "bg-background-secondary text-foreground-muted line-through" : days <= 14 ? "bg-clay-light text-clay-dark" : "bg-forest-light text-forest"
                    }`}
                  >
                    {days < 0 ? t("overdue", { count: -days }) : t("daysLeft", { count: days })}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}

function PlannerCard({ entry, name }: { entry: PlannerEntry; name: string }) {
  const t = useTranslations("discovery.planner");
  const [newTask, setNewTask] = useState("");
  const done = entry.tasks.filter((x) => x.done).length;
  const labelOf = (label: string, custom: boolean) =>
    !custom && (DEFAULT_TASK_KEYS as readonly string[]).includes(label) ? t(`defaultTasks.${label}`) : label;

  return (
    <li id={`entry-${entry.id}`} className="scroll-mt-28 rounded-sm border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/universities/${entry.slug}`} className="font-display text-xl font-medium text-foreground hover:text-forest">
          {name}
        </Link>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t("removeConfirm", { name }))) updatePlanner((list) => list.filter((e) => e.id !== entry.id));
          }}
          aria-label={`${t("remove")}: ${name}`}
          className="rounded-sm p-1.5 text-foreground-muted hover:text-clay-dark"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm text-foreground-secondary">
          {t("program")}
          <input
            value={entry.program}
            maxLength={200}
            placeholder={t("programPlaceholder")}
            onChange={(e) => patchEntry(entry.id, (x) => ({ ...x, program: e.target.value }))}
            className={`${input} mt-1`}
          />
        </label>
        <label className="block text-sm text-foreground-secondary">
          {t("deadline")}
          <input
            type="date"
            value={entry.deadline ?? ""}
            onChange={(e) => patchEntry(entry.id, (x) => ({ ...x, deadline: e.target.value || null }))}
            className={`${input} mt-1`}
          />
          <span className="mt-1 block text-xs text-foreground-muted">{t("deadlineHint")}</span>
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
          {t("tasks")}
          <span className="font-normal normal-case tracking-normal text-foreground-muted">{t("progress", { done, total: entry.tasks.length })}</span>
        </legend>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-background-secondary" aria-hidden>
          <div className="h-full bg-forest transition-all" style={{ width: `${entry.tasks.length ? (done / entry.tasks.length) * 100 : 0}%` }} />
        </div>
        <ul className="mt-3 space-y-1">
          {entry.tasks.map((task) => (
            <li key={task.id} className="group flex items-start gap-2">
              <label className="flex flex-1 cursor-pointer items-start gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => patchEntry(entry.id, (x) => ({ ...x, tasks: x.tasks.map((y) => (y.id === task.id ? { ...y, done: !y.done } : y)) }))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--forest)]"
                />
                <span className={task.done ? "text-foreground-muted line-through" : "text-foreground-secondary"}>{labelOf(task.label, task.custom)}</span>
              </label>
              <button
                type="button"
                onClick={() => patchEntry(entry.id, (x) => ({ ...x, tasks: x.tasks.filter((y) => y.id !== task.id) }))}
                aria-label={`${t("remove")}: ${labelOf(task.label, task.custom)}`}
                className="rounded-sm p-1 text-foreground-muted opacity-60 hover:text-clay-dark group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const label = newTask.trim().slice(0, 200);
            if (!label) return;
            patchEntry(entry.id, (x) => ({ ...x, tasks: [...x.tasks, { id: newId(), label, done: false, custom: true }] }));
            setNewTask("");
          }}
        >
          <label className="sr-only" htmlFor={`task-${entry.id}`}>
            {t("addTask")}
          </label>
          <input id={`task-${entry.id}`} value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder={t("taskPlaceholder")} className={input} />
          <button type="submit" className="shrink-0 rounded-sm border border-border-strong px-3 py-2 text-sm font-semibold text-foreground-secondary hover:border-forest hover:text-forest">
            {t("addTask")}
          </button>
        </form>
      </fieldset>

      <label className="mt-5 block text-sm text-foreground-secondary">
        {t("notes")}
        <textarea
          value={entry.notes}
          maxLength={2000}
          rows={3}
          placeholder={t("notesPlaceholder")}
          onChange={(e) => patchEntry(entry.id, (x) => ({ ...x, notes: e.target.value }))}
          className={`${input} mt-1`}
        />
      </label>
    </li>
  );
}
