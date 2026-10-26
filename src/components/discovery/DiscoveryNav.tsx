"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useFavorites, useCompareList } from "@/lib/discovery/store";

const LINKS = [
  { href: "/universities", key: "directory", exact: true },
  { href: "/universities/finder", key: "finder" },
  { href: "/universities/programmes", key: "programmes" },
  { href: "/germany", key: "states" },
  { href: "/compare", key: "compare" },
  { href: "/shortlist", key: "shortlist" },
  { href: "/planner", key: "planner" },
  { href: "/cost-calculator", key: "costs" },
  { href: "/scholarships", key: "scholarships" },
] as const;

export default function DiscoveryNav() {
  const t = useTranslations("discovery.nav");
  const pathname = usePathname();
  const favorites = useFavorites().length;
  const compare = useCompareList().length;

  return (
    <nav aria-label={t("label")} className="border-b border-border bg-background-secondary">
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex min-w-max gap-1 py-2">
          {LINKS.map((link) => {
            const active = "exact" in link ? pathname === link.href : pathname.startsWith(link.href);
            const count = link.key === "shortlist" ? favorites : link.key === "compare" ? compare : 0;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                    active ? "bg-surface text-forest shadow-soft" : "text-foreground-secondary hover:bg-surface hover:text-forest"
                  }`}
                >
                  {t(link.key)}
                  {count > 0 && <span className="rounded-full bg-forest px-1.5 text-[11px] font-semibold text-white">{count}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
