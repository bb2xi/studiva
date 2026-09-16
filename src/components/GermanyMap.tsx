"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";
import { MousePointerClick } from "lucide-react";
import { universityLogos } from "@/lib/universityMedia";
import { GERMANY_BORDER_PARTS, GERMANY_BBOX } from "@/lib/germanyBorder";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  lat: number;
  lng: number;
};

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

// The mask's outer ring, padded just past the map's maxBounds (bbox +1.2/+1.8).
// Kept close to Germany rather than spanning the whole world: at high zoom, a
// polygon ring with vertices millions of pixels from the viewport can exceed
// the coordinate precision browsers use for SVG path fills, producing random
// unmasked gaps near complex borders (observed at the Berchtesgaden panhandle).
const WORLD_RING: [number, number][] = [
  [GERMANY_BBOX.maxLat + 4, GERMANY_BBOX.minLng - 4],
  [GERMANY_BBOX.maxLat + 4, GERMANY_BBOX.maxLng + 4],
  [GERMANY_BBOX.minLat - 4, GERMANY_BBOX.maxLng + 4],
  [GERMANY_BBOX.minLat - 4, GERMANY_BBOX.minLng - 4],
];

export default function GermanyMap({
  items,
  locale,
  hint,
  zoomHint,
}: {
  items: UniversityItem[];
  locale: string;
  hint: string;
  zoomHint: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const [scrollZoomActive, setScrollZoomActive] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const bgColor =
      getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff";
    const bounds = L.latLngBounds(
      [GERMANY_BBOX.minLat - 1.2, GERMANY_BBOX.minLng - 1.8],
      [GERMANY_BBOX.maxLat + 1.2, GERMANY_BBOX.maxLng + 1.8]
    );

    const map = L.map(containerRef.current, {
      center: [51.1657, 10.4515],
      zoom: 6,
      minZoom: 6,
      maxZoom: 13,
      scrollWheelZoom: false,
      maxBounds: bounds.pad(0.15),
      maxBoundsViscosity: 1,
    });
    mapRef.current = map;
    map.fitBounds(bounds, { animate: false });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 13,
      }
    ).addTo(map);

    // Mask everything outside Germany's real border with the page background,
    // plus a crisp outline on top, drawn on a plain <canvas> we manage
    // ourselves rather than as a Leaflet vector layer. Germany's border here
    // is 77 parts / tens of thousands of points, and Leaflet's own Path
    // renderers (both SVG and Canvas) reliably dropped fill in parts of that
    // shape at high zoom — e.g. leaving a chunk of Austria unmasked at the
    // Berchtesgaden Alpine panhandle, reproducible regardless of data
    // resolution or renderer choice. Drawing directly with the 2D canvas API
    // using container-relative points (recomputed fresh every redraw, so
    // there's no persistent internal clip cache to go stale) sidesteps
    // whatever internal clipping/path-building step was misbehaving.
    const maskCanvas = document.createElement("canvas");
    maskCanvas.style.position = "absolute";
    maskCanvas.style.top = "0";
    maskCanvas.style.left = "0";
    // Leaflet's own ".leaflet-map-pane" (holding the tile layer) sits at
    // z-index 400, so this needs to clear that or the tiles paint over it.
    maskCanvas.style.zIndex = "450";
    maskCanvas.style.pointerEvents = "none";
    map.getContainer().appendChild(maskCanvas);
    const ctx = maskCanvas.getContext("2d")!;

    const tracePath = (ring: [number, number][]) => {
      ring.forEach(([lat, lng], i) => {
        const pt = map.latLngToContainerPoint([lat, lng]);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
    };

    const redrawMask = () => {
      const size = map.getSize();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(size.x * dpr);
      const h = Math.round(size.y * dpr);
      if (maskCanvas.width !== w || maskCanvas.height !== h) {
        maskCanvas.width = w;
        maskCanvas.height = h;
        maskCanvas.style.width = `${size.x}px`;
        maskCanvas.style.height = `${size.y}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size.x, size.y);

      ctx.beginPath();
      tracePath(WORLD_RING);
      for (const part of GERMANY_BORDER_PARTS) for (const ring of part) tracePath(ring);
      ctx.fillStyle = bgColor;
      ctx.fill("evenodd");

      ctx.beginPath();
      for (const part of GERMANY_BORDER_PARTS) for (const ring of part) tracePath(ring);
      ctx.strokeStyle = "#0068ff";
      ctx.lineWidth = 1.75;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    let redrawFrame: number | null = null;
    const scheduleRedraw = () => {
      if (redrawFrame !== null) return;
      redrawFrame = requestAnimationFrame(() => {
        redrawFrame = null;
        redrawMask();
      });
    };
    redrawMask();
    map.on("move zoom resize", scheduleRedraw);
    map.on("moveend zoomend", redrawMask);

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

    const activateScrollZoom = () => {
      map.scrollWheelZoom.enable();
      setScrollZoomActive(true);
    };
    map.once("click", activateScrollZoom);
    map.once("dragstart", activateScrollZoom);

    return () => {
      if (redrawFrame !== null) cancelAnimationFrame(redrawFrame);
      map.remove();
      maskCanvas.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    const markers = items.map((item) => {
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({ html: markerHtml(item), className: "", iconSize: L.point(34, 34) }),
      });
      marker.bindPopup(popupHtml(item, locale));
      return marker;
    });
    cluster.addLayers(markers);
  }, [items, locale]);

  return (
    <div>
      <p className="text-center text-xs text-foreground-muted">{hint}</p>

      <div className="relative mt-6">
        <div
          ref={containerRef}
          className="h-[480px] w-full overflow-hidden rounded-2xl border border-border shadow-soft sm:h-[560px] lg:h-[640px]"
        />
        {!scrollZoomActive && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-[400] -translate-x-1/2 rounded-full bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur">
            <span className="flex items-center gap-1.5">
              <MousePointerClick size={13} />
              {zoomHint}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
