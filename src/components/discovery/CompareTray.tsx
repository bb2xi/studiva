"use client";

import { useTranslations } from "next-intl";
import { Scale, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { setCompareList, toggleCompare, useCompareList } from "@/lib/discovery/store";

/** Floating bar listing the universities picked for comparison; hidden on the compare page itself. */
export default function CompareTray({ names }: { names: Record<string, string> }) {
  const t = useTranslations("discovery.tray");
  const pathname = usePathname();
  const selected = useCompareList().filter((slug) => names[slug]);
  if (selected.length === 0 || pathname.startsWith("/compare")) return null;

  return (
    <aside
      aria-label={t("label")}
      className="fixed inset-x-3 bottom-20 z-[60] mx-auto max-w-3xl rounded-sm border border-border-strong bg-surface p-3 shadow-elevated sm:bottom-5 sm:pr-20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Scale size={18} className="shrink-0 text-brand" />
        <span className="text-sm font-semibold text-foreground">{t("count", { count: selected.length })}</span>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {selected.map((slug) => (
            <li key={slug}>
              <button
                type="button"
                onClick={() => toggleCompare(slug)}
                aria-label={`${names[slug]} ✕`}
                className="inline-flex max-w-[12rem] items-center gap-1 rounded-full border border-border-strong px-2.5 py-1 text-xs text-foreground-secondary hover:border-clay hover:text-clay-dark"
              >
                <span className="truncate">{names[slug]}</span>
                <X size={12} className="shrink-0" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCompareList([])} className="px-2 py-2 text-xs font-semibold text-foreground-muted hover:text-clay-dark">
            {t("clear")}
          </button>
          <Link
            href={`/compare?ids=${selected.join(",")}`}
            className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
          >
            {t("compare")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
