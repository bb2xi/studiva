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
  tuitionFree?: boolean;
  competitiveness?: "low" | "medium" | "high";
};

// Markers render a 44x44px invisible hit area (the WCAG/Apple-recommended
// minimum touch target) with the actual visual badge — 34px with a logo,
// a plain 16px dot without one — centered inside it, so the on-map look
// stays small and uncluttered while mobile taps still land reliably.
const HIT_SIZE = 44;

function markerHtml(item: UniversityItem) {
  const logo = universityLogos[item.slug];
  const ring = item.badges.includes("excellence") ? "#a6782c" : "#ffffff";
  const inner = logo
    ? `<div style="width:34px;height:34px;border-radius:9999px;background:#ffffff;border:2.5px solid ${ring};box-shadow:0 1px 5px rgba(15,23,42,0.4);display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <img src="${logo.url}" alt="" style="width:78%;height:78%;object-fit:contain;" loading="lazy" />
    </div>`
    : `<div style="width:16px;height:16px;border-radius:9999px;background:#0068ff;border:2.5px solid ${ring === "#ffffff" ? "#ffffff" : ring};box-shadow:0 1px 4px rgba(15,23,42,0.4);"></div>`;
  return `<div style="width:${HIT_SIZE}px;height:${HIT_SIZE}px;display:flex;align-items:center;justify-content:center;">${inner}</div>`;
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
  const tags: string[] = [];
  if (item.tuitionFree) {
    tags.push(
      `<span style="display:inline-flex;align-items:center;border:1px solid color-mix(in srgb, var(--forest) 35%, transparent);color:var(--forest);border-radius:2px;padding:2px 6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">${locale === "tr" ? "Okul Ücreti Yok" : "No Tuition Fee"}</span>`
    );
  }
  if (item.competitiveness === "high") {
    tags.push(
      `<span style="display:inline-flex;align-items:center;border:1px solid color-mix(in srgb, var(--clay) 35%, transparent);color:var(--clay-dark);border-radius:2px;padding:2px 6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">${locale === "tr" ? "Yüksek Rekabet" : "High Competition"}</span>`
    );
  }
  const viewLabel = locale === "tr" ? "Detayları Gör" : "View Details";
  // Colors reference the site's own CSS custom properties (not hardcoded
  // hex) so the popup's text stays readable against its wrapper once that
  // wrapper is themed to --surface in dark mode too.
  return `<div style="min-width:190px;font-family:inherit;">
    ${logoImg}
    <div style="font-weight:600;font-size:13px;color:var(--foreground);line-height:1.3;">${item.name}</div>
    <div style="margin-top:2px;font-size:11px;color:var(--foreground-muted);">${item.city} · ${badgeRow}</div>
    ${tags.length ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">${tags.join("")}</div>` : ""}
    <a href="/${locale}/universities/${item.slug}" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:var(--brand);text-decoration:none;">${viewLabel} →</a>
  </div>`;
}

// The mask's outer ring. Needs to cover whatever the widest real viewport
// ever shows — at the default zoom, `fitBounds` picks a scale that fits
// Germany's bbox height into the (usually much wider than tall) map
// container, which overflows well past the bbox horizontally on wide
// screens. A margin that only just cleared the bbox left gaps at the
// edges on wide viewports (raw, unmasked neighboring-country tiles). 20°
// lat / 28° lng comfortably covers that on any realistic screen while
// staying far smaller than a world-spanning rectangle, which is what
// caused a separate, since-fixed precision issue at high zoom.
const WORLD_RING: [number, number][] = [
  [GERMANY_BBOX.maxLat + 20, GERMANY_BBOX.minLng - 28],
  [GERMANY_BBOX.maxLat + 20, GERMANY_BBOX.maxLng + 28],
  [GERMANY_BBOX.minLat - 20, GERMANY_BBOX.maxLng + 28],
  [GERMANY_BBOX.minLat - 20, GERMANY_BBOX.minLng - 28],
];

export default function GermanyMap({
  items,
  locale,
  hint,
  zoomHint,
  emptyMessage,
  focusSlug,
  focusToken,
}: {
  items: UniversityItem[];
  locale: string;
  hint: string;
  zoomHint: string;
  emptyMessage?: string;
  /** Slug to pan/zoom to and open the popup for — paired with focusToken so
   * the same slug can be re-triggered (e.g. clicking the same list card
   * twice in a row still re-centers the map). Set from the university list
   * below the map, so the two views stay connected. */
  focusSlug?: string | null;
  focusToken?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const relabelRef = useRef<(() => void) | null>(null);
  const localeRef = useRef(locale);
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
      // On touch screens a one-finger swipe must scroll the page, not pan the
      // map (otherwise the map is a scroll trap); pinch-zoom and the zoom
      // buttons still work.
      dragging: !window.matchMedia("(pointer: coarse)").matches,
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
        // Same enlarged-hit-area treatment as individual markers: the
        // visual bubble stays compact, the tappable area doesn't.
        return L.divIcon({
          html: `<div style="width:${HIT_SIZE}px;height:${HIT_SIZE}px;display:flex;align-items:center;justify-content:center;"><div style="width:${size}px;height:${size}px;border-radius:9999px;background:#0068ff;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 1px 6px rgba(15,23,42,0.5);border:2px solid #fff;">${count}</div></div>`,
          className: "",
          iconSize: L.point(HIT_SIZE, HIT_SIZE),
        });
      },
    });
    clusterRef.current = cluster;
    map.addLayer(cluster);

    // Cluster bubbles are Tab-reachable by default, which put dozens of map
    // stops between the filters and the result list. The list (with its
    // "show on map" action) is the keyboard route, so bubbles leave the Tab
    // order but keep a label for screen readers. The plugin's cluster icons
    // don't reliably fire a per-layer "layeradd", so this (re-)scans whatever
    // bubbles are in the DOM after each redraw.
    const labelClusterBubbles = () => {
      const icons = map.getContainer().querySelectorAll<HTMLElement>(".leaflet-marker-icon");
      icons.forEach((el) => {
        el.setAttribute("tabindex", "-1");
        const text = el.textContent?.trim() ?? "";
        if (!/^\d+$/.test(text)) return;
        el.setAttribute("role", "img");
        el.setAttribute(
          "aria-label",
          localeRef.current === "tr"
            ? `${text} üniversite`
            : `${text} universities`
        );
      });
    };
    cluster.on("animationend", labelClusterBubbles);
    map.on("moveend zoomend", labelClusterBubbles);
    relabelRef.current = labelClusterBubbles;

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
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;
    localeRef.current = locale;
    cluster.clearLayers();
    markersRef.current.clear();
    const markers = items.map((item) => {
      const ariaLabel = `${item.name}, ${item.city}`;
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({ html: markerHtml(item), className: "", iconSize: L.point(HIT_SIZE, HIT_SIZE) }),
        keyboard: false,
      });
      marker.bindPopup(popupHtml(item, locale));
      markersRef.current.set(item.slug, marker);
      // Markers stay out of the Tab order (keyboard: false): the result list
      // is the keyboard route to every university. The label still names the
      // marker for screen-reader users exploring the map.
      marker.on("add", () => {
        const el = marker.getElement();
        el?.setAttribute("role", "img");
        el?.setAttribute("aria-label", ariaLabel);
      });
      return marker;
    });
    cluster.addLayers(markers);
    requestAnimationFrame(() => relabelRef.current?.());

    if (items.length > 0) {
      const bounds = L.latLngBounds(items.map((i): [number, number] => [i.lat, i.lng]));
      map.fitBounds(bounds.pad(0.35), { animate: true, maxZoom: 11 });
    }
  }, [items, locale]);

  // Connects the university list below the map back to the map itself:
  // a card's "show on map" action sets focusSlug + bumps focusToken, and
  // this zooms/pans to that marker's cluster and opens its popup.
  // zoomToShowLayer is leaflet.markercluster's own helper for exactly this
  // — it handles de-clustering at whatever zoom level is actually needed.
  useEffect(() => {
    if (!focusSlug) return;
    const cluster = clusterRef.current;
    const marker = markersRef.current.get(focusSlug);
    if (!cluster || !marker) return;
    // Let the initial fit-to-results animation finish before zooming in.
    const timer = window.setTimeout(() => cluster.zoomToShowLayer(marker, () => marker.openPopup()), 450);
    return () => window.clearTimeout(timer);
  }, [focusSlug, focusToken]);

  return (
    <div>
      <p className="text-center text-xs text-foreground-muted">{hint}</p>

      <div className="relative mt-6">
        <div
          ref={containerRef}
          className="h-[480px] w-full overflow-hidden rounded-sm border border-border shadow-soft sm:h-[560px] lg:h-[640px]"
        />
        {!scrollZoomActive && items.length > 0 && (
          // Two layers on purpose: the outer box is positioned with both
          // left and right insets (inset-x-3) so its width is a plain,
          // unambiguous subtraction — no shrink-to-fit, no transform — and
          // just centers the inner pill via flexbox. The inner pill is what
          // actually carries the dark background/padding and shrink-wraps
          // within that safe, fully-resolved width.
          // z-[460]: the mask canvas sits at 450 (above Leaflet's own
          // 400-level map pane) — at z-400 this pill sat BELOW that canvas,
          // so Germany's border stroke was painting right through its text
          // wherever the coastline happened to cross under it.
          <div className="pointer-events-none absolute inset-x-3 top-3 z-[460] flex justify-center">
            <div className="max-w-full rounded-xl bg-slate-950/95 px-4 py-2 shadow-sm backdrop-blur">
              <span className="flex items-start gap-1.5">
                <MousePointerClick size={13} className="mt-0.5 shrink-0" />
                <span className="break-words text-left text-xs font-medium leading-snug text-white">{zoomHint}</span>
              </span>
            </div>
          </div>
        )}
        {items.length === 0 && emptyMessage && (
          <div className="pointer-events-none absolute inset-0 z-[460] flex items-center justify-center p-6">
            <p className="max-w-xs rounded-sm bg-slate-950/85 px-5 py-3 text-center text-sm font-medium text-white shadow-sm backdrop-blur">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
