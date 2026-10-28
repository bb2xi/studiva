"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Search } from "lucide-react";
import { DAAD_RESULT_URL, HSK_SEARCH_URL, daadFilterParams, hskFilterParams, type DaadDegree, type DaadLanguage } from "@/lib/discovery/daad";

type Institution = { slug: string; name: string; daadId: string | null; hskId: string | null };
type Database = "all" | "international";

/**
 * Builds a programme search and submits it to DAAD's own result page in a new
 * tab — a plain GET form, so nothing is fetched or mirrored by Studiva. "all"
 * searches the HRK Higher Education Compass, "international" DAAD's
 * International Programmes database.
 */
export default function ProgrammeSearch({ institutions }: { institutions: Institution[] }) {
  const t = useTranslations("discovery.programmes");
  const id = useId();
  const [database, setDatabase] = useState<Database>("all");
  const [degree, setDegree] = useState<DaadDegree | "">("");
  const [language, setLanguage] = useState<DaadLanguage | "">("");
  const [slug, setSlug] = useState("");

  const listed = (i: Institution, db: Database) => Boolean(db === "all" ? i.hskId : i.daadId);
  const available = institutions.filter((i) => listed(i, database));
  const chosen = available.find((i) => i.slug === slug);
  const filters = { degree: degree || undefined, language: language || undefined };
  const hidden =
    database === "all"
      ? hskFilterParams({ ...filters, institutionId: chosen?.hskId ?? undefined })
      : daadFilterParams({ ...filters, insId: chosen?.daadId ?? undefined });

  function chooseDatabase(next: Database) {
    setDatabase(next);
    // Not every institution is in both databases.
    if (slug && !institutions.some((i) => i.slug === slug && listed(i, next))) setSlug("");
  }

  const selectClass = "mt-1 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground";
  const option = "flex cursor-pointer items-start gap-2.5 rounded-sm border p-3 text-sm transition-colors";

  return (
    <form
      action={database === "all" ? HSK_SEARCH_URL : DAAD_RESULT_URL}
      method="get"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-sm border border-border bg-surface p-5 sm:p-6"
      aria-describedby={`${id}-note`}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-foreground">{t("database")}</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(["all", "international"] as const).map((db) => (
            <label key={db} className={`${option} ${database === db ? "border-forest bg-forest-light" : "border-border-strong hover:border-forest"}`}>
              {/* form="": still one radio group, but not sent to DAAD with the search */}
              <input type="radio" name={`${id}-database`} form="" checked={database === db} onChange={() => chooseDatabase(db)} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
              <span>
                <span className="block font-semibold text-foreground">{t(db === "all" ? "databaseAll" : "databaseInternational")}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-foreground-secondary">{t(db === "all" ? "databaseAllHint" : "databaseInternationalHint")}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-foreground">{t("keyword")}</span>
          <input name={database === "all" ? "hec-q" : "q"} type="search" placeholder={t("keywordPlaceholder")} className={selectClass} autoComplete="off" />
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
            <option value="english">{t(database === "all" ? "englishMain" : "english")}</option>
            <option value="german">{t(database === "all" ? "germanMain" : "german")}</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-foreground">{t("institution")}</span>
          <select value={chosen ? slug : ""} onChange={(e) => setSlug(e.target.value)} className={selectClass}>
            <option value="">{t("institutionAny")}</option>
            {available.map((i) => (
              <option key={i.slug} value={i.slug}>
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
          className="inline-flex items-center gap-2 rounded-sm bg-brand-fill px-4 py-2 text-sm font-semibold text-white hover:bg-brand-fill-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
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
