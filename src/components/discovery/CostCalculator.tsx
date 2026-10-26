"use client";

import { useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { COST_REFERENCE } from "@/data/references";
import { formatDate, formatEur, formatEurRange } from "@/lib/discovery/facts";
import type { UniversitySummary } from "@/lib/discovery/types";

type MonthlyKey = "rent" | "food" | "transport" | "health" | "personal" | "other";
const MONTHLY_KEYS: MonthlyKey[] = ["rent", "food", "transport", "health", "personal", "other"];
/** Only items the cited survey publishes get a default; the rest start empty rather than guessed. */
const DEFAULTS: Partial<Record<MonthlyKey, number>> = COST_REFERENCE.monthly;

function parseAmount(raw: string) {
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 100000) : 0;
}

export default function CostCalculator({ universities }: { universities: UniversitySummary[] }) {
  const t = useTranslations("discovery.costs");
  const tc = useTranslations("discovery.common");
  const locale = useLocale();
  const id = useId();
  const [values, setValues] = useState<Record<MonthlyKey, string>>(() =>
    Object.fromEntries(MONTHLY_KEYS.map((k) => [k, DEFAULTS[k] !== undefined ? String(DEFAULTS[k]) : ""])) as Record<MonthlyKey, string>
  );
  const [edited, setEdited] = useState<Set<MonthlyKey>>(new Set());
  const [slug, setSlug] = useState("");
  const [tuition, setTuition] = useState("0");
  const [contribution, setContribution] = useState("");

  const uni = universities.find((u) => u.slug === slug) ?? null;
  const uniTuition = uni?.facts?.nonEuTuition;

  function chooseUniversity(next: string) {
    setSlug(next);
    const u = universities.find((x) => x.slug === next);
    const tu = u?.facts?.nonEuTuition;
    if (!tu) return;
    if (tu.status === "none") setTuition("0");
    else if (tu.status === "charged" && tu.minEur !== null && tu.minEur === tu.maxEur) setTuition(String(tu.minEur));
    const amount = u?.facts?.semesterContribution.amountEur;
    if (amount != null) setContribution(String(amount));
  }

  const totals = useMemo(() => {
    const monthly = MONTHLY_KEYS.reduce((sum, k) => sum + parseAmount(values[k]), 0);
    const perSemesterFees = parseAmount(tuition) + parseAmount(contribution);
    return {
      monthly,
      monthlyAll: monthly + perSemesterFees / 6,
      annual: monthly * 12 + perSemesterFees * 2,
    };
  }, [values, tuition, contribution]);

  const fieldClass = "w-full rounded-sm border border-border-strong bg-surface py-2 pl-3 pr-12 text-right text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
      <form className="space-y-6 lg:col-span-3" onSubmit={(e) => e.preventDefault()} aria-describedby={`${id}-disclaimer`}>
        <label className="block">
          <span className="text-sm font-semibold text-foreground">{t("university")}</span>
          <select value={slug} onChange={(e) => chooseUniversity(e.target.value)} className="mt-1 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground">
            <option value="">{t("universityNone")}</option>
            {universities.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="rounded-sm border border-border p-5">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("monthly")}</legend>
          <div className="space-y-4">
            {MONTHLY_KEYS.map((k) => {
              const hasDefault = DEFAULTS[k] !== undefined;
              const isEdited = edited.has(k);
              const showChip = isEdited || hasDefault;
              return (
                <div key={k} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_10rem]">
                  <label htmlFor={`${id}-${k}`} className="text-sm text-foreground">
                    {t(`inputs.${k}`)}
                    {showChip && (
                      <span className={`ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${isEdited ? "bg-brand-light text-brand" : "bg-forest-light text-forest"}`}>
                        {isEdited ? t("userValue") : t("sourced")}
                      </span>
                    )}
                    {hasDefault && edited.has(k) && (
                      <button
                        type="button"
                        onClick={() => {
                          setValues((v) => ({ ...v, [k]: String(DEFAULTS[k]) }));
                          setEdited((s) => {
                            const n = new Set(s);
                            n.delete(k);
                            return n;
                          });
                        }}
                        className="ml-2 inline-flex items-center gap-1 text-xs text-foreground-muted underline hover:text-forest"
                      >
                        <RotateCcw size={11} /> {t("reset")}
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      id={`${id}-${k}`}
                      inputMode="decimal"
                      value={values[k]}
                      placeholder="0"
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d.,]/g, "");
                        setValues((v) => ({ ...v, [k]: raw }));
                        setEdited((s) => new Set(s).add(k));
                      }}
                      className={fieldClass}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">€</span>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="rounded-sm border border-border p-5">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("semester")}</legend>
          <div className="space-y-4">
            <div>
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_10rem]">
                <label htmlFor={`${id}-tuition`} className="text-sm text-foreground">
                  {t("inputs.tuition")}
                </label>
                <div className="relative">
                  <input id={`${id}-tuition`} inputMode="decimal" value={tuition} onChange={(e) => setTuition(e.target.value.replace(/[^\d.,]/g, ""))} className={fieldClass} />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">€</span>
                </div>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
                {uni && uniTuition && uniTuition.status !== "unknown"
                  ? uniTuition.minEur !== null && uniTuition.maxEur !== uniTuition.minEur
                    ? t("tuitionRangeFromUni", { name: uni.name, range: formatEurRange(uniTuition.minEur, uniTuition.maxEur, locale) ?? "" })
                    : t("tuitionFromUni", { name: uni.name })
                  : t("tuitionHint")}
              </p>
            </div>
            <div>
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_10rem]">
                <label htmlFor={`${id}-contribution`} className="text-sm text-foreground">
                  {t("inputs.contribution")}
                </label>
                <div className="relative">
                  <input id={`${id}-contribution`} inputMode="decimal" placeholder="0" value={contribution} onChange={(e) => setContribution(e.target.value.replace(/[^\d.,]/g, ""))} className={fieldClass} />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">€</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-foreground-muted">{t("contributionHint")}</p>
            </div>
          </div>
        </fieldset>
      </form>

      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-5">
          <section aria-labelledby={`${id}-results`} className="rounded-sm border border-border bg-surface p-6" aria-live="polite">
            <h2 id={`${id}-results`} className="font-display text-xl font-medium text-foreground">
              {t("results")}
            </h2>
            <dl className="mt-4 divide-y divide-border">
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-sm text-foreground-secondary">{t("monthlyLiving")}</dt>
                <dd className="text-lg font-semibold tabular-nums text-foreground">{formatEur(totals.monthly, locale)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-sm text-foreground-secondary">{t("monthlyAll")}</dt>
                <dd className="text-lg font-semibold tabular-nums text-foreground">{formatEur(Math.round(totals.monthlyAll), locale)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-sm font-semibold text-foreground">{t("annual")}</dt>
                <dd className="text-2xl font-bold tabular-nums text-forest">{formatEur(Math.round(totals.annual), locale)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-foreground-muted">{t("method")}</p>
            <p className="mt-1 text-xs text-foreground-muted">{t("currency")}</p>
          </section>

          <section className="rounded-sm border border-border bg-background-secondary p-6">
            <h2 className="font-display text-lg font-medium text-foreground">{t("visaTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              {t("visaBody", { month: formatEur(COST_REFERENCE.visaPerMonth, locale), year: formatEur(COST_REFERENCE.visaPerMonth * 12, locale) })}
            </p>
          </section>

          <section className="text-xs leading-relaxed text-foreground-muted">
            <h2 className="font-semibold uppercase tracking-wide">{t("sources")}</h2>
            <ul className="mt-1 space-y-1">
              <li>
                {t("sourceSurvey", { date: formatDate(COST_REFERENCE.checkedAt, locale) })}{" "}
                <a href={COST_REFERENCE.source} target="_blank" rel="noopener noreferrer" className="text-forest underline">
                  daad.de
                </a>
              </li>
              <li>{t("sourceVisa", { date: formatDate(COST_REFERENCE.checkedAt, locale) })}</li>
            </ul>
            <p id={`${id}-disclaimer`} className="mt-3">
              {t("disclaimer")} {tc("verifyNotice")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
