"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { STATES } from "@/data/states";
import { SUBJECT_AREAS } from "@/lib/discovery/types";
import {
  BADGE_KEYS,
  CONTRIBUTION_CAPS,
  TYPE_KEY_LIST,
  type DirectoryFacets,
  type DirectoryState,
} from "@/lib/discovery/directory";

/** States shown before "show all" (selected ones are always shown). */
const STATES_COLLAPSED = 6;

type Props = {
  state: DirectoryState;
  facets: DirectoryFacets;
  onChange: (patch: Partial<DirectoryState>) => void;
  /** Keeps radio group names and ids unique when the panel renders twice (sidebar + sheet). */
  idPrefix: string;
  /** Larger rows for touch (the mobile sheet). */
  touch?: boolean;
};

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export default function DirectoryFilters({ state, facets, onChange, idPrefix, touch = false }: Props) {
  const t = useTranslations("discovery");
  const locale = useLocale();
  const lang = locale === "tr" ? "tr" : "en";
  const [allStates, setAllStates] = useState(false);

  const sortedStates = [...STATES].sort((a, b) => a.name[lang].localeCompare(b.name[lang], locale));
  const shownStates = allStates ? sortedStates : sortedStates.filter((s, i) => i < STATES_COLLAPSED || state.states.includes(s.code));

  return (
    <div>
      <Section id={`${idPrefix}-fee`} title={t("directory.fee")} active={state.fee !== "any"} onClear={() => onChange({ fee: "any" })}>
        <FilterOption touch={touch}type="radio" name={`${idPrefix}-fee`} checked={state.fee === "any"} label={t("directory.feeAny")} onSelect={() => onChange({ fee: "any" })} />
        <FilterOption touch={touch}type="radio" name={`${idPrefix}-fee`} checked={state.fee === "none"} count={facets.fee.none} label={t("directory.feeNone")} onSelect={() => onChange({ fee: "none" })} />
        <FilterOption touch={touch}type="radio" name={`${idPrefix}-fee`} checked={state.fee === "charged"} count={facets.fee.charged} label={t("directory.feeCharged")} onSelect={() => onChange({ fee: "charged" })} />
      </Section>

      <Section id={`${idPrefix}-language`} title={t("directory.language")} active={state.english} onClear={() => onChange({ english: false })}>
        <FilterOption touch={touch}type="checkbox" checked={state.english} count={facets.english} label={t("directory.english")} onSelect={() => onChange({ english: !state.english })} />
        <p className="mt-1 px-1.5 text-[11px] leading-relaxed text-foreground-muted">{t("directory.englishNote")}</p>
      </Section>

      <Section id={`${idPrefix}-subject`} title={t("subjects.label")} active={state.subjects.length > 0} onClear={() => onChange({ subjects: [] })}>
        {SUBJECT_AREAS.map((s) => (
          <FilterOption
            touch={touch}
            key={s}
            type="checkbox"
            checked={state.subjects.includes(s)}
            count={facets.subjects[s]}
            label={t(`subjects.${s}`)}
            onSelect={() => onChange({ subjects: toggle(state.subjects, s) })}
          />
        ))}
      </Section>

      <Section id={`${idPrefix}-state`} title={t("directory.state")} active={state.states.length > 0} onClear={() => onChange({ states: [] })}>
        {shownStates.map((s) => (
          <FilterOption
            touch={touch}
            key={s.code}
            type="checkbox"
            checked={state.states.includes(s.code)}
            count={facets.states[s.code]}
            label={s.name[lang]}
            onSelect={() => onChange({ states: toggle(state.states, s.code) })}
          />
        ))}
        <button
          type="button"
          aria-expanded={allStates}
          onClick={() => setAllStates((v) => !v)}
          className={`mt-1 px-1.5 text-xs font-semibold text-forest underline underline-offset-2 hover:text-brand ${touch ? "min-h-11" : "min-h-8"}`}
        >
          {allStates ? t("directory.showFewer") : t("directory.showAllStates", { count: STATES.length })}
        </button>
      </Section>

      <Section id={`${idPrefix}-type`} title={t("types.label")} active={state.types.length > 0} onClear={() => onChange({ types: [] })}>
        {TYPE_KEY_LIST.map((key) => (
          <FilterOption
            touch={touch}
            key={key}
            type="checkbox"
            checked={state.types.includes(key)}
            count={facets.types[key]}
            label={t(`types.${key}`)}
            onSelect={() => onChange({ types: toggle(state.types, key) })}
          />
        ))}
      </Section>

      <Section id={`${idPrefix}-route`} title={t("directory.route")} active={state.route !== "any"} onClear={() => onChange({ route: "any" })}>
        <FilterOption touch={touch}type="radio" name={`${idPrefix}-route`} checked={state.route === "any"} label={t("directory.routeAny")} onSelect={() => onChange({ route: "any" })} />
        <FilterOption
          touch={touch}
          type="radio"
          name={`${idPrefix}-route`}
          checked={state.route === "uniassist"}
          count={facets.route.uniassist}
          label={t("directory.routeUniAssist")}
          onSelect={() => onChange({ route: "uniassist" })}
        />
        <FilterOption
          touch={touch}
          type="radio"
          name={`${idPrefix}-route`}
          checked={state.route === "direct"}
          count={facets.route.direct}
          label={t("directory.routeDirect")}
          onSelect={() => onChange({ route: "direct" })}
        />
      </Section>

      <Section
        id={`${idPrefix}-contribution`}
        title={t("directory.contribution")}
        active={state.contributionMax !== null}
        onClear={() => onChange({ contributionMax: null })}
      >
        <FilterOption
          touch={touch}
          type="radio"
          name={`${idPrefix}-cmax`}
          checked={state.contributionMax === null}
          label={t("directory.contributionAny")}
          onSelect={() => onChange({ contributionMax: null })}
        />
        {CONTRIBUTION_CAPS.map((cap) => (
          <FilterOption
            touch={touch}
            key={cap}
            type="radio"
            name={`${idPrefix}-cmax`}
            checked={state.contributionMax === cap}
            count={facets.contribution[cap]}
            label={t("directory.contributionMax", { amount: cap })}
            onSelect={() => onChange({ contributionMax: cap })}
          />
        ))}
        <p className="mt-1 px-1.5 text-[11px] leading-relaxed text-foreground-muted">{t("directory.contributionNote", { count: facets.contribution.unverified })}</p>
      </Section>

      <Section
        id={`${idPrefix}-ownership`}
        title={t("ownership.label")}
        active={state.ownership !== "any"}
        onClear={() => onChange({ ownership: "any" })}
        defaultOpen={false}
      >
        <FilterOption touch={touch}type="radio" name={`${idPrefix}-own`} checked={state.ownership === "any"} label={t("directory.ownershipAny")} onSelect={() => onChange({ ownership: "any" })} />
        <FilterOption
          touch={touch}
          type="radio"
          name={`${idPrefix}-own`}
          checked={state.ownership === "public"}
          count={facets.ownership.public}
          label={t("ownership.public")}
          onSelect={() => onChange({ ownership: "public" })}
        />
        <FilterOption
          touch={touch}
          type="radio"
          name={`${idPrefix}-own`}
          checked={state.ownership === "private"}
          count={facets.ownership.private}
          label={t("ownership.private")}
          onSelect={() => onChange({ ownership: "private" })}
        />
      </Section>

      <Section id={`${idPrefix}-badges`} title={t("directory.badges")} active={state.badges.length > 0} onClear={() => onChange({ badges: [] })} defaultOpen={false}>
        {BADGE_KEYS.map((b) => (
          <FilterOption
            touch={touch}
            key={b}
            type="checkbox"
            checked={state.badges.includes(b)}
            count={facets.badges[b]}
            label={t(`directory.${b}`)}
            onSelect={() => onChange({ badges: toggle(state.badges, b) })}
          />
        ))}
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  active,
  onClear,
  defaultOpen = true,
  children,
}: {
  id: string;
  title: string;
  active: boolean;
  onClear: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("discovery");
  const [open, setOpen] = useState(defaultOpen);
  // A section with an active filter never hides its options.
  const expanded = open || active;
  return (
    <fieldset id={id} className="scroll-mt-4 border-b border-border py-3 last:border-b-0">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`${id}-options`}
          onClick={() => setOpen(!expanded)}
          className="flex min-h-9 flex-1 items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wide text-foreground-secondary hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <ChevronDown size={14} className={`shrink-0 transition-transform ${expanded ? "" : "-rotate-90"}`} aria-hidden />
          {title}
        </button>
        {active && (
          <button type="button" onClick={onClear} className="min-h-9 shrink-0 text-xs font-semibold text-clay-dark underline underline-offset-2 hover:text-clay">
            {t("directory.clearSection")}
            <span className="sr-only">: {title}</span>
          </button>
        )}
      </div>
      <div id={`${id}-options`} hidden={!expanded} className="mt-1 space-y-0.5">
        {children}
      </div>
    </fieldset>
  );
}

type OptionProps = {
  type: "checkbox" | "radio";
  name?: string;
  checked: boolean;
  count?: number;
  label: string;
  onSelect: () => void;
  touch: boolean;
};

function FilterOption({ type, name, checked, count, label, onSelect, touch }: OptionProps) {
  // An option that would leave no results is disabled, unless it is already selected (so it can be undone).
  const disabled = count === 0 && !checked;
  return (
    <label
      className={`flex items-center gap-2.5 rounded-sm px-1.5 text-sm text-foreground-secondary ${touch ? "min-h-11" : "min-h-9"} ${
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:bg-background-secondary"
      }`}
    >
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={onSelect} className="h-4 w-4 shrink-0 accent-[var(--brand)]" />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && <span className="shrink-0 text-xs tabular-nums text-foreground-muted">{count}</span>}
    </label>
  );
}
