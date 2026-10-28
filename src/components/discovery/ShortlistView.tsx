"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, Scale } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { clearFavorites, setCompareList, useFavorites, useHydrated, MAX_COMPARE } from "@/lib/discovery/store";
import type { UniversitySummary } from "@/lib/discovery/types";
import UniversityCard from "./UniversityCard";
import AddToPlannerButton from "./AddToPlannerButton";

export default function ShortlistView({ items }: { items: UniversitySummary[] }) {
  const t = useTranslations("discovery.shortlist");
  const tTray = useTranslations("discovery.tray");
  const router = useRouter();
  const hydrated = useHydrated();
  const favorites = useFavorites();
  const saved = favorites.map((slug) => items.find((u) => u.slug === slug)).filter((u): u is UniversitySummary => Boolean(u));
  const [selected, setSelected] = useState<string[]>([]);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-sm border border-border bg-background-secondary" />
        ))}
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-dashed border-border-strong p-10 text-center">
        <Bookmark size={32} className="mx-auto text-foreground-muted" />
        <p className="mt-4 font-display text-xl text-foreground">{t("empty")}</p>
        <p className="mt-2 text-sm text-foreground-secondary">{t("emptyBody")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/universities" className="rounded-sm bg-brand-fill px-4 py-2 text-sm font-semibold text-white hover:bg-brand-fill-hover">
            {t("browse")}
          </Link>
          <Link href="/universities/finder" className="rounded-sm border border-forest px-4 py-2 text-sm font-semibold text-forest hover:bg-forest-fill hover:text-white">
            {t("useFinder")}
          </Link>
        </div>
      </div>
    );
  }

  const toggleSelected = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length >= MAX_COMPARE ? s : [...s, slug]));

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-foreground">{t("count", { count: saved.length })}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-foreground-muted">{t("compareHint")}</span>
          <button
            type="button"
            disabled={selected.length < 2}
            onClick={() => {
              setCompareList(selected);
              router.push(`/compare?ids=${selected.join(",")}`);
            }}
            className="inline-flex items-center gap-1.5 rounded-sm bg-brand-fill px-4 py-2 text-sm font-semibold text-white hover:bg-brand-fill-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Scale size={16} />
            {t("compareSaved")} ({selected.length})
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t("clearConfirm"))) clearFavorites();
            }}
            className="px-2 py-2 text-xs font-semibold text-clay-dark hover:text-clay"
          >
            {t("clear")}
          </button>
        </div>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((uni) => (
          <li key={uni.slug} className="flex flex-col gap-2">
            <UniversityCard uni={uni} />
            <div className="flex items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-secondary">
                <input
                  type="checkbox"
                  checked={selected.includes(uni.slug)}
                  onChange={() => toggleSelected(uni.slug)}
                  disabled={!selected.includes(uni.slug) && selected.length >= MAX_COMPARE}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                {tTray("compare")}
              </label>
              <AddToPlannerButton slug={uni.slug} name={uni.name} label={t("addToPlanner")} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
