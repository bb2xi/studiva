"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { SCHOLARSHIPS, nextDeadline, type ScholarshipLevel } from "@/data/references";
import { formatDate } from "@/lib/discovery/facts";
import { useHydrated } from "@/lib/discovery/store";
import { Tag } from "@/components/Tag";

export default function ScholarshipList() {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const lang = locale === "tr" ? "tr" : "en";
  const hydrated = useHydrated();
  const [level, setLevel] = useState<ScholarshipLevel | "">("");
  const [provider, setProvider] = useState("");
  const list = SCHOLARSHIPS.filter((s) => (!level || s.levels.includes(level)) && (!provider || s.providerType === provider));
  const providerTypes = [...new Set(SCHOLARSHIPS.map((s) => s.providerType))];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
        <label className="block text-sm font-semibold text-foreground-secondary">
          {t("scholarships.filters.level")}
          <select value={level} onChange={(e) => setLevel(e.target.value as ScholarshipLevel | "")} className="mt-1 block w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm font-normal text-foreground sm:w-56">
            <option value="">{t("scholarships.filters.any")}</option>
            {(["bachelor", "master", "phd"] as const).map((l) => (
              <option key={l} value={l}>
                {t(`levels.${l}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-foreground-secondary">
          {t("scholarships.filters.provider")}
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 block w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm font-normal text-foreground sm:w-56">
            <option value="">{t("scholarships.filters.any")}</option>
            {providerTypes.map((p) => (
              <option key={p} value={p}>
                {t(`scholarships.providerTypes.${p}`)}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-foreground-muted sm:ml-auto" aria-live="polite">
          {t("scholarships.count", { count: list.length })}
        </p>
      </div>

      {list.length === 0 ? (
        <p className="mt-8 text-sm text-foreground-secondary">{t("scholarships.empty")}</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {list.map((s) => {
            const next = hydrated ? nextDeadline(s, new Date()) : null;
            return (
              <li key={s.id} className="flex flex-col rounded-sm border border-border bg-surface p-6">
                <div className="flex flex-wrap gap-1.5">
                  <Tag variant="neutral">{t(`scholarships.providerTypes.${s.providerType}`)}</Tag>
                  {s.levels.map((l) => (
                    <Tag key={l} variant="forest">
                      {t(`levels.${l}`)}
                    </Tag>
                  ))}
                </div>
                <h2 className="mt-3 font-display text-xl font-medium text-foreground">{s.name}</h2>
                <p className="text-xs text-foreground-muted">{s.provider}</p>
                <dl className="mt-4 flex-1 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("scholarships.eligibility")}</dt>
                    <dd className="mt-1 leading-relaxed text-foreground-secondary">{s.eligibility[lang]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("scholarships.funding")}</dt>
                    <dd className="mt-1 leading-relaxed text-foreground-secondary">{s.funding[lang]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("scholarships.deadline")}</dt>
                    <dd className="mt-1 leading-relaxed text-foreground-secondary">
                      {next ? (
                        <span className="font-semibold text-foreground">
                          {t("scholarships.status.open")}: {formatDate(next.toISOString().slice(0, 10), locale)}
                        </span>
                      ) : (
                        <span className="font-semibold text-foreground">{t("scholarships.status.varies")}</span>
                      )}
                      <span className="block">{s.deadlineNote[lang]}</span>
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                  <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-brand">
                    {t("scholarships.official")} <ExternalLink size={13} />
                  </a>
                  <span className="text-xs text-foreground-muted">{t("scholarships.lastChecked", { date: formatDate(s.checkedAt, locale) })}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-8 text-xs text-foreground-muted">
        {t("scholarships.notListed")} {t("common.verifyNotice")}
      </p>
    </div>
  );
}
