"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, LayoutGrid, List, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import Container from "@/components/Container";
import {
  PAGE_SIZE,
  SORT_KEYS,
  activeFilterCount,
  buildUniversityIndex,
  clearedState,
  effectiveSort,
  parseDirectoryState,
  runDirectoryQuery,
  serializeDirectoryState,
  type DirectoryState,
  type SortKey,
  type ViewKey,
} from "@/lib/discovery/directory";
import { closestCandidate } from "@/lib/discovery/search";
import { formatDate } from "@/lib/discovery/facts";
import { STATE_BY_CODE, cityName } from "@/data/states";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { DirectoryItem, StateCode } from "@/lib/discovery/types";
import { SUBJECT_AREAS } from "@/lib/discovery/types";
import DiscoveryHeader from "./DiscoveryHeader";
import DirectoryFilters from "./DirectoryFilters";
import DirectoryFilterSheet from "./DirectoryFilterSheet";
import DirectoryMap from "./DirectoryMap";
import DirectoryTable from "./DirectoryTable";
import SearchCombobox from "./SearchCombobox";
import UniversityCard from "./UniversityCard";

type Props = {
  items: DirectoryItem[];
  dataCheckedAt: string | null;
};

type Navigate = (next: DirectoryState, mode?: "push" | "replace") => void;

/**
 * Reads the directory state from the URL and writes every change back to it.
 * The native History API keeps useSearchParams in sync without a server round
 * trip, so filters apply instantly; view switches push an entry for "back".
 */
export default function DirectoryExplorer(props: Props) {
  const pathname = usePathname();
  const params = useSearchParams();
  const state = useMemo(() => parseDirectoryState(params), [params]);
  const navigate = useCallback<Navigate>(
    (next, mode = "replace") => {
      const qs = serializeDirectoryState(next);
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (mode === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [pathname]
  );
  return <DirectoryView {...props} state={state} onNavigate={navigate} />;
}

const chipBase =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

/**
 * The directory for a given state. The page also renders it with the default
 * state as the prerendered fallback, so the first results are in the HTML.
 */
export function DirectoryView({ items, dataCheckedAt, state, onNavigate }: Props & { state: DirectoryState; onNavigate?: Navigate }) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const sidebarTitleId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const focusFromRef = useRef<number | null>(null);
  const [sheet, setSheet] = useState<{ open: boolean; section: string | null }>({ open: false, section: null });

  const subjectLabels = useMemo(() => Object.fromEntries(SUBJECT_AREAS.map((s) => [s, t(`subjects.${s}`)])), [t]);
  const index = useMemo(() => buildUniversityIndex(items, subjectLabels), [items, subjectLabels]);
  const result = useMemo(() => runDirectoryQuery(items, index, state, locale), [items, index, state, locale]);
  const filterCount = activeFilterCount(state);
  // On phones the map opens as a full-screen dialog over the card list, which stays where it was.
  const phone = useMediaQuery("(max-width: 767.98px)");
  const mapDialog = state.view === "map" && phone;
  const flowView = mapDialog ? "cards" : state.view;
  const cards = flowView === "cards" ? result.all.slice(0, result.page * PAGE_SIZE) : [];
  const remaining = result.total - cards.length;

  const update = useCallback(
    (patch: Partial<DirectoryState>, opts: { keepPage?: boolean; push?: boolean } = {}) =>
      onNavigate?.({ ...state, ...patch, page: opts.keepPage ? (patch.page ?? state.page) : 1 }, opts.push ? "push" : "replace"),
    [onNavigate, state]
  );
  const clearAll = () => onNavigate?.(clearedState(state));

  // The table header sticks right under the toolbar, whose height changes with the active filter chips.
  useEffect(() => {
    const toolbar = toolbarRef.current;
    const column = columnRef.current;
    if (!toolbar || !column) return;
    const observer = new ResizeObserver(() => {
      const top = parseFloat(getComputedStyle(toolbar).top) || 0;
      column.style.setProperty("--directory-toolbar-bottom", `${top + toolbar.offsetHeight}px`);
    });
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, []);

  // After "show more", move focus to the first newly shown card.
  useEffect(() => {
    const from = focusFromRef.current;
    if (from === null) return;
    focusFromRef.current = null;
    listRef.current?.children[from]?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [cards.length]);

  const stateName = (code: StateCode) => STATE_BY_CODE[code].name[locale === "tr" ? "tr" : "en"];
  const countText = t("directory.resultCount", { count: result.total });

  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...(state.q ? [{ key: "q", label: t("directory.searchChip", { q: state.q }), remove: () => update({ q: "" }) }] : []),
    ...(state.level !== "all" ? [{ key: "level", label: t(`levels.${state.level}`), remove: () => update({ level: "all" }) }] : []),
    ...(state.fee !== "any"
      ? [{ key: "fee", label: state.fee === "none" ? t("directory.feeNone") : t("directory.feeCharged"), remove: () => update({ fee: "any" }) }]
      : []),
    ...(state.english ? [{ key: "en", label: t("directory.english"), remove: () => update({ english: false }) }] : []),
    ...state.subjects.map((s) => ({ key: `subject-${s}`, label: t(`subjects.${s}`), remove: () => update({ subjects: state.subjects.filter((x) => x !== s) }) })),
    ...state.states.map((s) => ({ key: `state-${s}`, label: stateName(s), remove: () => update({ states: state.states.filter((x) => x !== s) }) })),
    ...(state.city ? [{ key: "city", label: t("directory.cityChip", { city: cityName(state.city, locale) }), remove: () => update({ city: "" }) }] : []),
    ...state.types.map((ty) => ({ key: `type-${ty}`, label: t(`types.${ty}`), remove: () => update({ types: state.types.filter((x) => x !== ty) }) })),
    ...(state.route !== "any"
      ? [{ key: "route", label: state.route === "uniassist" ? t("directory.routeUniAssist") : t("directory.routeDirect"), remove: () => update({ route: "any" }) }]
      : []),
    ...(state.contributionMax !== null
      ? [{ key: "cmax", label: t("directory.contributionChip", { amount: state.contributionMax }), remove: () => update({ contributionMax: null }) }]
      : []),
    ...(state.ownership !== "any" ? [{ key: "own", label: t(`ownership.${state.ownership}`), remove: () => update({ ownership: "any" }) }] : []),
    ...state.badges.map((b) => ({ key: `badge-${b}`, label: t(`directory.${b}`), remove: () => update({ badges: state.badges.filter((x) => x !== b) }) })),
  ];

  const didYouMean = result.total === 0 && state.q ? closestCandidate(state.q, items.flatMap((u) => [u.name, ...u.cities])) : null;

  // Opening the map brings the top of the results right under whichever bar is sticky, so the
  // map fits the screen. It runs once the map layout is in the DOM, before it paints.
  const alignAfterRender = useRef(false);
  useLayoutEffect(() => {
    const results = resultsRef.current;
    if (!alignAfterRender.current || !results || state.view !== "map") return;
    alignAfterRender.current = false;
    if (phone) return;
    let stickyBottom = 0;
    for (const bar of [mobileBarRef.current, toolbarRef.current]) {
      if (!bar?.offsetParent) continue;
      const style = getComputedStyle(bar);
      if (style.position === "sticky") stickyBottom = Math.max(stickyBottom, parseFloat(style.top) + bar.offsetHeight);
    }
    window.scrollTo({ top: results.getBoundingClientRect().top + window.scrollY - stickyBottom });
  }, [state.view, phone]);

  function showOnMap(slug: string) {
    alignAfterRender.current = true;
    update({ view: "map", focus: slug }, { push: true, keepPage: true });
  }

  function setView(view: ViewKey) {
    alignAfterRender.current = view === "map";
    update({ view, focus: view === "map" ? state.focus : "" }, { push: true, keepPage: true });
  }

  const mapProps = {
    items: result.all,
    allItems: items,
    selected: state.focus || null,
    onSelect: (slug: string | null) => update({ focus: slug ?? "" }, { keepPage: true }),
    countText,
    filterCount,
    onOpenFilters: () => setSheet({ open: true, section: null }),
    // Replace rather than push: the map's own entry gives way to the list with the filters chosen on the map.
    onBack: () => update({ view: "cards", focus: "" }, { keepPage: true }),
  };

  const search = (
    <SearchCombobox
      items={items}
      index={index}
      value={state.q}
      onChange={(q) => update({ q })}
      onPickCity={(city) => update({ city })}
      onPickState={(code) => update({ states: state.states.includes(code) ? state.states : [...state.states, code] })}
    />
  );

  return (
    <>
      <DiscoveryHeader
        compact
        title={t("directory.title")}
        subtitle={t("directory.subtitle", { count: items.length, date: dataCheckedAt ? formatDate(dataCheckedAt, locale) : "—" })}
      >
        <div className="mt-5 hidden max-w-2xl lg:block">{search}</div>
      </DiscoveryHeader>

      <Container bleed className="pb-16">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8 lg:pt-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <aside aria-labelledby={sidebarTitleId} className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain pb-6 pr-3">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                <h2 id={sidebarTitleId} className="font-display text-lg font-medium text-foreground">
                  {t("directory.filters")}
                </h2>
                {filterCount > 0 && (
                  <button type="button" onClick={clearAll} className="min-h-9 text-xs font-semibold text-clay-dark underline underline-offset-2 hover:text-clay">
                    {t("directory.clearAll")}
                  </button>
                )}
              </div>
              <DirectoryFilters state={state} facets={result.facets} onChange={update} idPrefix="side" />
            </div>
          </aside>

          <div ref={columnRef} className="min-w-0">
            {/* Small screens: search, filter button and quick filters stay at hand while scrolling. */}
            <div ref={mobileBarRef} className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">{search}</div>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSheet({ open: true, section: null })}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-border-strong bg-surface px-3 text-sm font-semibold text-foreground hover:border-forest"
                >
                  <SlidersHorizontal size={16} aria-hidden />
                  {t("directory.filters")}
                  {filterCount > 0 && <span className="rounded-full bg-brand px-1.5 text-xs text-white">{filterCount}</span>}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                <span className="shrink-0 pr-1 text-xs font-semibold text-foreground-secondary">{countText}</span>
                <button
                  type="button"
                  aria-pressed={state.fee === "none"}
                  onClick={() => update({ fee: state.fee === "none" ? "any" : "none" })}
                  className={`${chipBase} min-h-11 ${state.fee === "none" ? "border-forest bg-forest text-white" : "border-border-strong bg-surface text-foreground-secondary"}`}
                >
                  {t("directory.quickFree")}
                </button>
                <button
                  type="button"
                  aria-pressed={state.english}
                  onClick={() => update({ english: !state.english })}
                  className={`${chipBase} min-h-11 ${state.english ? "border-forest bg-forest text-white" : "border-border-strong bg-surface text-foreground-secondary"}`}
                >
                  {t("directory.quickEnglish")}
                </button>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSheet({ open: true, section: "sheet-subject" })}
                  className={`${chipBase} min-h-11 ${state.subjects.length ? "border-forest bg-forest-light text-forest" : "border-border-strong bg-surface text-foreground-secondary"}`}
                >
                  {t("subjects.label")}
                  {state.subjects.length > 0 && ` (${state.subjects.length})`}
                  <ChevronDown size={14} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSheet({ open: true, section: "sheet-state" })}
                  className={`${chipBase} min-h-11 ${state.states.length ? "border-forest bg-forest-light text-forest" : "border-border-strong bg-surface text-foreground-secondary"}`}
                >
                  {t("directory.state")}
                  {state.states.length > 0 && ` (${state.states.length})`}
                  <ChevronDown size={14} aria-hidden />
                </button>
              </div>
            </div>

            <div ref={toolbarRef} className="border-b border-border py-3 lg:sticky lg:top-16 lg:z-30 lg:bg-background/95 lg:backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="hidden text-sm font-semibold text-foreground lg:block">
                  {countText}
                  {flowView === "cards" && remaining > 0 && (
                    <span className="ml-2 font-normal text-foreground-muted">{t("directory.showingOf", { shown: cards.length, total: result.total })}</span>
                  )}
                </p>
                <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:justify-end">
                  <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-foreground-secondary sm:flex-none">
                    <span className="hidden shrink-0 sm:inline">{t("directory.sort")}</span>
                    <select
                      aria-label={t("directory.sort")}
                      value={effectiveSort(state)}
                      onChange={(e) => update({ sort: e.target.value as SortKey })}
                      className="min-h-11 w-full min-w-0 rounded-sm border border-border-strong bg-surface px-3 text-sm text-foreground sm:w-auto lg:min-h-9"
                    >
                      {SORT_KEYS.filter((key) => key !== "relevance" || state.q).map((key) => (
                        <option key={key} value={key}>
                          {t(`directory.sortOptions.${key}`)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div role="group" aria-label={t("directory.viewLabel")} className="inline-flex shrink-0 rounded-sm border border-border-strong bg-surface p-0.5">
                    {(
                      [
                        ["cards", LayoutGrid, t("directory.viewCards")],
                        ["table", List, t("directory.viewTable")],
                        ["map", MapIcon, t("directory.viewMap")],
                      ] as const
                    ).map(([view, Icon, label]) => (
                      <button
                        key={view}
                        type="button"
                        aria-pressed={state.view === view}
                        onClick={() => setView(view)}
                        className={`inline-flex min-h-10 items-center gap-1.5 rounded-[3px] px-3 text-sm font-semibold transition-colors lg:min-h-8 ${
                          state.view === view ? "bg-forest text-white" : "text-foreground-secondary hover:text-forest"
                        }`}
                      >
                        <Icon size={15} aria-hidden />
                        <span className="sr-only sm:not-sr-only">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeChips.length > 0 && (
                <div role="group" aria-label={t("directory.activeFilters")} className="mt-2.5 flex flex-wrap items-center gap-2">
                  {activeChips.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={c.remove}
                      aria-label={t("directory.removeFilter", { label: c.label })}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border-strong bg-background-secondary px-3 text-xs font-medium text-foreground-secondary hover:border-clay hover:text-clay-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                    >
                      {c.label}
                      <X size={12} aria-hidden />
                    </button>
                  ))}
                  {filterCount > 1 && (
                    <button type="button" onClick={clearAll} className="min-h-9 text-xs font-semibold text-clay-dark underline underline-offset-2 hover:text-clay">
                      {t("directory.clearAll")}
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="sr-only" aria-live="polite">
              {countText}
            </p>

            <div id="results" ref={resultsRef} tabIndex={-1} className="scroll-mt-44 focus:outline-none lg:scroll-mt-32">
              <h2 className="sr-only">{t("directory.resultsHeading")}</h2>
              {result.total === 0 ? (
                <div className="mx-auto mt-10 max-w-xl rounded-sm border border-border bg-surface p-8 text-center">
                  <p className="font-display text-xl text-foreground">{t("directory.noResultsTitle")}</p>
                  <p className="mt-2 text-sm text-foreground-secondary">{t("directory.noResultsBody")}</p>
                  {didYouMean && (
                    <button type="button" onClick={() => update({ q: didYouMean })} className="mt-4 text-sm font-semibold text-forest underline underline-offset-2 hover:text-brand">
                      {t("directory.didYouMean", { suggestion: didYouMean })}
                    </button>
                  )}
                  {activeChips.length > 0 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {activeChips.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={c.remove}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border-strong px-3 text-xs text-foreground-secondary hover:border-clay hover:text-clay-dark"
                        >
                          {c.label} <X size={12} aria-hidden />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : flowView === "table" ? (
                <DirectoryTable items={result.all} sort={effectiveSort(state)} onSort={(key) => update({ sort: key }, { keepPage: true })} onShowOnMap={showOnMap} />
              ) : flowView === "map" ? (
                <DirectoryMap layout="inline" {...mapProps} />
              ) : (
                <>
                  <ul ref={listRef} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map((uni) => (
                      <li key={uni.slug}>
                        <UniversityCard uni={uni} onShowOnMap={showOnMap} />
                      </li>
                    ))}
                  </ul>
                  {remaining > 0 && (
                    <div className="mt-8 flex flex-col items-center gap-2">
                      <p className="text-xs text-foreground-muted">{t("directory.showingOf", { shown: cards.length, total: result.total })}</p>
                      <button
                        type="button"
                        onClick={() => {
                          focusFromRef.current = cards.length;
                          update({ page: result.page + 1 }, { keepPage: true });
                        }}
                        className="min-h-11 rounded-sm border border-forest px-6 text-sm font-semibold text-forest hover:bg-forest hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                      >
                        {t("directory.showMore", { count: Math.min(PAGE_SIZE, remaining) })}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            {mapDialog && <DirectoryMap layout="dialog" {...mapProps} />}

            <div className="mt-10 space-y-1 text-xs text-foreground-muted">
              {dataCheckedAt && <p>{t("directory.dataNote", { date: formatDate(dataCheckedAt, locale) })}</p>}
              <p>{t("common.verifyNotice")}</p>
            </div>
          </div>
        </div>
      </Container>

      <DirectoryFilterSheet
        open={sheet.open}
        scrollToId={sheet.section}
        onClose={() => setSheet({ open: false, section: null })}
        onClear={clearAll}
        resultCount={result.total}
      >
        <DirectoryFilters state={state} facets={result.facets} onChange={update} idPrefix="sheet" touch />
      </DirectoryFilterSheet>
    </>
  );
}
