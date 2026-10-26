"use client";

import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck, Scale } from "lucide-react";
import { toggleCompare, toggleFavorite, useCompareList, useFavorites } from "@/lib/discovery/store";
import { toast } from "./Toaster";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-sm border text-xs font-semibold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

export function FavoriteButton({ slug, name, withLabel = false, className = "" }: { slug: string; name: string; withLabel?: boolean; className?: string }) {
  const t = useTranslations("discovery.favorites");
  const saved = useFavorites().includes(slug);
  const label = saved ? t("remove") : t("add");
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel ? undefined : `${label}: ${name}`}
      title={label}
      onClick={() => {
        const nowSaved = toggleFavorite(slug);
        toast(nowSaved ? t("added", { name }) : t("removed", { name }), nowSaved ? "success" : "info");
      }}
      className={`${base} ${withLabel ? "px-3 py-2" : "h-9 w-9"} ${
        saved ? "border-forest bg-forest text-white" : "border-border-strong bg-surface text-foreground-secondary hover:border-forest hover:text-forest"
      } ${className}`}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {withLabel && <span>{label}</span>}
    </button>
  );
}

export function CompareButton({ slug, name, withLabel = false, className = "" }: { slug: string; name: string; withLabel?: boolean; className?: string }) {
  const t = useTranslations("discovery.compareToggle");
  const selected = useCompareList().includes(slug);
  const label = selected ? t("remove") : t("add");
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={withLabel ? undefined : `${label}: ${name}`}
      title={label}
      onClick={() => {
        const result = toggleCompare(slug);
        if (result === "full") toast(t("full"), "info");
        else toast(result === "added" ? t("added", { name }) : t("removed", { name }), result === "added" ? "success" : "info");
      }}
      className={`${base} ${withLabel ? "px-3 py-2" : "h-9 w-9"} ${
        selected ? "border-brand bg-brand text-white" : "border-border-strong bg-surface text-foreground-secondary hover:border-brand hover:text-brand"
      } ${className}`}
    >
      <Scale size={16} />
      {withLabel && <span>{label}</span>}
    </button>
  );
}
