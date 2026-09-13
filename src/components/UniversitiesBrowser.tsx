"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { universityMedia, universityLogos } from "@/lib/universityMedia";
import Reveal from "./Reveal";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  description: string;
};

type FilterKey = "all" | "universitat" | "hochschule" | "dual" | "tu9" | "excellence";

const FILTER_KEYS: FilterKey[] = ["all", "universitat", "hochschule", "dual", "tu9", "excellence"];

function matches(item: UniversityItem, key: FilterKey) {
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

export default function UniversitiesBrowser({
  items,
  locale,
  labels,
}: {
  items: UniversityItem[];
  locale: string;
  labels: Record<FilterKey, string>;
}) {
  const [active, setActive] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const key of FILTER_KEYS) c[key] = items.filter((i) => matches(i, key)).length;
    return c;
  }, [items]);

  const filtered = items.filter((i) => matches(i, active));

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {FILTER_KEYS.map((key) => {
          if (key !== "all" && counts[key] === 0) return null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                active === key
                  ? "border-brand bg-brand text-white"
                  : "border-border-strong bg-surface text-foreground-secondary hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              }`}
            >
              {labels[key]}
              <span className={active === key ? "text-blue-100" : "text-foreground-muted"}>({counts[key]})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((uni, index) => {
          const logo = universityLogos[uni.slug];
          const fallbackCover = universityMedia[uni.slug]?.[0];
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
                    {uni.badges.includes("excellence") && (
                      <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        {locale === "tr" ? "Exzellenz" : "Excellence"}
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
                    {uni.badges.includes("excellence") && (
                      <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        {locale === "tr" ? "Exzellenz" : "Excellence"}
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
                  </div>
                  {uni.badges.includes("tu9") && (
                    <span className="mt-2 inline-flex w-fit items-center rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                      TU9
                    </span>
                  )}
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
