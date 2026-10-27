"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, ArrowUpDown, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { STATE_BY_CODE } from "@/data/states";
import type { SortKey } from "@/lib/discovery/directory";
import type { DirectoryItem } from "@/lib/discovery/types";
import { CompareButton, FavoriteButton } from "./ToggleButtons";
import { useDirectoryFacts } from "./UniversityCard";

/** Columns that sort, with the direction each sort uses. */
const SORTABLE: Partial<Record<string, { key: SortKey; dir: "ascending" | "descending" }>> = {
  name: { key: "name", dir: "ascending" },
  state: { key: "state", dir: "ascending" },
  contribution: { key: "contribution", dir: "ascending" },
  programmes: { key: "programmes", dir: "descending" },
  english: { key: "english", dir: "descending" },
};

const FEE_DOT = { none: "bg-forest", charged: "bg-clay", varies: "bg-clay", unknown: "bg-foreground-muted" } as const;

// Below xl the table scrolls sideways in its own box, so the header cannot stick to the page; the name column sticks instead.
// From xl the table fits its column and the header sticks under the toolbar (its bottom edge is --directory-toolbar-bottom).
const th =
  "px-2 py-2.5 align-bottom text-[11px] font-semibold uppercase leading-tight tracking-wide text-foreground-secondary bg-background xl:sticky xl:top-[var(--directory-toolbar-bottom,8rem)] xl:z-20";
const stickyName = "sticky left-0 border-r border-border xl:static xl:border-r-0";

export default function DirectoryTable({
  items,
  sort,
  onSort,
  onShowOnMap,
}: {
  items: DirectoryItem[];
  sort: SortKey;
  onSort: (key: SortKey) => void;
  onShowOnMap: (slug: string) => void;
}) {
  const t = useTranslations("discovery");

  function Header({ column, label, align = "left", className = "" }: { column: string; label: string; align?: "left" | "right"; className?: string }) {
    const sortable = SORTABLE[column];
    const active = sortable?.key === sort;
    const Icon = !sortable ? null : active ? (sortable.dir === "descending" ? ArrowDown : ArrowUp) : ArrowUpDown;
    return (
      <th scope="col" aria-sort={active ? sortable.dir : undefined} className={`${th} ${align === "right" ? "text-right" : "text-left"} ${className}`}>
        {sortable && Icon ? (
          <button
            type="button"
            onClick={() => onSort(sortable.key)}
            className={`inline-flex min-h-8 items-center gap-1 text-left uppercase hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${active ? "text-forest" : ""}`}
          >
            {label}
            <Icon size={12} className={`shrink-0 ${active ? "" : "opacity-40"}`} aria-hidden />
          </button>
        ) : (
          label
        )}
      </th>
    );
  }

  return (
    // relative: keeps sr-only text inside the scroll box.
    <div className="relative mt-6 overflow-x-auto rounded-sm border border-border xl:overflow-visible">
      <table className="w-full min-w-[54rem] border-collapse text-sm xl:min-w-0">
        <caption className="sr-only">{t("table.caption")}</caption>
        <thead>
          <tr className="border-b border-border-strong">
            {Header({ column: "name", label: t("table.university"), className: `${stickyName} z-20 min-w-44` })}
            {Header({ column: "state", label: t("table.state") })}
            {Header({ column: "type", label: t("table.type") })}
            {Header({ column: "tuition", label: t("table.tuition") })}
            {Header({ column: "contribution", label: t("table.contribution"), align: "right" })}
            {Header({ column: "programmes", label: t("table.programmes"), align: "right" })}
            {Header({ column: "english", label: t("table.english"), align: "right" })}
            {Header({ column: "route", label: t("table.route") })}
            <th scope="col" className={th}>
              <span className="sr-only">{t("table.actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((u) => (
            <Row key={u.slug} uni={u} onShowOnMap={onShowOnMap} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ uni, onShowOnMap }: { uni: DirectoryItem; onShowOnMap: (slug: string) => void }) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const figures = useDirectoryFacts(uni);
  const fee = uni.facts?.nonEuTuition.status ?? "unknown";
  const missing = (
    <>
      <span aria-hidden>—</span>
      <span className="sr-only">{t("common.notVerified")}</span>
    </>
  );
  const cell = "px-2 py-2.5 align-middle";
  return (
    <tr className="group bg-surface transition-colors hover:bg-background-secondary">
      <th scope="row" className={`${cell} ${stickyName} z-10 min-w-44 bg-surface text-left font-normal group-hover:bg-background-secondary`}>
        <Link href={`/universities/${uni.slug}`} className="font-medium text-foreground hover:text-forest">
          {uni.name}
        </Link>
        <span className="block text-xs text-foreground-muted">{uni.cityLabel}</span>
      </th>
      <td className={`${cell} text-foreground-secondary`}>{uni.state ? STATE_BY_CODE[uni.state].name[locale === "tr" ? "tr" : "en"] : missing}</td>
      <td className={`${cell} text-foreground-secondary`}>{t(`table.types.${uni.type}`)}</td>
      <td className={cell}>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-foreground">
          <span className={`h-2 w-2 shrink-0 rounded-full ${FEE_DOT[fee]}`} aria-hidden />
          {t(`table.fee.${fee}`)}
        </span>
      </td>
      <td className={`${cell} whitespace-nowrap text-right tabular-nums text-foreground`}>{figures.contribution ?? missing}</td>
      <td className={`${cell} text-right tabular-nums text-foreground`}>{figures.programmes ?? missing}</td>
      <td className={`${cell} whitespace-nowrap text-right tabular-nums text-foreground`}>{figures.english ?? missing}</td>
      <td className={`${cell} whitespace-nowrap text-foreground-secondary`}>{figures.route ?? missing}</td>
      <td className={cell}>
        <div className="flex justify-end gap-1">
          <CompareButton slug={uni.slug} name={uni.name} touch />
          <FavoriteButton slug={uni.slug} name={uni.name} touch />
          <button
            type="button"
            onClick={() => onShowOnMap(uni.slug)}
            aria-label={t("card.showOnMapFor", { name: uni.name })}
            title={t("card.showOnMap")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border-strong bg-surface text-foreground-secondary hover:border-forest hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 lg:h-9 lg:w-9"
          >
            <MapPin size={16} aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  );
}
