import { readFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export const DESKTOP = { width: 1440, height: 900 };
export const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
export const TABLET = { viewport: { width: 834, height: 1112 }, hasTouch: true, isMobile: true };

const readJson = (file: string) => JSON.parse(readFileSync(path.join(process.cwd(), file), "utf8"));

type Facts = {
  slug: string;
  state: string | null;
  ownership: string | null;
  nonEuTuition: { status: string };
  semesterContribution: { amountEur: number | null };
  uniAssistMember: boolean | null;
  englishTaught: boolean | null;
  subjectAreas: string[] | null;
};
export type University = { slug: string; type: string; badges: string[]; facts: Facts | null };

/** The directory's universities straight from the data files, independent of the app's own filter code. */
export function universities(): University[] {
  const facts = Object.values(readJson("src/data/university-facts.json").records as Record<string, Facts>);
  const bySlug = new Map(facts.map((f) => [f.slug, f]));
  return (readJson("src/data/universities.json") as Omit<University, "facts">[]).map((u) => ({ ...u, facts: bySlug.get(u.slug) ?? null }));
}

/** discovery.* messages for a locale. */
export const messages = (locale: "tr" | "en") => readJson(`src/messages/discovery.${locale}.json`).discovery;

export const cards = (page: Page) => page.locator("#results > ul > li");

/** Accessibility scan; returns "rule (n)" entries so a failure names what broke. */
export async function axeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(" ")}`);
}

/** Horizontal overflow of the page in CSS pixels (0 when nothing sticks out). */
export const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** The highest Esri tile zoom level currently in the map. */
export const tileZoom = (page: Page) =>
  page.evaluate(() => Math.max(0, ...[...document.querySelectorAll<HTMLImageElement>("img.leaflet-tile")].map((i) => Number(i.src.match(/\/tile\/(\d+)\//)?.[1] ?? 0))));

/** A one-finger swipe through the Chrome DevTools protocol (Playwright's touchscreen only taps). */
export async function swipe(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [from] });
  for (let i = 1; i <= 10; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from.x + ((to.x - from.x) * i) / 10, y: from.y + ((to.y - from.y) * i) / 10 }] });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

/** Waits until the map has drawn its markers. */
export async function mapReady(page: Page, scope = "") {
  await expect(page.locator(`${scope} .leaflet-marker-icon`.trim()).first()).toBeVisible();
}
