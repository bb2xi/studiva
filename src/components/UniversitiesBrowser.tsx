"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { universityMedia, universityLogos } from "@/lib/universityMedia";
import Reveal from "./Reveal";

type UniversityItem = {
  slug: string;
  country: string;
  name: string;
  city: string;
  type: string;
  description: string;
};

type CountryMeta = { name: string; flag: string };

export default function UniversitiesBrowser({
  items,
  countries,
  countryOrder,
  locale,
  allLabel,
}: {
  items: UniversityItem[];
  countries: Record<string, CountryMeta>;
  countryOrder: string[];
  locale: string;
  allLabel: string;
}) {
  const [active, setActive] = useState<string>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const item of items) c[item.country] = (c[item.country] ?? 0) + 1;
    return c;
  }, [items]);

  const filtered = active === "all" ? items : items.filter((i) => i.country === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
            active === "all"
              ? "border-brand bg-brand text-white"
              : "border-border-strong bg-surface text-foreground-secondary hover:-translate-y-0.5 hover:border-brand hover:text-brand"
          }`}
        >
          {allLabel}
          <span className={active === "all" ? "text-blue-100" : "text-foreground-muted"}>({items.length})</span>
        </button>
        {countryOrder.map((code) => {
          const meta = countries[code];
          if (!meta || !counts[code]) return null;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setActive(code)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                active === code
                  ? "border-brand bg-brand text-white"
                  : "border-border-strong bg-surface text-foreground-secondary hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              }`}
            >
              <span>{meta.flag}</span>
              {meta.name}
              <span className={active === code ? "text-blue-100" : "text-foreground-muted"}>({counts[code]})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((uni, index) => {
          const logo = universityLogos[uni.slug];
          const fallbackCover = universityMedia[uni.slug]?.[0];
          const countryMeta = countries[uni.country];
          return (
            <Reveal key={uni.slug} delay={(index % 6) * 60}>
              <Link
                href={`/universities/${uni.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                {logo ? (
                  <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-background-secondary p-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.url}
                      alt={uni.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain grayscale opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand shadow-sm backdrop-blur">
                      {uni.type}
                    </span>
                    {countryMeta && (
                      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-base shadow-sm backdrop-blur">
                        {countryMeta.flag}
                      </span>
                    )}
                  </div>
                ) : fallbackCover ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-background-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fallbackCover.url}
                      alt={uni.name}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand shadow-sm backdrop-blur">
                      {uni.type}
                    </span>
                    {countryMeta && (
                      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-base shadow-sm backdrop-blur">
                        {countryMeta.flag}
                      </span>
                    )}
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-brand">
                    {uni.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin size={13} />
                    {uni.city}
                    {countryMeta && `, ${countryMeta.name}`}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground-secondary">
                    {uni.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    {locale === "tr" ? "Detayları Gör" : "View Details"}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
