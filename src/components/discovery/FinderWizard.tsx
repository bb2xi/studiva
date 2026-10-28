"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check, X, HelpCircle, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BUDGET_OPTIONS, EMPTY_ANSWERS, evaluate, groupOf, parseAnswers, serializeAnswers, type FinderAnswers, type FinderResult } from "@/lib/discovery/finder";
import { TYPE_KEY_LIST } from "@/lib/discovery/directory";
import { formatEurRange } from "@/lib/discovery/facts";
import { STATES, STATE_BY_CODE } from "@/data/states";
import { SUBJECT_AREAS, type UniversitySummary } from "@/lib/discovery/types";
import { CompareButton, FavoriteButton } from "./ToggleButtons";

const STEPS = ["level", "subject", "english", "states", "type", "ownership", "budget"] as const;

const option =
  "flex w-full cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm transition-colors focus-within:ring-2 focus-within:ring-brand/50";
const optionOn = "border-forest bg-forest-light text-foreground";
const optionOff = "border-border-strong bg-surface text-foreground-secondary hover:border-forest";

export default function FinderWizard({ items }: { items: UniversitySummary[] }) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const lang = locale === "tr" ? "tr" : "en";
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const answers = useMemo(() => parseAnswers(params), [params]);
  const stepParam = params.get("step");
  const stepIndex = stepParam === "results" ? STEPS.length : Math.min(Math.max(Number.parseInt(stepParam ?? "0", 10) || 0, 0), STEPS.length - 1);

  function go(next: FinderAnswers, step: number | "results") {
    router.replace(`${pathname}?${serializeAnswers(next, String(step))}`, { scroll: false });
  }
  const set = (patch: Partial<FinderAnswers>) => go({ ...answers, ...patch }, stepIndex);

  const results = useMemo(() => {
    const labels = {
      level: (l: string) => t(`levels.${l}`),
      state: (c: keyof typeof STATE_BY_CODE) => STATE_BY_CODE[c].name[lang],
      type: (ty: string) => t(`types.${ty}`),
      ownership: (o: string) => t(`ownership.${o}`),
      range: (min: number | null, max: number | null) => formatEurRange(min, max, locale) ?? "",
    };
    return items
      .map((uni): FinderResult => {
        const criteria = evaluate(uni, answers, labels);
        return { uni, criteria, group: groupOf(criteria) };
      })
      .sort((a, b) => b.criteria.filter((c) => c.status === "met").length - a.criteria.filter((c) => c.status === "met").length || a.uni.name.localeCompare(b.uni.name, locale));
  }, [items, answers, t, lang, locale]);

  if (stepIndex === STEPS.length) {
    const groups = (["exact", "possible", "partial"] as const).map((g) => ({ g, list: results.filter((r) => r.group === g) }));
    const excluded = results.filter((r) => r.group === "excluded").length;
    const anyCriteria = results[0]?.criteria.length ?? 0;
    return (
      <div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => go(answers, 0)} className="rounded-sm border border-border-strong px-4 py-2 text-sm font-semibold text-foreground-secondary hover:border-forest hover:text-forest">
            {t("finder.editAnswers")}
          </button>
          <button type="button" onClick={() => go(EMPTY_ANSWERS, 0)} className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-clay-dark hover:text-clay">
            <RotateCcw size={14} /> {t("finder.startOver")}
          </button>
        </div>
        {anyCriteria === 0 && <p className="mt-6 text-sm text-foreground-secondary">{t("finder.results.none")}</p>}
        {groups.map(({ g, list }) =>
          list.length === 0 ? null : (
            <section key={g} className="mt-10" aria-labelledby={`finder-${g}`}>
              <h2 id={`finder-${g}`} className="font-display text-2xl font-semibold text-foreground">
                {t(`finder.results.${g}`)} <span className="text-base font-normal text-foreground-muted">({list.length})</span>
              </h2>
              <p className="mt-1 text-sm text-foreground-secondary">{t(`finder.results.${g}Note`)}</p>
              <ResultList collapsed={g === "partial" && list.length > 6} label={`${t(`finder.results.${g}`)} (${list.length})`}>
                {list.map(({ uni, criteria }) => (
                  <li key={uni.slug} className="rounded-sm border border-border bg-surface p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/universities/${uni.slug}`} className="font-display text-lg font-medium text-foreground hover:text-forest">
                          {uni.name}
                        </Link>
                        <p className="text-xs text-foreground-muted">{uni.cityLabel}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <CompareButton slug={uni.slug} name={uni.name} />
                        <FavoriteButton slug={uni.slug} name={uni.name} />
                      </div>
                    </div>
                    {criteria.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {criteria.map((c) => (
                          <li key={c.key} className="flex items-start gap-2 text-sm">
                            {c.status === "met" ? (
                              <Check size={16} className="mt-0.5 shrink-0 text-forest" aria-label={t("finder.results.met")} />
                            ) : c.status === "notMet" ? (
                              <X size={16} className="mt-0.5 shrink-0 text-clay" aria-label={t("finder.results.notMet")} />
                            ) : (
                              <HelpCircle size={16} className="mt-0.5 shrink-0 text-foreground-muted" aria-label={t("finder.results.unknown")} />
                            )}
                            <span className="text-foreground-secondary">
                              <span className="font-semibold text-foreground">{t(`finder.criteria.${c.key}`)}:</span>{" "}
                              {t(`finder.reasons.${c.reason.key}`, c.reason.values ?? {})}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ResultList>
            </section>
          )
        )}
        {excluded > 0 && <p className="mt-10 text-sm text-foreground-muted">{t("finder.results.excluded", { count: excluded })}</p>}
        {groups.every((g) => g.list.length === 0) && <p className="mt-10 text-sm text-foreground-secondary">{t("finder.results.none")}</p>}
      </div>
    );
  }

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{t("finder.step", { current: stepIndex + 1, total: STEPS.length })}</p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background-secondary" aria-hidden>
        <div className="h-full bg-forest transition-all" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
      </div>
      <fieldset className="mt-6">
        <legend className="font-display text-2xl font-semibold text-foreground">{t(`finder.questions.${step}`)}</legend>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {step === "level" &&
            (["bachelor", "master", "phd"] as const).map((l) => (
              <label key={l} className={`${option} ${answers.level === l ? optionOn : optionOff}`}>
                <input type="radio" name="level" className="sr-only" checked={answers.level === l} onChange={() => set({ level: l })} />
                {t(`levels.${l}`)}
              </label>
            ))}
          {step === "subject" && (
            <>
              <p className="text-xs text-foreground-muted sm:col-span-2">{t("finder.subjectNote")}</p>
              {SUBJECT_AREAS.map((s) => (
                <label key={s} className={`${option} ${answers.subject === s ? optionOn : optionOff}`}>
                  <input type="radio" name="subject" className="sr-only" checked={answers.subject === s} onChange={() => set({ subject: s })} />
                  {t(`subjects.${s}`)}
                </label>
              ))}
            </>
          )}
          {step === "english" &&
            ([true, null] as const).map((v) => (
              <label key={String(v)} className={`${option} ${answers.english === v ? optionOn : optionOff}`}>
                <input type="radio" name="english" className="sr-only" checked={answers.english === v} onChange={() => set({ english: v })} />
                {v ? t("finder.options.englishYes") : t("finder.options.englishNo")}
              </label>
            ))}
          {step === "states" &&
            STATES.map((s) => (
              <label key={s.code} className={`${option} ${answers.states.includes(s.code) ? optionOn : optionOff}`}>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--forest)]"
                  checked={answers.states.includes(s.code)}
                  onChange={() => set({ states: answers.states.includes(s.code) ? answers.states.filter((x) => x !== s.code) : [...answers.states, s.code] })}
                />
                {s.name[lang]}
              </label>
            ))}
          {step === "type" &&
            TYPE_KEY_LIST.map((k) => (
              <label key={k} className={`${option} ${answers.types.includes(k) ? optionOn : optionOff}`}>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--forest)]"
                  checked={answers.types.includes(k)}
                  onChange={() => set({ types: answers.types.includes(k) ? answers.types.filter((x) => x !== k) : [...answers.types, k] })}
                />
                {t(`types.${k}`)}
              </label>
            ))}
          {step === "ownership" &&
            (["public", "any"] as const).map((o) => (
              <label key={o} className={`${option} ${answers.ownership === o ? optionOn : optionOff}`}>
                <input type="radio" name="ownership" className="sr-only" checked={answers.ownership === o} onChange={() => set({ ownership: o })} />
                {o === "public" ? t("finder.options.public") : t("finder.options.private")}
              </label>
            ))}
          {step === "budget" &&
            [...BUDGET_OPTIONS, null].map((b) => (
              <label key={String(b)} className={`${option} ${answers.budget === b ? optionOn : optionOff}`}>
                <input type="radio" name="budget" className="sr-only" checked={answers.budget === b} onChange={() => set({ budget: b })} />
                {b === null ? t("finder.options.budgetAny") : t(`finder.options.budget${b}`)}
              </label>
            ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={stepIndex === 0}
          onClick={() => go(answers, stepIndex - 1)}
          className="rounded-sm border border-border-strong px-4 py-2 text-sm font-semibold text-foreground-secondary hover:border-forest hover:text-forest disabled:opacity-40"
        >
          {t("finder.back")}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const cleared: Partial<FinderAnswers> =
                step === "level" ? { level: null } : step === "subject" ? { subject: null } : step === "english" ? { english: null } : step === "states" ? { states: [] } : step === "type" ? { types: [] } : step === "ownership" ? { ownership: null } : { budget: null };
              go({ ...answers, ...cleared }, isLast ? "results" : stepIndex + 1);
            }}
            className="px-3 py-2 text-sm font-semibold text-foreground-muted hover:text-foreground"
          >
            {t("finder.skip")}
          </button>
          <button
            type="button"
            onClick={() => go(answers, isLast ? "results" : stepIndex + 1)}
            className="rounded-sm bg-brand-fill px-5 py-2 text-sm font-semibold text-white hover:bg-brand-fill-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
          >
            {isLast ? t("finder.seeResults") : t("finder.next")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultList({ collapsed, label, children }: { collapsed: boolean; label: string; children: React.ReactNode }) {
  const list = <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</ul>;
  if (!collapsed) return list;
  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-semibold text-forest underline underline-offset-2">{label}</summary>
      {list}
    </details>
  );
}
