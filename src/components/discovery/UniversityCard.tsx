"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, MapPin, Compass, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { universityMedia, universityLogos, wikimediaThumb } from "@/lib/universityMedia";
import { STATE_BY_CODE } from "@/data/states";
import type { DirectoryItem } from "@/lib/discovery/types";
import { Tag } from "@/components/Tag";
import { Heading } from "@/components/Typography";
import { FeeBadge } from "./FeeBadge";
import { CompareButton, FavoriteButton } from "./ToggleButtons";

export default function UniversityCard({ uni, onFocusMap }: { uni: DirectoryItem & { description?: string }; onFocusMap?: (slug: string) => void }) {
  const locale = useLocale();
  const t = useTranslations("discovery");
  const logo = universityLogos[uni.slug];
  const cover = universityMedia[uni.slug]?.[0];
  // External (Wikimedia) images can fail to load; show a neutral mark instead of a broken-image icon.
  const [imageFailed, setImageFailed] = useState(false);
  // onError can fire before hydration attaches the handler — catch images that already failed.
  const checkLoaded = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) setImageFailed(true);
  };
  const state = uni.state ? STATE_BY_CODE[uni.state].name[locale === "tr" ? "tr" : "en"] : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-surface">
      <Link
        href={`/universities/${uni.slug}`}
        aria-label={uni.name}
        className="absolute inset-0 z-10 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      />
      <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b border-border bg-background-secondary">
        {imageFailed || (!logo && !cover) ? (
          <GraduationCap size={40} className="text-border-strong" aria-hidden />
        ) : logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={checkLoaded} src={wikimediaThumb(logo.url, 250)} alt="" loading="lazy" onError={() => setImageFailed(true)} className="max-h-[70%] max-w-[70%] object-contain" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={checkLoaded} src={wikimediaThumb(cover!.url, 500)} alt="" loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
        )}
        <div className="absolute right-3 top-3 z-20 flex gap-1.5">
          {onFocusMap && (
            <button
              type="button"
              onClick={() => onFocusMap(uni.slug)}
              aria-label={locale === "tr" ? `${uni.name} konumunu haritada göster` : `Show ${uni.name} on the map`}
              title={locale === "tr" ? "Haritada göster" : "Show on map"}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-border-strong bg-surface text-foreground-secondary transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <Compass size={16} />
            </button>
          )}
          <CompareButton slug={uni.slug} name={uni.name} />
          <FavoriteButton slug={uni.slug} name={uni.name} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag variant="neutral">{t(`types.${uni.type}`)}</Tag>
          {uni.badges.includes("excellence") && <Tag variant="brass">{locale === "tr" ? "Exzellenz" : "Excellence"}</Tag>}
          {uni.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
          <FeeBadge facts={uni.facts} />
        </div>
        <Heading as="h3" size="sm" className="mt-3 transition-colors group-hover:text-forest">
          {uni.name}
        </Heading>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
          <MapPin size={13} className="shrink-0" />
          <span>
            {uni.cityLabel}
            {state && !uni.cityLabel.includes(state) ? ` · ${state}` : ""}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 flex-1 font-sans text-sm leading-relaxed text-foreground-secondary">{uni.description ?? ""}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[11px] text-foreground-muted">
            {t("card.verifiedFields", { filled: uni.completeness.filled, total: uni.completeness.total })}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest">
            {t("common.viewDetails")}
            <ArrowUpRight size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
