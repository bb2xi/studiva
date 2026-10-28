"use client";

import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck, Scale } from "lucide-react";
import { toggleCompare, toggleFavorite, useCompareList, useFavorites } from "@/lib/discovery/store";
import { toast } from "./Toaster";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-sm border text-xs font-semibold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

/**
 * withLabel: false = icon only, true = full label, "short" = a one-word label
 * for tight spaces such as cards; the accessible name then starts with that
 * word (label in name, so "click Compare" works by voice) and the full label
 * stays in the tooltip.
 * touch: icon-only buttons grow to a 44 px target below the lg breakpoint.
 */
type LabelMode = boolean | "short";

export function FavoriteButton({ slug, name, withLabel = false, touch = false, className = "" }: { slug: string; name: string; withLabel?: LabelMode; touch?: boolean; className?: string }) {
  const t = useTranslations("discovery.favorites");
  const saved = useFavorites().includes(slug);
  const label = saved ? t("remove") : t("add");
  const visible = withLabel === "short" ? (saved ? t("shortSaved") : t("short")) : label;
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel === true ? undefined : `${withLabel === "short" ? visible : label}: ${name}`}
      title={label}
      onClick={() => {
        const nowSaved = toggleFavorite(slug);
        toast(nowSaved ? t("added", { name }) : t("removed", { name }), nowSaved ? "success" : "info");
      }}
      className={`${base} ${withLabel ? "px-3 py-2" : touch ? "h-11 w-11 lg:h-9 lg:w-9" : "h-9 w-9"} ${
        saved ? "border-forest-fill bg-forest-fill text-white" : "border-border-strong bg-surface text-foreground-secondary hover:border-forest hover:text-forest"
      } ${className}`}
    >
      {saved ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}
      {withLabel && <span>{visible}</span>}
    </button>
  );
}

export function CompareButton({ slug, name, withLabel = false, touch = false, className = "" }: { slug: string; name: string; withLabel?: LabelMode; touch?: boolean; className?: string }) {
  const t = useTranslations("discovery.compareToggle");
  const selected = useCompareList().includes(slug);
  const label = selected ? t("remove") : t("add");
  const visible = withLabel === "short" ? (selected ? t("shortSelected") : t("short")) : label;
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={withLabel === true ? undefined : `${withLabel === "short" ? visible : label}: ${name}`}
      title={label}
      onClick={() => {
        const result = toggleCompare(slug);
        if (result === "full") toast(t("full"), "info");
        else toast(result === "added" ? t("added", { name }) : t("removed", { name }), result === "added" ? "success" : "info");
      }}
      className={`${base} ${withLabel ? "px-3 py-2" : touch ? "h-11 w-11 lg:h-9 lg:w-9" : "h-9 w-9"} ${
        selected ? "border-brand-fill bg-brand-fill text-white" : "border-border-strong bg-surface text-foreground-secondary hover:border-brand hover:text-brand"
      } ${className}`}
    >
      <Scale size={16} aria-hidden />
      {withLabel && <span>{visible}</span>}
    </button>
  );
}
