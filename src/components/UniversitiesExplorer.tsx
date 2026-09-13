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

export default function UniversitiesExplorer({
  items,
  locale,
  mapTitle,
  mapSubtitle,
  mapLabels,
  browserLabels,
  searchPlaceholder,
  searchNoResults,
}: {
  items: UniversityItem[];
  locale: string;
  mapTitle: string;
  mapSubtitle: string;
  mapLabels: { all: string; tu9: string; excellence: string; hochschule: string; hint: string };
  browserLabels: Record<FilterKey, string>;
  searchPlaceholder: string;
  searchNoResults: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)
    );
  }, [items, query]);

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

          {filtered.length === 0 && (
            <p className="mt-6 text-center text-sm text-foreground-muted">{searchNoResults}</p>
          )}

          <div className="mt-10">
            <GermanyMap items={filtered} locale={locale} labels={mapLabels} />
          </div>
        </Container>
      </section>

      <section className="bg-background-secondary py-20 sm:py-24">
        <Container>
          <UniversitiesBrowser items={filtered} locale={locale} labels={browserLabels} />
        </Container>
      </section>
    </>
  );
}
