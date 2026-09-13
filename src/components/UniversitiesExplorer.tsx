"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import UniversitiesBrowser from "./UniversitiesBrowser";

const GermanyMap = dynamic(() => import("./GermanyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full animate-pulse rounded-2xl border border-border bg-background-secondary sm:h-[560px] lg:h-[640px]" />
  ),
});

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  lat: number;
  lng: number;
  description: string;
};

type FilterKey = "all" | "universitat" | "hochschule" | "dual" | "tu9" | "excellence";

const FILTER_KEYS: FilterKey[] = ["all", "universitat", "hochschule", "dual", "tu9", "excellence"];

function matchesFilter(item: UniversityItem, key: FilterKey) {
  switch (key) {
    case "all":
      return true;
    case "universitat":
      return item.type === "Universität";
    case "hochschule":
      return item.type === "Fachhochschule";
    case "dual":
      return item.type === "Duale Hochschule";
    case "tu9":
      return item.badges.includes("tu9");
    case "excellence":
      return item.badges.includes("excellence");
  }
}

export default function UniversitiesExplorer({
  items,
  locale,
  mapTitle,
  mapSubtitle,
  mapHint,
  mapZoomHint,
  filterLabels,
  searchPlaceholder,
  searchNoResults,
}: {
  items: UniversityItem[];
  locale: string;
  mapTitle: string;
  mapSubtitle: string;
  mapHint: string;
  mapZoomHint: string;
  filterLabels: Record<FilterKey, string>;
  searchPlaceholder: string;
  searchNoResults: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)
    );
  }, [items, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const key of FILTER_KEYS) c[key] = searched.filter((i) => matchesFilter(i, key)).length;
    return c;
  }, [searched]);

  const filtered = useMemo(() => searched.filter((i) => matchesFilter(i, filter)), [searched, filter]);

  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading title={mapTitle} subtitle={mapSubtitle} />

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-border-strong bg-surface py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground-muted transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {FILTER_KEYS.map((key) => {
              if (key !== "all" && counts[key] === 0) return null;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                    filter === key
                      ? "border-brand bg-brand text-white"
                      : "border-border-strong bg-surface text-foreground-secondary hover:-translate-y-0.5 hover:border-brand hover:text-brand"
                  }`}
                >
                  {filterLabels[key]}
                  <span className={filter === key ? "text-blue-100" : "text-foreground-muted"}>
                    ({counts[key]})
                  </span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="mt-6 text-center text-sm text-foreground-muted">{searchNoResults}</p>
          )}

          <div className="mt-10">
            <GermanyMap items={filtered} locale={locale} hint={mapHint} zoomHint={mapZoomHint} />
          </div>
        </Container>
      </section>

      <section className="bg-background-secondary py-20 sm:py-24">
        <Container>
          <UniversitiesBrowser items={filtered} locale={locale} />
        </Container>
      </section>
    </>
  );
}
