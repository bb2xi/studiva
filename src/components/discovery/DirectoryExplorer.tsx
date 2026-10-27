"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import {
  PAGE_SIZE,
  SORT_KEYS,
  TYPE_KEY_LIST,
  activeFilterCount,
  buildUniversityIndex,
  effectiveSort,
  parseDirectoryState,
  runDirectoryQuery,
  serializeDirectoryState,
  type DirectoryState,
  type SortKey,
} from "@/lib/discovery/directory";
import { closestCandidate } from "@/lib/discovery/search";
import { formatDate } from "@/lib/discovery/facts";
import { STATES, STATE_BY_CODE, cityName } from "@/data/states";
import type { StateCode, UniversitySummary } from "@/lib/discovery/types";
import { SUBJECT_AREAS } from "@/lib/discovery/types";
import SearchCombobox from "./SearchCombobox";
import UniversityCard from "./UniversityCard";

const GermanyMap = dynamic(() => import("@/components/GermanyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full animate-pulse rounded-sm border border-border bg-background-secondary sm:h-[560px]" />
  ),
});

const chip =
  "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";
const chipOn = "border-brand bg-brand text-white";
const chipOff = "border-border-strong bg-surface text-foreground-secondary hover:border-brand hover:text-brand";

export default function DirectoryExplorer({
  items,
  mapHint,
  mapZoomHint,
  dataCheckedAt,
}: {
  items: UniversitySummary[];
  mapHint: string;
  mapZoomHint: string;
  dataCheckedAt: string | null;
}) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const state = useMemo(() => parseDirectoryState(params), [params]);
  const gridRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<{ slug: string | null; token: number }>({ slug: null, token: 0 });

  const subjectLabels = useMemo(() => Object.fromEntries(SUBJECT_AREAS.map((s) => [s, t(`subjects.${s}`)])), [t]);
  const index = useMemo(() => buildUniversityIndex(items, subjectLabels), [items, subjectLabels]);
  const result = useMemo(() => runDirectoryQuery(items, index, state, locale), [items, index, state, locale]);

  const hasSubjects = items.some((u) => u.facts?.subjectAreas?.length);
  const hasEnglish = items.some((u) => u.facts?.englishTaught === true);
  const hasUniAssist = items.some((u) => u.facts?.uniAssistMember === true);

  const update = useCallback(
    (patch: Partial<DirectoryState>, opts: { keepPage?: boolean } = {}) => {
      const next = { ...state, ...patch, page: opts.keepPage ? (patch.page ?? state.page) : 1 };
      const qs = serializeDirectoryState(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [state, router, pathname]
  );

  const setQuery = useCallback((q: string) => update({ q }), [update]);

  function toggle<T extends string>(list: T[], value: T) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function goToPage(page: number) {
    update({ page }, { keepPage: true });
    // Land on the new cards themselves — never on the map above them.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gridRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  const stateName = (code: StateCode) => STATE_BY_CODE[code].name[locale === "tr" ? "tr" : "en"];

  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...(state.q ? [{ key: "q", label: t("directory.searchChip", { q: state.q }), remove: () => update({ q: "" }) }] : []),
    ...(state.level !== "all" ? [{ key: "level", label: t(`levels.${state.level}`), remove: () => update({ level: "all" }) }] : []),
    ...state.types.map((ty) => ({ key: `type-${ty}`, label: t(`types.${ty}`), remove: () => update({ types: state.types.filter((x) => x !== ty) }) })),
    ...state.badges.map((b) => ({ key: `badge-${b}`, label: t(`directory.${b}`), remove: () => update({ badges: state.badges.filter((x) => x !== b) }) })),
    ...state.states.map((s) => ({ key: `state-${s}`, label: stateName(s), remove: () => update({ states: state.states.filter((x) => x !== s) }) })),
    ...(state.city ? [{ key: "city", label: t("directory.cityChip", { city: cityName(state.city, locale) }), remove: () => update({ city: "" }) }] : []),
    ...(state.subject ? [{ key: "subject", label: t(`subjects.${state.subject}`), remove: () => update({ subject: "" }) }] : []),
    ...(state.ownership !== "any" ? [{ key: "own", label: t(`ownership.${state.ownership}`), remove: () => update({ ownership: "any" }) }] : []),
    ...(state.fee !== "any"
      ? [{ key: "fee", label: state.fee === "none" ? t("directory.feeNone") : t("directory.feeCharged"), remove: () => update({ fee: "any" }) }]
      : []),
    ...(state.english ? [{ key: "en", label: t("directory.english"), remove: () => update({ english: false }) }] : []),
    ...(state.uniAssist ? [{ key: "ua", label: t("directory.uniAssist"), remove: () => update({ uniAssist: false }) }] : []),
  ];

  const didYouMean =
    result.total === 0 && state.q ? closestCandidate(state.q, items.flatMap((u) => [u.name, ...u.cities])) : null;

  const mapItems = useMemo(
    () =>
      result.all.map((u) => ({
        slug: u.slug,
        name: u.name,
        city: u.cityLabel,
        type: u.type,
        badges: u.badges,
        lat: u.lat,
        lng: u.lng,
        tuitionFree: u.facts?.nonEuTuition.status === "none",
        competitiveness: u.competitiveness,
      })),
    [result.all]
  );

  const from = result.total === 0 ? 0 : (result.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(result.page * PAGE_SIZE, result.total);
  const moreFilterCount =
    state.states.length + (state.ownership !== "any" ? 1 : 0) + (state.fee !== "any" ? 1 : 0) + (state.uniAssist ? 1 : 0) + (state.english ? 1 : 0) + (state.subject ? 1 : 0);

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <SearchCombobox
          items={items}
          index={index}
          value={state.q}
          onChange={setQuery}
          onPickCity={(city) => update({ city })}
          onPickState={(code) => update({ states: state.states.includes(code) ? state.states : [...state.states, code] })}
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label={t("types.label")}>
        {TYPE_KEY_LIST.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={state.types.includes(key)}
            onClick={() => update({ types: toggle(state.types, key) })}
            className={`${chip} ${state.types.includes(key) ? chipOn : chipOff}`}
          >
            {t(`types.${key}`)}
            <span className={state.types.includes(key) ? "text-white/70" : "text-foreground-muted"}>({result.typeCounts[key]})</span>
          </button>
        ))}
        {(["tu9", "excellence"] as const).map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={state.badges.includes(b)}
            onClick={() => update({ badges: toggle(state.badges, b) })}
            className={`${chip} ${state.badges.includes(b) ? chipOn : chipOff}`}
          >
            {t(`directory.${b}`)}
            <span className={state.badges.includes(b) ? "text-white/70" : "text-foreground-muted"}>({result.badgeCounts[b]})</span>
          </button>
        ))}
      </div>

      <details className="group mx-auto mt-4 max-w-4xl rounded-sm border border-border bg-surface" open={moreFilterCount > 0 || undefined}>
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-foreground-secondary marker:content-none hover:text-forest">
          <SlidersHorizontal size={16} />
          {t("directory.moreFilters")}
          {moreFilterCount > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{moreFilterCount}</span>}
        </summary>
        <div className="grid grid-cols-1 gap-6 border-t border-border p-5 md:grid-cols-2 lg:grid-cols-3">
          <fieldset className="lg:col-span-1">
            <legend className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("directory.state")}</legend>
            <div className="mt-2 grid max-h-56 grid-cols-1 gap-1 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
              {STATES.map((s) => (
                <label key={s.code} className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1 text-sm text-foreground-secondary hover:bg-background-secondary">
                  <input
                    type="checkbox"
                    checked={state.states.includes(s.code)}
                    onChange={() => update({ states: toggle(state.states, s.code) })}
                    className="h-4 w-4 accent-[var(--brand)]"
                  />
                  {s.name[locale === "tr" ? "tr" : "en"]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-6">
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("directory.fee")}</legend>
              <div className="mt-2 space-y-1">
                {(["any", "none", "charged"] as const).map((fee) => (
                  <label key={fee} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground-secondary">
                    <input type="radio" name="fee" checked={state.fee === fee} onChange={() => update({ fee })} className="h-4 w-4 accent-[var(--brand)]" />
                    {fee === "any" ? t("directory.feeAny") : fee === "none" ? t("directory.feeNone") : t("directory.feeCharged")}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("ownership.label")}</legend>
              <div className="mt-2 space-y-1">
                {(["any", "public", "private"] as const).map((own) => (
                  <label key={own} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground-secondary">
                    <input type="radio" name="own" checked={state.ownership === own} onChange={() => update({ ownership: own })} className="h-4 w-4 accent-[var(--brand)]" />
                    {own === "any" ? t("directory.ownershipAny") : t(`ownership.${own}`)}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="space-y-6">
            {hasSubjects && (
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("subjects.label")}</span>
                <select
                  value={state.subject}
                  onChange={(e) => update({ subject: e.target.value as DirectoryState["subject"] })}
                  className="mt-2 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
                >
                  <option value="">{t("subjects.any")}</option>
                  {SUBJECT_AREAS.map((s) => (
                    <option key={s} value={s}>
                      {t(`subjects.${s}`)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {hasUniAssist && (
              <label className="flex cursor-pointer items-start gap-2 text-sm text-foreground-secondary">
                <input type="checkbox" checked={state.uniAssist} onChange={() => update({ uniAssist: !state.uniAssist })} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
                {t("directory.uniAssist")}
              </label>
            )}
            {hasEnglish && (
              <div>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-foreground-secondary">
                  <input type="checkbox" checked={state.english} onChange={() => update({ english: !state.english })} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
                  {t("directory.english")}
                </label>
                <p className="ml-6 mt-1 text-[11px] leading-relaxed text-foreground-muted">{t("directory.englishNote")}</p>
              </div>
            )}
          </div>
        </div>
      </details>

      <div className="mt-6 flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-foreground" aria-live="polite">
          {t("directory.resultCount", { count: result.total })}
          {result.total > PAGE_SIZE && <span className="ml-2 font-normal text-foreground-muted">{t("directory.showing", { from, to, total: result.total })}</span>}
        </p>
        <label className="flex items-center gap-2 text-sm text-foreground-secondary">
          {t("directory.sort")}
          <select
            value={effectiveSort(state)}
            onChange={(e) => update({ sort: e.target.value as SortKey })}
            className="rounded-sm border border-border-strong bg-surface px-3 py-1.5 text-sm text-foreground"
          >
            {SORT_KEYS.filter((key) => key !== "relevance" || state.q).map((key) => (
              <option key={key} value={key}>
                {t(`directory.sortOptions.${key}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2" aria-label={t("directory.activeFilters")}>
          {activeChips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.remove}
              aria-label={t("directory.removeFilter", { label: c.label })}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-background-secondary px-3 py-1 text-xs font-medium text-foreground-secondary hover:border-clay hover:text-clay-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              {c.label}
              <X size={12} />
            </button>
          ))}
          {activeFilterCount(state) > 1 && (
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="text-xs font-semibold text-clay-dark underline underline-offset-2 hover:text-clay"
            >
              {t("common.clearAll")}
            </button>
          )}
        </div>
      )}

      <div ref={mapRef} className="mt-8 scroll-mt-24">
        <GermanyMap
          items={mapItems}
          locale={locale}
          hint={mapHint}
          zoomHint={mapZoomHint}
          emptyMessage={t("directory.noResultsTitle")}
          focusSlug={focus.slug}
          focusToken={focus.token}
        />
      </div>

      <div id="results" ref={gridRef} tabIndex={-1} className="scroll-mt-24 focus:outline-none">
      {result.total === 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-sm border border-border bg-surface p-8 text-center">
          <p className="font-display text-xl text-foreground">{t("directory.noResultsTitle")}</p>
          <p className="mt-2 text-sm text-foreground-secondary">{t("directory.noResultsBody")}</p>
          {didYouMean && (
            <button
              type="button"
              onClick={() => update({ q: didYouMean })}
              className="mt-4 text-sm font-semibold text-forest underline underline-offset-2 hover:text-brand"
            >
              {t("directory.didYouMean", { suggestion: didYouMean })}
            </button>
          )}
          {activeChips.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {activeChips.map((c) => (
                <button key={c.key} type="button" onClick={c.remove} className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1 text-xs text-foreground-secondary hover:border-clay hover:text-clay-dark">
                  {c.label} <X size={12} />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.pageItems.map((uni) => (
            <UniversityCard
              key={uni.slug}
              uni={uni}
              onFocusMap={(slug) => {
                setFocus((f) => ({ slug, token: f.token + 1 }));
                mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          ))}
        </div>
      )}
      </div>

      {result.pageCount > 1 && (
        <nav aria-label={t("directory.pagination")} className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={result.page <= 1}
            onClick={() => goToPage(result.page - 1)}
            className="rounded-sm border border-border-strong px-3 py-2 text-sm text-foreground-secondary hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("directory.previous")}
          </button>
          {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              aria-current={p === result.page ? "page" : undefined}
              aria-label={t("directory.page", { page: p })}
              className={`h-10 min-w-10 rounded-sm border px-3 text-sm ${p === result.page ? "border-forest bg-forest text-white" : "border-border-strong text-foreground-secondary hover:border-forest hover:text-forest"}`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={result.page >= result.pageCount}
            onClick={() => goToPage(result.page + 1)}
            className="rounded-sm border border-border-strong px-3 py-2 text-sm text-foreground-secondary hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("directory.next")}
          </button>
        </nav>
      )}

      <div className="mx-auto mt-10 max-w-3xl space-y-1 text-center text-xs text-foreground-muted">
        {dataCheckedAt && <p>{t("directory.dataNote", { date: formatDate(dataCheckedAt, locale) })}</p>}
        <p>{t("common.verifyNotice")}</p>
      </div>
    </div>
  );
}
