"use client";

import { ArrowUpRight, MapPin, Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { universityMedia, universityLogos } from "@/lib/universityMedia";
import { Tag } from "./Tag";
import { Heading } from "./Typography";
import Reveal from "./Reveal";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  description: string;
  tuitionFree?: boolean;
  competitiveness?: "low" | "medium" | "high";
};

export default function UniversitiesBrowser({
  items,
  locale,
  onFocusMap,
}: {
  items: UniversityItem[];
  locale: string;
  /** Called with a university's slug when its "show on map" button is
   * pressed — lets a parent scroll to and open that marker on the map
   * above, without hijacking the card's own click-through to the detail
   * page (the two are separate controls, not nested interactive elements). */
  onFocusMap?: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((uni, index) => {
        const logo = universityLogos[uni.slug];
        const fallbackCover = universityMedia[uni.slug]?.[0];
        return (
          <Reveal key={uni.slug} delay={(index % 6) * 60}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-surface">
              <Link
                href={`/universities/${uni.slug}`}
                aria-label={uni.name}
                className="absolute inset-0 z-10 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              />
              {onFocusMap && (
                <button
                  type="button"
                  onClick={() => onFocusMap(uni.slug)}
                  aria-label={locale === "tr" ? `${uni.name} konumunu haritada göster` : `Show ${uni.name} on the map`}
                  className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground-secondary shadow-soft backdrop-blur transition-colors duration-200 ease-out hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  <Compass size={16} />
                </button>
              )}
              {logo ? (
                <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden border-b border-border bg-background-secondary p-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.url} alt={uni.name} loading="lazy" className="max-h-full max-w-full object-contain" />
                </div>
              ) : fallbackCover ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fallbackCover.url} alt={uni.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag variant="neutral">{uni.type}</Tag>
                  {uni.badges.includes("excellence") && (
                    <Tag variant="brass">{locale === "tr" ? "Exzellenz" : "Excellence"}</Tag>
                  )}
                  {uni.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
                  {uni.tuitionFree && <Tag variant="forest">{locale === "tr" ? "Ücretsiz" : "No Fee"}</Tag>}
                </div>
                <Heading as="h3" size="sm" className="mt-3 transition-colors group-hover:text-forest">
                  {uni.name}
                </Heading>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                  <MapPin size={13} />
                  {uni.city}
                </div>
                <p className="mt-4 flex-1 font-serif text-sm leading-relaxed text-foreground-secondary">
                  {uni.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                  {locale === "tr" ? "Detayları Gör" : "View Details"}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
