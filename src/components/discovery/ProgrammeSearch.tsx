"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Search } from "lucide-react";
import { DAAD_RESULT_URL, daadFilterParams, type DaadDegree, type DaadLanguage } from "@/lib/discovery/daad";

type Institution = { insId: string; name: string };

/**
 * Builds a DAAD programme search and submits it to DAAD's own result page in a
 * new tab — a plain GET form, so nothing is fetched or mirrored by Studiva.
 */
export default function ProgrammeSearch({ institutions }: { institutions: Institution[] }) {
  const t = useTranslations("discovery.programmes");
  const id = useId();
  const [degree, setDegree] = useState<DaadDegree | "">("");
  const [language, setLanguage] = useState<DaadLanguage | "">("english");
  const [insId, setInsId] = useState("");
  const hidden = daadFilterParams({ insId: insId || undefined, degree: degree || undefined, language: language || undefined });

  const selectClass = "mt-1 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground";

  return (
    <form action={DAAD_RESULT_URL} method="get" target="_blank" rel="noopener noreferrer" className="rounded-sm border border-border bg-surface p-5 sm:p-6" aria-describedby={`${id}-note`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-foreground">{t("keyword")}</span>
          <input name="q" type="search" placeholder={t("keywordPlaceholder")} className={selectClass} autoComplete="off" />
          <span className="mt-1 block text-xs text-foreground-muted">{t("keywordHint")}</span>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-foreground">{t("degree")}</span>
          <select value={degree} onChange={(e) => setDegree(e.target.value as DaadDegree | "")} className={selectClass}>
            <option value="">{t("degreeAny")}</option>
            <option value="bachelor">{t("bachelor")}</option>
            <option value="master">{t("master")}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-foreground">{t("language")}</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value as DaadLanguage | "")} className={selectClass}>
            <option value="">{t("languageAny")}</option>
            <option value="english">{t("english")}</option>
            <option value="german">{t("german")}</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-foreground">{t("institution")}</span>
          <select value={insId} onChange={(e) => setInsId(e.target.value)} className={selectClass}>
            <option value="">{t("institutionAny")}</option>
            {institutions.map((i) => (
              <option key={i.insId} value={i.insId}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {hidden.map(([name, value], i) => (
        <input key={`${name}-${value}-${i}`} type="hidden" name={name} value={value} />
      ))}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
        >
          <Search size={15} aria-hidden />
          {t("submit")}
          <ExternalLink size={13} aria-hidden />
        </button>
        <p id={`${id}-note`} className="text-xs text-foreground-muted">
          {t("opensNote")}
        </p>
      </div>
    </form>
  );
}
