"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, GraduationCap, MapPin, Map as MapIcon } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { normalize, search, type SearchIndex } from "@/lib/discovery/search";
import { STATES, cityName } from "@/data/states";
import type { DirectoryItem, StateCode } from "@/lib/discovery/types";

type Suggestion =
  | { kind: "university"; id: string; label: string; detail: string }
  | { kind: "city"; id: string; label: string; detail: string }
  | { kind: "state"; id: StateCode; label: string; detail: string };

function prefixOrContains(haystack: string, q: string) {
  const h = normalize(haystack);
  return h.startsWith(q) || h.includes(` ${q}`) || (q.length >= 4 && h.includes(q));
}

export default function SearchCombobox({
  items,
  index,
  value,
  onChange,
  onPickCity,
  onPickState,
}: {
  items: DirectoryItem[];
  index: SearchIndex;
  value: string;
  onChange: (q: string) => void;
  onPickCity: (city: string) => void;
  onPickState: (state: StateCode) => void;
}) {
  const t = useTranslations("discovery.directory");
  const locale = useLocale();
  const router = useRouter();
  const listId = useId();
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Follow external changes to the query (back button, cleared chip) without an effect.
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = normalize(draft);
    if (q.length < 2) return [];
    const bySlug = new Map(items.map((u) => [u.slug, u]));
    const universities = search(index, draft)
      .slice(0, 5)
      .map((r) => bySlug.get(r.id)!)
      .map((u): Suggestion => ({ kind: "university", id: u.slug, label: u.name, detail: u.cityLabel }));
    const cityCounts = new Map<string, number>();
    items.forEach((u) => u.cities.forEach((c) => cityCounts.set(c, (cityCounts.get(c) ?? 0) + 1)));
    const cities = [...cityCounts.entries()]
      .filter(([c]) => prefixOrContains(c, q) || prefixOrContains(cityName(c, locale), q))
      .slice(0, 3)
      .map(([c, n]): Suggestion => ({ kind: "city", id: c, label: cityName(c, locale), detail: String(n) }));
    const states = STATES.filter((s) => [s.name.de, s.name.en, s.name.tr].some((n) => prefixOrContains(n, q)))
      .slice(0, 2)
      .map((s): Suggestion => ({ kind: "state", id: s.code, label: s.name[locale === "tr" ? "tr" : "en"], detail: "" }));
    return [...cities, ...states, ...universities];
  }, [draft, items, index, locale]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [draft, value, onChange]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(s: Suggestion) {
    setOpen(false);
    setActive(-1);
    if (s.kind === "university") {
      router.push(`/universities/${s.id}`);
    } else {
      setDraft("");
      onChange("");
      if (s.kind === "city") onPickCity(s.id);
      else onPickState(s.id);
    }
  }

  const showList = open && suggestions.length > 0;
  const groupLabel = { university: t("suggestions.universities"), city: t("suggestions.cities"), state: t("suggestions.states") };
  const Icon = { university: GraduationCap, city: MapPin, state: MapIcon };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={`${listId}-input`} className="sr-only">
        {t("searchLabel")}
      </label>
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
      <input
        id={`${listId}-input`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
        autoComplete="off"
        value={draft}
        placeholder={t("searchPlaceholder")}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setDraft(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && suggestions.length) {
            e.preventDefault();
            setOpen(true);
            setActive((a) => (a + 1) % suggestions.length);
          } else if (e.key === "ArrowUp" && suggestions.length) {
            e.preventDefault();
            setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (showList && active >= 0) pick(suggestions[active]);
            else {
              onChange(draft);
              setOpen(false);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
            setActive(-1);
          }
        }}
        className="w-full rounded-sm border border-border-strong bg-surface py-3 pl-11 pr-12 text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 [&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            onChange("");
          }}
          aria-label={t("removeFilter", { label: draft })}
          className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm text-foreground-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <X size={16} />
        </button>
      )}
      {showList && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-80 overflow-auto rounded-sm border border-border bg-surface py-1 shadow-elevated">
          {suggestions.map((s, i) => {
            const SuggestionIcon = Icon[s.kind];
            const first = i === 0 || suggestions[i - 1].kind !== s.kind;
            return (
              <li key={`${s.kind}-${s.id}`} role="presentation">
                {first && <div className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">{groupLabel[s.kind]}</div>}
                <div
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(s);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2 text-sm ${i === active ? "bg-background-secondary text-forest" : "text-foreground"}`}
                >
                  <SuggestionIcon size={15} className="shrink-0 text-foreground-muted" />
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  {s.detail && <span className="shrink-0 text-xs text-foreground-muted">{s.detail}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
