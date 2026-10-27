"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import L from "leaflet";
import "leaflet.markercluster";
import { GERMANY_BORDER_PARTS, GERMANY_BBOX } from "@/lib/germanyBorder";
import { pinSvg, type MapItem } from "@/components/discovery/mapPins";

/** A div icon that names itself for screen readers every time Leaflet (re)creates its element. */
class NamedIcon extends L.DivIcon {
  label: string;
  constructor(label: string, options: L.DivIconOptions) {
    super(options);
    this.label = label;
  }
  createIcon(oldIcon?: HTMLElement) {
    const el = super.createIcon(oldIcon);
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", this.label);
    return el;
  }
}

// Cluster bubbles would otherwise each be a Tab stop with role="button"; the
// list views are the keyboard route to every university.
(L.MarkerCluster.prototype.options as L.MarkerOptions).keyboard = false;

const GERMANY = L.latLngBounds([GERMANY_BBOX.minLat, GERMANY_BBOX.minLng], [GERMANY_BBOX.maxLat, GERMANY_BBOX.maxLng]);

// The mask's outer ring: well past anything a viewport shows at the lowest zoom,
// yet far smaller than a world-spanning rectangle (which lost precision at high zoom).
const WORLD_RING: [number, number][] = [
  [GERMANY_BBOX.maxLat + 20, GERMANY_BBOX.minLng - 28],
  [GERMANY_BBOX.maxLat + 20, GERMANY_BBOX.maxLng + 28],
  [GERMANY_BBOX.minLat - 20, GERMANY_BBOX.maxLng + 28],
  [GERMANY_BBOX.minLat - 20, GERMANY_BBOX.minLng - 28],
];

// Esri's light/dark grey canvas, base plus its place-name layer. Attribution
// ("Powered by Esri" plus the service's copyright text) comes from the messages.
const esriTiles = (layer: string) => `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${layer}/MapServer/tile/{z}/{y}/{x}`;

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type PinState = "" | "is-highlighted" | "is-selected";

type MapApi = {
  setItems: () => void;
  restyle: () => void;
  focusSelected: () => void;
  revealSelected: () => void;
  setInsetTop: () => void;
};

export default function GermanyMap({
  items,
  selected,
  highlighted = null,
  onSelect,
  touchDrag = false,
  insetTop = 0,
  insetBottom = 0,
  className = "",
  children,
}: {
  items: MapItem[];
  selected: string | null;
  highlighted?: string | null;
  onSelect: (slug: string | null) => void;
  /** One-finger panning. Only where the page itself doesn't scroll (the full-screen phone map); elsewhere a
   * one-finger swipe scrolls the page and two fingers move the map. */
  touchDrag?: boolean;
  /** Height of overlays along the top and bottom edges, kept clear when fitting and revealing markers. */
  insetTop?: number;
  insetBottom?: number;
  className?: string;
  /** Overlays drawn over the map (selected card, toolbars); they can use --map-attribution-h to stay clear of the attribution. */
  children?: React.ReactNode;
}) {
  const t = useTranslations("discovery");
  const descriptionId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const api = useRef<MapApi | null>(null);
  // Set when the user moves the map (or a university is brought into view): resizes stop re-fitting then.
  const userMoved = useRef(false);
  // The last selection made on the map itself, which needs no zooming to.
  const emitted = useRef<string | null>(null);
  const [hint, setHint] = useState<"wheel" | "touch" | null>(null);
  const latest = useRef({ items, selected, highlighted, onSelect, insetTop, insetBottom, t });
  useEffect(() => {
    latest.current = { items, selected, highlighted, onSelect, insetTop, insetBottom, t };
  });

  useEffect(() => {
    const container = containerRef.current!;
    const wrapper = wrapperRef.current!;
    const tr = () => latest.current.t;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const map = L.map(container, {
      center: [51.16, 10.45],
      zoom: 6,
      minZoom: 5,
      maxZoom: 13,
      zoomSnap: 0.25,
      zoomControl: false,
      attributionControl: false,
      dragging: touchDrag || !coarse,
      // Only Ctrl/⌘ + wheel reaches Leaflet (see onWheel); a plain wheel scrolls the page.
      scrollWheelZoom: true,
      maxBounds: GERMANY.pad(0.35),
      maxBoundsViscosity: 1,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
    });
    L.control.zoom({ position: "topright", zoomInTitle: tr()("map.zoomIn"), zoomOutTitle: tr()("map.zoomOut") }).addTo(map);
    const attribution = L.control.attribution({ prefix: '<a href="https://leafletjs.com">Leaflet</a>' }).addTo(map);

    // The map is one Tab stop: arrow keys pan and +/− zoom once it has focus, so its
    // own buttons and links stay out of the Tab order.
    const untab = () => container.querySelectorAll<HTMLElement>(".leaflet-control a").forEach((a) => a.setAttribute("tabindex", "-1"));
    const measureAttribution = () => wrapper.style.setProperty("--map-attribution-h", `${attribution.getContainer()?.offsetHeight ?? 0}px`);

    let tiles: L.TileLayer[] = [];
    const setTiles = () => {
      tiles.forEach((layer) => layer.remove());
      const shade = darkScheme.matches ? "Dark" : "Light";
      tiles = [`World_${shade}_Gray_Base`, `World_${shade}_Gray_Reference`].map((layer, i) =>
        L.tileLayer(esriTiles(layer), { maxZoom: 13, maxNativeZoom: 16, attribution: i === 0 ? (tr().raw("map.attribution") as string) : undefined }).addTo(map)
      );
      untab();
      measureAttribution();
    };

    // Everything outside Germany's border is painted over with the page
    // background, and the border is stroked on top. The canvas sits in its own
    // pane above the tiles but below the markers, so pins near the border are
    // never cut. It is drawn by hand: Leaflet's vector renderers dropped parts
    // of this 77-part outline at high zoom.
    const colors = { fill: "", stroke: "" };
    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      colors.fill = style.getPropertyValue("--background").trim();
      colors.stroke = style.getPropertyValue("--brand").trim();
    };
    const maskPane = map.createPane("germanyMask");
    maskPane.style.zIndex = "450";
    maskPane.style.pointerEvents = "none";
    const canvas = L.DomUtil.create("canvas", "leaflet-zoom-animated", maskPane);
    const ctx = canvas.getContext("2d")!;
    let drawnBounds: L.LatLngBounds | null = null;
    const trace = (ring: [number, number][]) => {
      ring.forEach(([lat, lng], i) => {
        const pt = map.latLngToContainerPoint([lat, lng]);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
    };
    const drawMask = () => {
      const size = map.getSize();
      if (!size.x || !size.y) return;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(size.x * dpr) || canvas.height !== Math.round(size.y * dpr)) {
        canvas.width = Math.round(size.x * dpr);
        canvas.height = Math.round(size.y * dpr);
        canvas.style.width = `${size.x}px`;
        canvas.style.height = `${size.y}px`;
      }
      L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size.x, size.y);
      ctx.beginPath();
      trace(WORLD_RING);
      for (const part of GERMANY_BORDER_PARTS) for (const ring of part) trace(ring);
      ctx.fillStyle = colors.fill;
      ctx.fill("evenodd");
      ctx.beginPath();
      for (const part of GERMANY_BORDER_PARTS) for (const ring of part) trace(ring);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;
      drawnBounds = map.getBounds();
    };
    let frame = 0;
    const scheduleMask = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        drawMask();
      });
    };
    // Scale the last drawing along with the tiles while a zoom animates, as Leaflet's own overlays do.
    const animateMask = (e: L.ZoomAnimEvent) => {
      if (!drawnBounds) return;
      const internal = map as unknown as { _latLngBoundsToNewLayerBounds(b: L.LatLngBounds, zoom: number, center: L.LatLng): L.Bounds };
      L.DomUtil.setTransform(canvas, internal._latLngBoundsToNewLayerBounds(drawnBounds, e.zoom, e.center).min!, map.getZoomScale(e.zoom));
    };
    map.on("move", scheduleMask);
    map.on("moveend zoomend resize viewreset", drawMask);
    map.on("zoomanim", animateMask);

    const markers = new Map<string, { marker: L.Marker; item: MapItem }>();
    const itemOf = new WeakMap<L.Layer, MapItem>();
    const pinIcon = (item: MapItem, state: PinState) =>
      new NamedIcon(tr()("map.marker", { name: item.name, city: item.city, fee: tr()(`table.fee.${item.fee}`) }), {
        html: pinSvg(item.fee),
        className: `uni-pin ${state}`,
        iconSize: [44, 44],
        iconAnchor: [22, 42],
      });
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 48,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      animate: !reduced,
      // Universities in one city read "Berlin (5)"; mixed clusters show the count.
      iconCreateFunction: (group) => {
        const count = group.getChildCount();
        const cities = new Set(group.getAllChildMarkers().map((m) => itemOf.get(m)?.city));
        const city = cities.size === 1 ? [...cities][0] : undefined;
        return city
          ? new NamedIcon(tr()("map.clusterCity", { city, count }), {
              html: `<span>${escapeHtml(tr()("map.clusterCityText", { city, count }))}</span>`,
              className: "uni-cluster uni-cluster--city",
              iconSize: [0, 0],
            })
          : new NamedIcon(tr()("map.cluster", { count }), { html: `<span>${count}</span>`, className: "uni-cluster uni-cluster--count", iconSize: [0, 0] });
      },
    });
    map.addLayer(cluster);

    const fit = () => {
      const size = map.getSize();
      if (!size.x || !size.y) return;
      const { items, insetTop } = latest.current;
      const bounds = items.length ? L.latLngBounds(items.map((i): [number, number] => [i.lat, i.lng])) : GERMANY;
      // Room for a pin's height above its point and a city label's half-width to the sides.
      map.fitBounds(bounds, { paddingTopLeft: [56, 52 + insetTop], paddingBottomRight: [56, 28], maxZoom: 11, animate: false });
    };

    // Pan just enough that a marker isn't hidden under the overlays.
    const reveal = (marker: L.Marker) => {
      const size = map.getSize();
      const { insetTop, insetBottom } = latest.current;
      const point = map.latLngToContainerPoint(marker.getLatLng());
      const minY = insetTop + 48;
      const maxY = size.y - insetBottom - 12;
      const dy = point.y > maxY ? point.y - maxY : point.y < minY ? point.y - minY : 0;
      if (dy) map.panBy([0, dy], { animate: !reduced });
    };

    let styled: { selected: string | null; highlighted: string | null; bubble: HTMLElement | null } = { selected: null, highlighted: null, bubble: null };
    const restyle = () => {
      const { selected, highlighted } = latest.current;
      for (const slug of new Set([styled.selected, styled.highlighted, selected, highlighted])) {
        const entry = slug ? markers.get(slug) : undefined;
        if (!entry) continue;
        const state: PinState = slug === selected ? "is-selected" : slug === highlighted ? "is-highlighted" : "";
        entry.marker.setIcon(pinIcon(entry.item, state));
        entry.marker.setZIndexOffset(state ? 1000 : 0);
      }
      // A highlighted university that sits inside a cluster lights up the cluster instead.
      styled.bubble?.classList.remove("is-highlighted");
      let bubble: HTMLElement | null = null;
      const target = highlighted ? markers.get(highlighted)?.marker : undefined;
      const parent = target ? (cluster.getVisibleParent(target) as L.Marker | null) : null;
      if (parent && parent !== target) {
        bubble = parent.getElement() ?? null;
        bubble?.classList.add("is-highlighted");
      }
      styled = { selected, highlighted, bubble };
    };

    let pendingFocus = false;
    const focusSelected = () => {
      const entry = latest.current.selected ? markers.get(latest.current.selected) : undefined;
      if (!entry) return;
      const size = map.getSize();
      if (!size.x || !size.y) {
        pendingFocus = true;
        return;
      }
      userMoved.current = true;
      cluster.zoomToShowLayer(entry.marker, () => reveal(entry.marker));
    };

    api.current = {
      setItems: () => {
        cluster.clearLayers();
        markers.clear();
        styled = { selected: null, highlighted: null, bubble: null };
        cluster.addLayers(
          latest.current.items.map((item) => {
            const marker = L.marker([item.lat, item.lng], { icon: pinIcon(item, ""), keyboard: false });
            marker.on("click", () => {
              emitted.current = item.slug;
              latest.current.onSelect(item.slug);
            });
            markers.set(item.slug, { marker, item });
            itemOf.set(marker, item);
            return marker;
          })
        );
        userMoved.current = false;
        fit();
        restyle();
      },
      restyle,
      focusSelected,
      revealSelected: () => {
        const entry = latest.current.selected ? markers.get(latest.current.selected) : undefined;
        if (entry?.marker.getElement()) reveal(entry.marker);
      },
      setInsetTop: () => {
        for (const el of container.querySelectorAll<HTMLElement>(".leaflet-top")) el.style.top = `${latest.current.insetTop}px`;
        if (!userMoved.current) fit();
      },
    };

    map.on("click", () => {
      if (!latest.current.selected) return;
      emitted.current = null;
      latest.current.onSelect(null);
    });

    // A plain wheel over the map scrolls the page and shows how to zoom instead.
    let hintTimer = 0;
    const flash = (kind: "wheel" | "touch") => {
      setHint(kind);
      window.clearTimeout(hintTimer);
      hintTimer = window.setTimeout(() => setHint(null), 1600);
    };
    const onWheel = (e: WheelEvent) => {
      if (!container.contains(e.target as Node)) return;
      if (e.ctrlKey || e.metaKey) {
        userMoved.current = true;
        return;
      }
      e.stopPropagation();
      flash("wheel");
    };
    let touchStart: { x: number; y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        userMoved.current = true;
        touchStart = null;
      } else touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart || map.dragging.enabled() || e.touches.length !== 1) return;
      if (Math.hypot(e.touches[0].clientX - touchStart.x, e.touches[0].clientY - touchStart.y) > 12) {
        touchStart = null;
        flash("touch");
      }
    };
    const onUserMove = () => {
      userMoved.current = true;
    };
    wrapper.addEventListener("wheel", onWheel, { capture: true, passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("keydown", onUserMove);
    container.querySelector(".leaflet-control-zoom")?.addEventListener("click", onUserMove);
    map.on("dragstart", onUserMove);

    const onScheme = () => {
      readColors();
      setTiles();
      drawMask();
    };
    darkScheme.addEventListener("change", onScheme);
    readColors();
    setTiles();
    drawMask();

    // Re-fit when the box changes size (window resize, the phone dialog opening) unless the user has moved the map.
    const resize = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
      measureAttribution();
      if (!userMoved.current) fit();
      if (pendingFocus) {
        pendingFocus = false;
        focusSelected();
      }
    });
    resize.observe(container);

    return () => {
      resize.disconnect();
      darkScheme.removeEventListener("change", onScheme);
      wrapper.removeEventListener("wheel", onWheel, { capture: true });
      window.clearTimeout(hintTimer);
      if (frame) cancelAnimationFrame(frame);
      api.current = null;
      map.remove();
    };
  }, [touchDrag]);

  useEffect(() => {
    api.current?.setItems();
  }, [items]);

  useEffect(() => {
    const map = api.current;
    if (!map) return;
    if (!selected) emitted.current = null;
    else if (selected === emitted.current) map.revealSelected();
    else map.focusSelected();
    map.restyle();
  }, [selected]);

  useEffect(() => {
    api.current?.restyle();
  }, [highlighted]);

  useEffect(() => {
    api.current?.revealSelected();
  }, [insetBottom]);

  useEffect(() => {
    api.current?.setInsetTop();
  }, [insetTop]);

  const modKey = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl";

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div
        ref={containerRef}
        role="region"
        aria-label={t("map.title")}
        aria-describedby={descriptionId}
        className="isolate h-full w-full bg-background focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
      />
      <p id={descriptionId} className="sr-only">
        {t("map.description")}
      </p>
      {hint && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6">
          <p className="max-w-xs rounded-sm bg-black/75 px-4 py-2.5 text-center text-sm font-medium text-white">
            {hint === "wheel" ? t("map.wheelHint", { key: modKey }) : t("map.touchHint")}
          </p>
        </div>
      )}
      {items.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
          <p className="max-w-xs rounded-sm bg-surface px-5 py-3 text-center text-sm font-medium text-foreground shadow-md">{t("directory.noResultsTitle")}</p>
        </div>
      )}
      {children}
    </div>
  );
}
