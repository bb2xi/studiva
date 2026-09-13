"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GERMANY_MAP_PATHS, GERMANY_MAP_VIEWBOX } from "@/lib/germanyMapPaths";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  mapCity: string;
};

type FilterKey = "all" | "tu9" | "excellence" | "hochschule";

const CITY_COORDS: Record<string, [number, number]> = {
  berlin: [68, 30],
  hamburg: [38, 19],
  muenchen: [58, 82],
  aachen: [8, 52],
  koeln: [15, 50],
  bonn: [16, 53],
  frankfurt: [32, 57],
  darmstadt: [33, 60],
  mannheim: [28, 63],
  heidelberg: [30, 64],
  karlsruhe: [27, 68],
  stuttgart: [33, 72],
  tuebingen: [32, 76],
  freiburg: [20, 80],
  furtwangen: [24, 78],
  konstanz: [33, 87],
  goettingen: [42, 42],
  hannover: [37, 35],
  braunschweig: [45, 36],
  dresden: [71, 55],
  erfurt: [47, 52],
  essen: [15, 44],
  erlangen: [56, 68],
  bochum: [18, 43],
  mainz: [30, 58],
  muenster: [22, 37],
  bremen: [29, 25],
  kiel: [37, 10],
  marburg: [33, 50],
  jena: [50, 52],
  ingolstadt: [57, 75],
  sanktaugustin: [19, 52],
  reutlingen: [34, 77],
  osnabrueck: [25, 34],
  wilhelmshaven: [25, 21],
  duesseldorf: [14, 47],
  dortmund: [21, 42],
  bielefeld: [28, 38],
  paderborn: [30, 41],
  siegen: [24, 48],
  wuppertal: [18, 46],
  luebeck: [41, 15],
  rostock: [48, 12],
  greifswald: [56, 12],
  magdeburg: [54, 33],
  halle: [54, 45],
  leipzig: [58, 46],
  chemnitz: [63, 51],
  potsdam: [65, 32],
  frankfurtoder: [78, 31],
  cottbus: [76, 40],
  wuerzburg: [47, 62],
  regensburg: [66, 76],
  passau: [73, 84],
  bayreuth: [60, 63],
  augsburg: [52, 80],
  bamberg: [55, 64],
  ulm: [43, 78],
  saarbruecken: [13, 70],
  kaiserslautern: [20, 65],
  hagen: [20, 44],
  oldenburg: [24, 27],
  hildesheim: [39, 39],
  lueneburg: [42, 23],
  clausthal: [43, 39],
  vechta: [26, 30],
};

const ZOOM_SCALE = 4.5;
const SPIDERFY_RADIUS = 1.8;

function spiderfyOffsets(count: number): Array<[number, number]> {
  if (count <= 1) return [[0, 0]];
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return [Math.cos(angle) * SPIDERFY_RADIUS, Math.sin(angle) * SPIDERFY_RADIUS];
  });
}

export default function GermanyMap({
  items,
  locale,
  labels,
}: {
  items: UniversityItem[];
  locale: string;
  labels: {
    all: string;
    tu9: string;
    excellence: string;
    hochschule: string;
    hint: string;
    emptyState: string;
    zoomOut: string;
  };
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [zoomedCity, setZoomedCity] = useState<string | null>(null);

  const cityGroups = useMemo(() => {
    const groups: Record<string, UniversityItem[]> = {};
    for (const item of items) {
      if (!item.mapCity) continue;
      (groups[item.mapCity] ??= []).push(item);
    }
    return groups;
  }, [items]);

  const matchesFilter = (item: UniversityItem) => {
    if (filter === "all") return true;
    if (filter === "tu9") return item.badges.includes("tu9");
    if (filter === "excellence") return item.badges.includes("excellence");
    return item.type !== "Universität";
  };

  const selectedItems = selected ? (cityGroups[selected] ?? []) : [];
  const zoomOrigin = zoomedCity ? CITY_COORDS[zoomedCity] : null;

  function handleCityClick(city: string) {
    setSelected(city === selected ? null : city);
    setZoomedCity(city);
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {(["all", "tu9", "excellence", "hochschule"] as FilterKey[]).map((key) => (
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
            {labels[key]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-foreground-muted">{labels.hint}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div
          className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl lg:col-span-3 lg:max-w-none"
          style={{ aspectRatio: "2480 / 3324" }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{
              transform: zoomOrigin ? `scale(${ZOOM_SCALE})` : "scale(1)",
              transformOrigin: zoomOrigin ? `${zoomOrigin[0]}% ${zoomOrigin[1]}%` : "50% 50%",
            }}
          >
            <svg viewBox={GERMANY_MAP_VIEWBOX} className="absolute inset-0 h-full w-full" aria-hidden>
              {GERMANY_MAP_PATHS.map((d, i) => (
                <path key={i} d={d} className="fill-brand-light stroke-brand/40" strokeWidth={7} />
              ))}
            </svg>

            {Object.entries(cityGroups).map(([city, unis]) => {
              const coords = CITY_COORDS[city];
              if (!coords) return null;
              const [x, y] = coords;
              const active = unis.some(matchesFilter);
              const hasExcellence = unis.some((u) => u.badges.includes("excellence"));
              const isSelected = selected === city;
              const isExploded = zoomedCity === city && unis.length > 1;

              if (isExploded) {
                const offsets = spiderfyOffsets(unis.length);
                return unis.map((uni, i) => {
                  const [dx, dy] = offsets[i];
                  return (
                    <Link
                      key={uni.slug}
                      href={`/universities/${uni.slug}`}
                      title={uni.name}
                      className={`group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-out hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                        matchesFilter(uni) ? "opacity-100" : "opacity-30 grayscale"
                      }`}
                      style={{ left: `${x + dx}%`, top: `${y + dy}%`, width: 9, height: 9 }}
                    >
                      <span
                        className={`absolute inset-0 rounded-full bg-brand shadow-sm ${
                          uni.badges.includes("excellence") ? "ring-2 ring-accent" : ""
                        }`}
                      />
                    </Link>
                  );
                });
              }

              const size = 16 + Math.min(unis.length, 4) * 6;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCityClick(city)}
                  title={unis.map((u) => u.name).join(", ")}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                    active ? "opacity-100" : "opacity-30 grayscale"
                  } ${isSelected ? "scale-125" : "hover:scale-125"}`}
                  style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
                >
                  <span
                    className={`absolute inset-0 rounded-full bg-brand shadow-sm ${
                      isSelected ? "ring-4 ring-brand/30" : ""
                    } ${hasExcellence ? "ring-2 ring-accent" : ""}`}
                  />
                  {unis.length > 1 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                      {unis.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {zoomedCity && (
            <button
              type="button"
              onClick={() => setZoomedCity(null)}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur transition-all duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <X size={13} />
              {labels.zoomOut}
            </button>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedItems.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-foreground-muted">
                {selectedItems[0].city}
              </h3>
              <ul className="mt-4 space-y-4">
                {selectedItems.map((uni) => (
                  <li key={uni.slug}>
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="group flex items-start justify-between gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand"
                    >
                      <span>
                        {uni.name}
                        <span className="mt-1 block text-xs font-normal text-foreground-muted">
                          {uni.type}
                          {uni.badges.includes("tu9") ? " · TU9" : ""}
                          {uni.badges.includes("excellence")
                            ? locale === "tr"
                              ? " · Exzellenzuniversität"
                              : " · Excellence University"
                            : ""}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={15}
                        className="mt-0.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border-strong p-6 text-center text-sm text-foreground-muted">
              {labels.emptyState}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
