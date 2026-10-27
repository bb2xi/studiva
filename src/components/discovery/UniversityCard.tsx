"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { universityLogos, wikimediaThumb } from "@/lib/universityMedia";
import { STATE_BY_CODE } from "@/data/states";
import { formatEurExact } from "@/lib/discovery/facts";
import type { DirectoryItem } from "@/lib/discovery/types";
import { Tag } from "@/components/Tag";
import { FeeBadge } from "./FeeBadge";
import { CompareButton, FavoriteButton } from "./ToggleButtons";

const STOP_WORDS = new Set(["der", "die", "das", "des", "für", "und", "zu", "in", "im", "am", "an", "von", "of", "the", "and", "at", "de"]);

/** Letters for universities without a logo: the short name in brackets ("TUM") or the initials. */
export function monogram(name: string) {
  const short = name.match(/\(([^)\s]+)/)?.[1];
  if (short && short.length <= 5) return short.toUpperCase();
  const words = name
    .replace(/\(.*?\)/g, "")
    .split(/[\s\-–]+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()));
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Verified figures shown on cards and in the table; null where nothing is verified. */
export function useDirectoryFacts(uni: DirectoryItem) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const f = uni.facts;
  const english =
    f?.daad && f.daad.englishProgrammes > 0 ? `${f.daad.englishProgrammes} (DAAD)` : f?.hsk && f.hsk.english > 0 ? `${f.hsk.english} (HRK)` : null;
  return {
    contribution: f?.semesterContribution.amountEur != null ? formatEurExact(f.semesterContribution.amountEur, locale) : null,
    programmes: f?.hsk ? String(f.hsk.programmes) : null,
    english,
    route: f?.uniAssistMember == null ? null : f.uniAssistMember ? t("card.routeUniAssist") : t("card.routeDirect"),
  };
}

export default function UniversityCard({ uni, onShowOnMap }: { uni: DirectoryItem; onShowOnMap?: (slug: string) => void }) {
  const locale = useLocale();
  const t = useTranslations("discovery");
  const logo = universityLogos[uni.slug];
  // External (Wikimedia) logos can fail to load; fall back to the monogram instead of a broken image.
  const [logoFailed, setLogoFailed] = useState(false);
  // onError can fire before hydration attaches the handler — catch images that already failed.
  const checkLoaded = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) setLogoFailed(true);
  };
  const state = uni.state ? STATE_BY_CODE[uni.state].name[locale === "tr" ? "tr" : "en"] : null;
  const figures = useDirectoryFacts(uni);
  const notVerified = t("common.notVerified");
  const rows = [
    [t("card.contribution"), figures.contribution],
    [t("card.programmes"), figures.programmes],
    [t("card.english"), figures.english],
    [t("card.route"), figures.route],
  ] as const;

  return (
    <article className="group relative flex h-full flex-col rounded-sm border border-border bg-surface p-4 transition-colors hover:border-forest/60">
      <Link
        href={`/universities/${uni.slug}`}
        aria-label={uni.name}
        className="absolute inset-0 z-10 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      />
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-white" aria-hidden>
          {logo && !logoFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={checkLoaded}
              src={wikimediaThumb(logo.url, 120)}
              alt=""
              loading="lazy"
              onError={() => setLogoFailed(true)}
              className="max-h-10 max-w-10 object-contain"
            />
          ) : (
            <span className="font-display text-sm font-semibold tracking-tight text-forest">{monogram(uni.name)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-base font-medium leading-snug text-foreground transition-colors group-hover:text-forest">{uni.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground-muted">
            <MapPin size={12} className="shrink-0" aria-hidden />
            <span className="truncate">
              {uni.cityLabel}
              {state && !uni.cityLabel.includes(state) ? ` · ${state}` : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Tag variant="neutral">{t(`types.${uni.type}`)}</Tag>
        <FeeBadge facts={uni.facts} />
        {uni.badges.includes("excellence") && <Tag variant="brass">{t("directory.excellence")}</Tag>}
        {uni.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3">
        {rows.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="truncate text-[11px] text-foreground-muted">{label}</dt>
            <dd className={`text-sm tabular-nums ${value ? "font-semibold text-foreground" : "text-foreground-muted"}`}>{value ?? notVerified}</dd>
          </div>
        ))}
      </dl>

      {/* Above the card-wide link so the actions stay clickable. */}
      <div className="relative z-20 mt-auto flex flex-wrap gap-2 pt-4">
        <CompareButton slug={uni.slug} name={uni.name} withLabel="short" className="min-h-11 lg:min-h-9" />
        <FavoriteButton slug={uni.slug} name={uni.name} withLabel="short" className="min-h-11 lg:min-h-9" />
        {onShowOnMap && (
          <button
            type="button"
            onClick={() => onShowOnMap(uni.slug)}
            aria-label={t("card.showOnMapFor", { name: uni.name })}
            title={t("card.showOnMap")}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border-strong bg-surface text-foreground-secondary transition-colors hover:border-forest hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 lg:h-9 lg:w-9"
          >
            <MapPin size={16} aria-hidden />
          </button>
        )}
      </div>
    </article>
  );
}
