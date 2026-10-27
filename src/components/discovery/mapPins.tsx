import type { TuitionStatus } from "@/lib/discovery/types";

/** What the directory map needs per university. Kept free of Leaflet so the legend and list can import it. */
export type MapItem = { slug: string; name: string; city: string; lat: number; lng: number; fee: TuitionStatus };

/** Pin colour and glyph per non-EU tuition status; the glyph tells the statuses apart without relying on colour. */
const PIN_STYLE: Record<TuitionStatus, { color: string; glyph: string | null }> = {
  none: { color: "var(--forest)", glyph: null },
  charged: { color: "var(--clay)", glyph: "€" },
  varies: { color: "var(--accent)", glyph: "~" },
  unknown: { color: "var(--foreground-muted)", glyph: "?" },
};

const PIN_PATH = "M14 1.5C7.1 1.5 1.5 7 1.5 13.8c0 8.6 10.6 18.7 11.6 19.6.5.5 1.3.5 1.8 0 1-.9 11.6-11 11.6-19.6C26.5 7 20.9 1.5 14 1.5z";

/** The pin as an SVG string, for Leaflet's div icons and the legend alike. */
export function pinSvg(status: TuitionStatus) {
  const { color, glyph } = PIN_STYLE[status];
  const mark = glyph
    ? `<text x="14" y="18.3" text-anchor="middle" font-size="12.5" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">${glyph}</text>`
    : `<circle cx="14" cy="13.6" r="4.4" fill="#fff"/>`;
  return `<svg viewBox="0 0 28 36" aria-hidden="true" focusable="false"><path d="${PIN_PATH}" style="fill:${color}" stroke="#fff" stroke-width="2"/>${mark}</svg>`;
}

export function FeePin({ status, className = "" }: { status: TuitionStatus; className?: string }) {
  return <span aria-hidden className={`fee-pin inline-block ${className}`} dangerouslySetInnerHTML={{ __html: pinSvg(status) }} />;
}
