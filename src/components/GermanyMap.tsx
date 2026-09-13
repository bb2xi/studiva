"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";
import { universityLogos } from "@/lib/universityMedia";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  lat: number;
  lng: number;
};

type FilterKey = "all" | "tu9" | "excellence" | "hochschule";

function matchesFilter(item: UniversityItem, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "tu9") return item.badges.includes("tu9");
  if (filter === "excellence") return item.badges.includes("excellence");
  return item.type !== "Universität";
}

function markerHtml(item: UniversityItem) {
  const logo = universityLogos[item.slug];
  const ring = item.badges.includes("excellence") ? "#f59e0b" : "#ffffff";
  if (logo) {
    return `<div style="width:34px;height:34px;border-radius:9999px;background:#ffffff;border:2.5px solid ${ring};box-shadow:0 1px 5px rgba(15,23,42,0.4);display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <img src="${logo.url}" style="width:78%;height:78%;object-fit:contain;" loading="lazy" />
    </div>`;
  }
  return `<div style="width:16px;height:16px;border-radius:9999px;background:#0068ff;border:2.5px solid ${ring === "#ffffff" ? "#ffffff" : ring};box-shadow:0 1px 4px rgba(15,23,42,0.4);"></div>`;
}

function popupHtml(item: UniversityItem, locale: string) {
  const logo = universityLogos[item.slug];
  const badgeRow = [
    item.type,
    item.badges.includes("tu9") ? "TU9" : "",
    item.badges.includes("excellence") ? (locale === "tr" ? "Exzellenzuniversität" : "Excellence University") : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const logoImg = logo
    ? `<img src="${logo.url}" alt="" style="max-width:100%;max-height:56px;object-fit:contain;margin-bottom:8px;" />`
    : "";
  const viewLabel = locale === "tr" ? "Detayları Gör" : "View Details";
  return `<div style="min-width:180px;font-family:inherit;">
    ${logoImg}
    <div style="font-weight:600;font-size:13px;color:#0f172a;line-height:1.3;">${item.name}</div>
    <div style="margin-top:2px;font-size:11px;color:#64748b;">${item.city} · ${badgeRow}</div>
    <a href="/${locale}/universities/${item.slug}" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:#0068ff;text-decoration:none;">${viewLabel} →</a>
  </div>`;
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
  };
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [51.1657, 10.4515],
      zoom: 6,
      minZoom: 5,
      maxZoom: 17,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 17,
      }
    ).addTo(map);

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (c) => {
        const count = c.getChildCount();
        const size = count > 9 ? 42 : 34;
        return L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:#0068ff;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 1px 6px rgba(15,23,42,0.5);border:2px solid #fff;">${count}</div>`,
          className: "",
          iconSize: L.point(size, size),
        });
      },
    });
    clusterRef.current = cluster;
    map.addLayer(cluster);

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    const markers = items
      .filter((item) => matchesFilter(item, filter))
      .map((item) => {
        const marker = L.marker([item.lat, item.lng], {
          icon: L.divIcon({ html: markerHtml(item), className: "", iconSize: L.point(34, 34) }),
        });
        marker.bindPopup(popupHtml(item, locale));
        return marker;
      });
    cluster.addLayers(markers);
  }, [items, filter, locale]);

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

      <div
        ref={containerRef}
        className="mt-6 h-[480px] w-full overflow-hidden rounded-2xl border border-border shadow-sm sm:h-[560px] lg:h-[640px]"
      />
    </div>
  );
}
