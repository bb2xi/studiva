"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, Link2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { compareStore, setCompareList, MAX_COMPARE } from "@/lib/discovery/store";
import { formatDate, formatEurExact, formatEurRange, formatTerm, hostOf, levelOf } from "@/lib/discovery/facts";
import { SUBJECT_AREAS } from "@/lib/discovery/types";
import { STATE_BY_CODE, cityName } from "@/data/states";
import type { UniversitySummary } from "@/lib/discovery/types";
import { toast } from "./Toaster";

export default function CompareView({ items }: { items: UniversitySummary[] }) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const lang = locale === "tr" ? "tr" : "en";
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const bySlug = useMemo(() => new Map(items.map((u) => [u.slug, u])), [items]);
  const ids = useMemo(
    () => [...new Set((params.get("ids") ?? "").split(",").filter((s) => bySlug.has(s)))].slice(0, MAX_COMPARE),
    [params, bySlug]
  );
  const selected = ids.map((id) => bySlug.get(id)!);

  // A bare /compare link falls back to whatever the visitor picked while browsing.
  useEffect(() => {
    if (ids.length === 0) {
      const stored = compareStore.read().filter((s) => bySlug.has(s));
      if (stored.length) router.replace(`${pathname}?ids=${stored.join(",")}`, { scroll: false });
    } else {
      setCompareList(ids);
    }
  }, [ids, bySlug, pathname, router]);

  function setIds(next: string[]) {
    setCompareList(next);
    router.replace(next.length ? `${pathname}?ids=${next.join(",")}` : pathname, { scroll: false });
  }

  const notVerified = <span className="text-foreground-muted">{t("common.notVerified")}</span>;
  const rows: { key: string; label: string; note?: string; render: (u: UniversitySummary) => React.ReactNode }[] = [
    { key: "type", label: t("compare.rows.type"), render: (u) => t(`types.${u.type}`) },
    {
      key: "location",
      label: t("compare.rows.location"),
      render: (u) => (
        <>
          {u.cities.length ? u.cities.map((c) => cityName(c, locale)).join(", ") : u.cityLabel}
          {u.state && <span className="block text-xs text-foreground-muted">{STATE_BY_CODE[u.state].name[lang]}</span>}
        </>
      ),
    },
    { key: "ownership", label: t("compare.rows.ownership"), render: (u) => (u.facts?.ownership ? t(`ownership.${u.facts.ownership}`) : notVerified) },
    { key: "levels", label: t("compare.rows.levels"), render: (u) => t(`levels.${levelOf(u)}`) },
    {
      key: "programmeCount",
      label: t("compare.rows.programmeCount"),
      note: t("compare.programmeCountNote"),
      render: (u) => {
        const h = u.facts?.hsk;
        if (!h) return notVerified;
        return (
          <>
            <span className="font-semibold">{h.programmes}</span>
            <span className="block text-xs text-foreground-muted">{t("compare.programmeSplit", { undergraduate: h.undergraduate, graduate: h.graduate })}</span>
          </>
        );
      },
    },
    {
      key: "subjects",
      label: t("compare.rows.subjects"),
      render: (u) => {
        const areas = u.facts?.subjectAreas;
        if (!areas) return notVerified;
        return SUBJECT_AREAS.filter((s) => areas.includes(s))
          .map((s) => t(`subjects.${s}`))
          .join(", ");
      },
    },
    {
      key: "tuition",
      label: t("compare.rows.tuition"),
      render: (u) => {
        const tu = u.facts?.nonEuTuition;
        if (!tu || tu.status === "unknown") return notVerified;
        const range = formatEurRange(tu.minEur, tu.maxEur, locale);
        return (
          <>
            <span className="font-semibold">{t(`fee.${tu.status}`)}</span>
            {range && <span className="block">{range} {t("common.perSemester")}</span>}
            {tu.source && (
              <a href={tu.source} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-forest underline underline-offset-2">
                {t("common.source")} <ExternalLink size={10} />
              </a>
            )}
          </>
        );
      },
    },
    {
      key: "contribution",
      label: t("compare.rows.contribution"),
      render: (u) => {
        const c = u.facts?.semesterContribution;
        if (c?.amountEur == null || !c.term) return notVerified;
        return (
          <>
            <span className="font-semibold">{formatEurExact(c.amountEur, locale)}</span>
            <span className="block text-xs text-foreground-muted">{formatTerm(c.term, locale)}</span>
          </>
        );
      },
    },
    {
      key: "english",
      label: t("compare.rows.english"),
      note: t("compare.englishNote"),
      render: (u) => {
        const daad = u.facts?.daad;
        const hsk = u.facts?.hsk;
        if (daad && daad.englishProgrammes > 0) return t("compare.englishCount", { count: daad.englishProgrammes });
        if (hsk && hsk.english > 0) return `${t("compare.englishCount", { count: hsk.english })} (HRK)`;
        return notVerified;
      },
    },
    { key: "programs", label: t("compare.rows.programs"), note: t("compare.programsNote"), render: (u) => u.popularPrograms.join(", ") },
    {
      key: "uniAssist",
      label: t("compare.rows.uniAssist"),
      render: (u) => (u.facts?.uniAssistMember === true ? t("compare.uniAssistYes") : u.facts?.uniAssistMember === false ? t("compare.uniAssistNo") : notVerified),
    },
    {
      key: "distinctions",
      label: t("compare.rows.distinctions"),
      render: (u) => [u.badges.includes("tu9") && "TU9", u.badges.includes("excellence") && (lang === "tr" ? "Exzellenzuniversität" : "Excellence University")].filter(Boolean).join(", ") || "—",
    },
    { key: "competition", label: `${t("compare.rows.competition")} (${t("common.guidance")})`, render: (u) => t(`compare.competition.${u.competitiveness}`) },
    {
      key: "official",
      label: t("compare.rows.official"),
      render: (u) =>
        u.facts?.officialUrl ? (
          <a href={u.facts.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-forest underline underline-offset-2">
            {hostOf(u.facts.officialUrl)} <ExternalLink size={11} />
          </a>
        ) : (
          notVerified
        ),
    },
    { key: "rankings", label: t("compare.rows.rankings"), render: () => <span className="text-xs text-foreground-muted">{t("compare.rankingsNote")}</span> },
    { key: "data", label: t("compare.rows.data"), render: (u) => (u.facts ? `${formatDate(u.facts.checkedAt, locale)} · ${u.completeness.filled}/${u.completeness.total}` : notVerified) },
  ];

  const available = items.filter((u) => !ids.includes(u.slug));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block text-sm font-semibold text-foreground-secondary">
          {t("compare.addLabel")}
          <select
            value=""
            disabled={ids.length >= MAX_COMPARE}
            onChange={(e) => e.target.value && setIds([...ids, e.target.value])}
            className="mt-1 block w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm font-normal text-foreground disabled:opacity-50 sm:w-80"
          >
            <option value="">{ids.length >= MAX_COMPARE ? t("compare.max") : t("compare.addPlaceholder")}</option>
            {available.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        {ids.length > 0 && (
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                toast(t("compare.copied"));
              } catch {
                /* clipboard blocked — the URL bar still has the shareable link */
              }
            }}
            className="inline-flex items-center gap-1.5 self-start rounded-sm border border-border-strong px-3 py-2 text-xs font-semibold text-foreground-secondary hover:border-forest hover:text-forest sm:self-auto"
          >
            <Link2 size={14} />
            {t("compare.share")}
          </button>
        )}
      </div>

      {selected.length < 2 ? (
        <div className="mt-8 rounded-sm border border-dashed border-border-strong p-10 text-center">
          <p className="font-display text-xl text-foreground">{t("compare.empty")}</p>
          <p className="mt-2 text-sm text-foreground-secondary">{t("compare.emptyBody")}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/universities" className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              {t("shortlist.browse")}
            </Link>
            <Link href="/shortlist" className="rounded-sm border border-forest px-4 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-white">
              {t("nav.shortlist")}
            </Link>
          </div>
          {selected.length === 1 && <p className="mt-4 text-sm text-foreground-secondary">{selected[0].name}</p>}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-border" tabIndex={0} aria-label={t("compare.title")}>
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">{t("compare.title")}</caption>
            <thead>
              <tr className="bg-background-secondary">
                <th scope="col" className="sticky left-0 z-10 w-40 bg-background-secondary p-3 text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
                  <span className="sr-only">{t("compare.rows.type")}</span>
                </th>
                {selected.map((u) => (
                  <th key={u.slug} scope="col" className="min-w-[180px] p-3 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/universities/${u.slug}`} className="font-display text-base font-medium text-foreground hover:text-forest">
                        {u.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIds(ids.filter((id) => id !== u.slug))}
                        aria-label={`${t("common.remove")}: ${u.name}`}
                        className="shrink-0 rounded-sm p-1 text-foreground-muted hover:text-clay-dark"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-border">
                  <th scope="row" className="sticky left-0 z-10 bg-surface p-3 align-top text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
                    {row.label}
                    {row.note && <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-foreground-muted">{row.note}</span>}
                  </th>
                  {selected.map((u) => (
                    <td key={u.slug} className="bg-surface p-3 align-top text-foreground">
                      {row.render(u)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
