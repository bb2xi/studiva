"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { STATE_BY_CODE } from "@/data/states";
import { lockPageScroll } from "@/lib/scrollLock";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { DirectoryItem, TuitionStatus } from "@/lib/discovery/types";
import { FeeBadge } from "./FeeBadge";
import { FeePin, type MapItem } from "./mapPins";
import { CompareButton, FavoriteButton } from "./ToggleButtons";
import { useDirectoryFacts } from "./UniversityCard";

// Leaflet, its CSS and the tiles load only once the map view is open.
const GermanyMap = dynamic(() => import("@/components/GermanyMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-background-secondary" />,
});

const FEE_ORDER: TuitionStatus[] = ["none", "charged", "varies", "unknown"];

const feeOf = (u: DirectoryItem): TuitionStatus => u.facts?.nonEuTuition.status ?? "unknown";

/** An element's height, kept current with a ResizeObserver (0 while it isn't rendered). */
function useHeight<T extends HTMLElement>() {
  const [el, setEl] = useState<T | null>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);
  return [setEl, el ? height : 0] as const;
}

type Props = {
  /** "dialog": the full-screen phone map; "inline": split list + map from 1280 px, a 70vh map below that. */
  layout: "inline" | "dialog";
  items: DirectoryItem[];
  /** The whole directory, so the legend doesn't change with the filters. */
  allItems: DirectoryItem[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  countText: string;
  filterCount: number;
  onOpenFilters: () => void;
  onBack: () => void;
};

export default function DirectoryMap({ layout, items, allItems, selected, onSelect, countText, filterCount, onOpenFilters, onBack }: Props) {
  const t = useTranslations("discovery");
  const wide = useMediaQuery("(min-width: 1280px)");
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [cardRef, cardHeight] = useHeight<HTMLElement>();
  const [topRef, topHeight] = useHeight<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedItem = useMemo(() => items.find((u) => u.slug === selected) ?? null, [items, selected]);
  const mapItems = useMemo<MapItem[]>(() => items.map((u) => ({ slug: u.slug, name: u.name, city: u.cityLabel, lat: u.lat, lng: u.lng, fee: feeOf(u) })), [items]);
  const statuses = useMemo(() => FEE_ORDER.filter((s) => allItems.some((u) => feeOf(u) === s)), [allItems]);
  const split = layout === "inline" && wide;

  // A marker picked on the map scrolls the list box to its row — never the page.
  useEffect(() => {
    const list = listRef.current;
    const row = selected ? list?.querySelector<HTMLElement>(`[data-slug="${CSS.escape(selected)}"]`) : null;
    if (!list || !row) return;
    if (row.offsetTop >= list.scrollTop && row.offsetTop + row.offsetHeight <= list.scrollTop + list.clientHeight) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ top: row.offsetTop - (list.clientHeight - row.offsetHeight) / 2, behavior: reduced ? "auto" : "smooth" });
  }, [selected, split]);

  // Closing the card returns focus to the map if it was inside the card.
  const deselect = () => {
    const frame = frameRef.current;
    const focusWasInCard = frame?.querySelector("[data-map-card]")?.contains(document.activeElement);
    onSelect(null);
    if (focusWasInCard) frame?.querySelector<HTMLElement>(".leaflet-container")?.focus();
  };

  const card = selectedItem && (
    <MapSelectedCard
      ref={cardRef}
      uni={selectedItem}
      onClose={deselect}
      className="absolute inset-x-3 bottom-[calc(var(--map-attribution-h,1.25rem)+0.75rem)] z-10 sm:right-auto sm:w-[22rem]"
    />
  );
  // Esc closes the selected card first; without one it falls through (in the phone dialog: back to the list).
  const closeOnEscape = (e: React.KeyboardEvent) => {
    if (e.key !== "Escape" || !selectedItem) return;
    e.preventDefault();
    deselect();
  };
  const mapProps = {
    items: mapItems,
    selected,
    highlighted,
    onSelect,
    insetBottom: cardHeight ? cardHeight + 24 : 0,
  };

  if (layout === "dialog") {
    return (
      <MapDialog label={t("map.title")} onEscape={() => (selectedItem ? deselect() : onBack())} onDismiss={onBack}>
        <div ref={frameRef} onKeyDown={closeOnEscape} className="h-full">
          <GermanyMap {...mapProps} touchDrag insetTop={topHeight} className="h-full">
            <div ref={topRef} className="absolute inset-x-0 top-0 z-10 border-b border-border bg-background/95 px-3 pb-2 pt-3 backdrop-blur">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm border border-border-strong bg-surface px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  <ArrowLeft size={16} aria-hidden />
                  {t("map.backToList")}
                </button>
                <p aria-live="polite" className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-foreground">
                  {countText}
                </p>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={onOpenFilters}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-border-strong bg-surface px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  <SlidersHorizontal size={16} aria-hidden />
                  {t("directory.filters")}
                  {filterCount > 0 && <span className="rounded-full bg-brand px-1.5 text-xs text-white">{filterCount}</span>}
                </button>
              </div>
              <MapLegend statuses={statuses} className="mt-2 justify-center" />
            </div>
            {card}
          </GermanyMap>
        </div>
      </MapDialog>
    );
  }

  const map = (
    <div ref={frameRef} className="min-h-0 flex-1">
      <GermanyMap {...mapProps} className="h-full overflow-hidden rounded-sm border border-border">
        {card}
      </GermanyMap>
    </div>
  );

  if (split) {
    return (
      <div onKeyDown={closeOnEscape} className="mt-4 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4" style={{ height: "max(30rem, calc(100dvh - var(--directory-toolbar-bottom, 8rem) - 2rem))" }}>
        <ul ref={listRef} aria-label={t("map.listLabel")} className="relative min-h-0 divide-y divide-border overflow-y-auto rounded-sm border border-border bg-surface">
          {items.map((u) => (
            <MapListRow key={u.slug} uni={u} selected={u.slug === selected} onSelect={onSelect} onHighlight={setHighlighted} />
          ))}
        </ul>
        <div className="flex min-h-0 flex-col gap-2">
          <MapLegend statuses={statuses} />
          {map}
        </div>
      </div>
    );
  }

  return (
    <div onKeyDown={closeOnEscape} className="mt-4 flex h-[70vh] min-h-[26rem] flex-col gap-2">
      <MapLegend statuses={statuses} />
      {map}
    </div>
  );
}

/**
 * The phone map: a native modal <dialog> over the page, which stays put
 * underneath (so "back to list" returns to the same spot) and can't scroll,
 * so one-finger panning traps nothing.
 */
function MapDialog({ label, onEscape, onDismiss, children }: { label: string; onEscape: () => void; onDismiss: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  useLayoutEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    const release = lockPageScroll();
    return () => {
      closing.current = true;
      release();
      if (dialog.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onEscape();
      }}
      // Closed by the browser itself (e.g. Android's back gesture): follow it back to the list.
      onClose={() => {
        if (!closing.current) onDismiss();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-background p-0 text-foreground md:hidden"
    >
      {children}
    </dialog>
  );
}

function MapLegend({ statuses, className = "" }: { statuses: TuitionStatus[]; className?: string }) {
  const t = useTranslations("discovery");
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-secondary ${className}`}>
      <span className="font-semibold text-foreground">{t("map.legendTitle")}</span>
      {statuses.map((s) => (
        <span key={s} className="inline-flex items-center gap-1">
          <FeePin status={s} className="h-[18px] w-[14px]" />
          {t(`table.fee.${s}`)}
        </span>
      ))}
    </div>
  );
}

function MapListRow({
  uni,
  selected,
  onSelect,
  onHighlight,
}: {
  uni: DirectoryItem;
  selected: boolean;
  onSelect: (slug: string | null) => void;
  onHighlight: (slug: string | null) => void;
}) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const fee = feeOf(uni);
  const state = uni.state ? STATE_BY_CODE[uni.state].name[locale === "tr" ? "tr" : "en"] : null;
  const programmes = uni.facts?.hsk?.programmes;
  return (
    <li data-slug={uni.slug}>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(selected ? null : uni.slug)}
        onMouseEnter={() => onHighlight(uni.slug)}
        onMouseLeave={() => onHighlight(null)}
        onFocus={() => onHighlight(uni.slug)}
        onBlur={() => onHighlight(null)}
        className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/50 ${
          selected ? "bg-forest-light" : "hover:bg-background-secondary"
        }`}
      >
        <FeePin status={fee} className="mt-0.5 h-[22px] w-[17px] shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-snug text-foreground">{uni.name}</span>
          <span className="block truncate text-xs text-foreground-muted">
            {uni.cityLabel}
            {state && !uni.cityLabel.includes(state) ? ` · ${state}` : ""}
          </span>
          <span className="mt-0.5 block text-xs text-foreground-secondary">
            {[t("map.rowFee", { fee: t(`table.fee.${fee}`) }), programmes != null ? t("map.rowProgrammes", { count: programmes }) : null].filter(Boolean).join(" · ")}
          </span>
        </span>
      </button>
    </li>
  );
}

function MapSelectedCard({ uni, onClose, className, ref }: { uni: DirectoryItem; onClose: () => void; className: string; ref: (el: HTMLElement | null) => void }) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const headingId = useId();
  const figures = useDirectoryFacts(uni);
  const state = uni.state ? STATE_BY_CODE[uni.state].name[locale === "tr" ? "tr" : "en"] : null;
  const rows = [
    [t("card.contribution"), figures.contribution],
    [t("card.programmes"), figures.programmes],
    [t("card.english"), figures.english],
  ] as const;
  return (
    <section ref={ref} data-map-card aria-labelledby={headingId} className={`rounded-sm border border-border bg-surface p-4 shadow-lg ${className}`}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="font-display text-base font-medium leading-snug text-foreground">
            {uni.name}
          </h3>
          <p className="mt-0.5 text-xs text-foreground-muted">
            {uni.cityLabel}
            {state && !uni.cityLabel.includes(state) ? ` · ${state}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("map.close")}
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-foreground-secondary hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <FeeBadge facts={uni.facts} />
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
        {rows.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[11px] leading-tight text-foreground-muted">{label}</dt>
            <dd className={`mt-0.5 text-sm tabular-nums ${value ? "font-semibold text-foreground" : "text-foreground-muted"}`}>{value ?? t("common.notVerified")}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          href={`/universities/${uni.slug}`}
          aria-label={t("map.detailsFor", { name: uni.name })}
          className="inline-flex min-h-11 items-center rounded-sm bg-forest px-4 text-xs font-semibold text-white hover:bg-forest-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 lg:min-h-9"
        >
          {t("map.details")}
        </Link>
        <CompareButton slug={uni.slug} name={uni.name} withLabel="short" className="min-h-11 lg:min-h-9" />
        <FavoriteButton slug={uni.slug} name={uni.name} withLabel="short" className="min-h-11 lg:min-h-9" />
      </div>
    </section>
  );
}
