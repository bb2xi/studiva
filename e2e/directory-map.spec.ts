import { expect, test } from "@playwright/test";
import { DESKTOP, PHONE, TABLET, cards, mapReady, messages, swipe, tileZoom } from "./helpers";

const m = messages("tr");
const list = (page: import("@playwright/test").Page) => page.getByRole("list", { name: m.map.listLabel });

test.describe("map on desktop (split view)", () => {
  test.use({ viewport: DESKTOP });

  test("opens beside a scrolling list and fills the screen under the toolbar", async ({ page }) => {
    await page.goto("/tr/universities");
    await page.getByRole("button", { name: m.directory.viewMap, exact: true }).click();
    await mapReady(page);
    const box = await page.evaluate(() => {
      const listBox = document.querySelector("#results ul")!.getBoundingClientRect();
      const mapBox = document.querySelector(".leaflet-container")!.getBoundingClientRect();
      return { listX: listBox.x, mapX: mapBox.x, top: mapBox.top, bottom: mapBox.bottom, vh: innerHeight };
    });
    expect(box.listX).toBeLessThan(box.mapX);
    expect(box.bottom).toBeLessThanOrEqual(box.vh);
    expect(box.bottom - box.top).toBeGreaterThan(600);
  });

  test("is one Tab stop with a name, a description, localised zoom buttons and the Esri credit", async ({ page }) => {
    await page.goto("/tr/universities?view=map");
    await mapReady(page);
    const map = page.getByRole("region", { name: m.map.title });
    await expect(map).toHaveAttribute("aria-describedby", /.+/);
    expect(await map.evaluate((el) => [...el.querySelectorAll<HTMLElement>("a[href], button, [tabindex]")].filter((x) => x.tabIndex >= 0).length)).toBe(0);
    expect(await map.evaluate((el) => (el as HTMLElement).tabIndex)).toBe(0);
    await expect(page.locator(".leaflet-control-zoom-in")).toHaveAttribute("title", m.map.zoomIn);
    await expect(page.locator(".leaflet-control-attribution")).toContainText("Powered by Esri");
    await expect(page.locator(".uni-cluster, .uni-pin").first()).toHaveAttribute("role", "img");
  });

  test("hovering a row lights its marker; a row click selects; Esc clears", async ({ page }) => {
    await page.goto("/tr/universities?view=map");
    await mapReady(page);
    const row = list(page).getByRole("button").first();
    await row.hover();
    await expect(page.locator(".uni-pin.is-highlighted, .uni-cluster.is-highlighted")).toHaveCount(1);
    const scrollY = await page.evaluate(() => window.scrollY);
    await row.click();
    const card = page.locator("[data-map-card]");
    await expect(card).toBeVisible();
    await expect(page).toHaveURL(/focus=/);
    await expect(page.locator(".uni-pin.is-selected")).toHaveCount(1);
    for (const action of [m.map.details, m.compareToggle.short, m.favorites.short]) await expect(card).toContainText(action);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await card.getByRole("button", { name: new RegExp(`^${m.favorites.short}: `) }).focus();
    await page.keyboard.press("Escape");
    await expect(card).toBeHidden();
    await expect(page).not.toHaveURL(/focus=/);
    await expect(page.getByRole("region", { name: m.map.title })).toBeFocused();
  });

  test("a marker click selects its row and scrolls the list, not the page", async ({ page }) => {
    // Opened from the toolbar, the map is lined up to fit the screen, so clicking a pin needs no scrolling.
    await page.goto("/tr/universities");
    await page.getByRole("button", { name: m.directory.viewMap, exact: true }).click();
    await mapReady(page);
    const scrollY = await page.evaluate(() => window.scrollY);
    const pin = page.locator(".uni-pin").last();
    await expect(pin).toBeInViewport();
    const label = (await pin.getAttribute("aria-label"))!;
    await pin.click({ force: true });
    const selected = list(page).locator('button[aria-pressed="true"]');
    await expect(selected).toBeInViewport();
    expect(label.startsWith((await selected.locator("span span").first().innerText()).trim())).toBe(true);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
  });

  test("a plain wheel scrolls the page and hints at Ctrl; Ctrl + wheel zooms", async ({ page }) => {
    await page.goto("/tr/universities?view=map");
    await mapReady(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    const box = (await page.locator(".leaflet-container").boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 100);
    await page.mouse.wheel(0, 200);
    await expect(page.getByText(m.map.wheelHint.replace("{key}", "Ctrl"))).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    const after = (await page.locator(".leaflet-container").boundingBox())!;
    await page.mouse.move(after.x + after.width / 2, after.y + after.height / 2);
    const before = await tileZoom(page);
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -400);
    await page.keyboard.up("Control");
    await expect.poll(() => tileZoom(page)).toBeGreaterThan(before);
  });

  test("show on map from a card selects that university and lines the map up under the toolbar", async ({ page }) => {
    await page.goto("/tr/universities");
    const card = cards(page).nth(1);
    const name = await card.locator("h3").innerText();
    await page.evaluate(() => window.scrollTo(0, 600));
    await card.getByRole("button", { name: m.card.showOnMapFor.replace("{name}", name) }).click();
    await expect(page.locator("[data-map-card] h3")).toHaveText(name);
    const resultsTop = await page.locator("#results").evaluate((el) => el.getBoundingClientRect().top);
    expect(resultsTop).toBeGreaterThanOrEqual(120);
    expect(resultsTop).toBeLessThanOrEqual(140);
  });

  test("filters narrow the map and stay in the URL", async ({ page }) => {
    await page.goto("/tr/universities?view=map");
    await mapReady(page);
    await expect(list(page).getByRole("listitem")).toHaveCount(82);
    await page.locator("#side-fee").getByText(m.directory.feeNone, { exact: true }).click();
    await expect(list(page).getByRole("listitem")).toHaveCount(61);
    await expect(page).toHaveURL(/fee=none/);
    await expect(page).toHaveURL(/view=map/);
  });

  test("dark mode uses the dark Esri canvas", async ({ page }) => {
    const urls: string[] = [];
    page.on("request", (r) => urls.push(r.url()));
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/en/universities?view=map");
    await mapReady(page);
    await expect.poll(() => urls.some((u) => u.includes("World_Dark_Gray_Base"))).toBe(true);
    expect(urls.some((u) => u.includes("World_Light_Gray"))).toBe(false);
  });
});

test.describe("map on a tablet", () => {
  test.use(TABLET);

  test("is a 70vh map and a one-finger swipe scrolls the page", async ({ page }) => {
    await page.goto("/tr/universities?view=map");
    await mapReady(page);
    const box = (await page.locator(".leaflet-container").boundingBox())!;
    expect(box.height).toBeGreaterThan(650);
    expect(box.height).toBeLessThan(790);
    await expect(list(page)).toHaveCount(0);
    await swipe(page, { x: box.x + box.width / 2, y: Math.min(box.y + box.height * 0.7, 1000) }, { x: box.x + box.width / 2, y: Math.min(box.y + box.height * 0.2, 500) });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.getByText(m.map.touchHint)).toBeVisible();
  });
});

test.describe("map on a phone", () => {
  test.use(PHONE);

  test("is a full-screen dialog over the list: one-finger panning, a bottom card, back to the same place", async ({ page }) => {
    await page.goto("/tr/universities");
    const card = cards(page).nth(4);
    await card.scrollIntoViewIfNeeded();
    const listScroll = await page.evaluate(() => window.scrollY);
    const name = await card.locator("h3").innerText();
    await card.getByRole("button", { name: m.card.showOnMapFor.replace("{name}", name) }).tap();

    const dialog = page.getByRole("dialog", { name: m.map.title });
    await mapReady(page, "dialog[open]");
    expect(await dialog.evaluate((d) => d.matches(":modal") && d.getBoundingClientRect().height === innerHeight)).toBe(true);
    const selected = dialog.locator("[data-map-card]");
    await expect(selected.locator("h3")).toHaveText(name);
    const geo = await dialog.evaluate((d) => {
      const cardBox = d.querySelector("[data-map-card]")!.getBoundingClientRect();
      const pin = d.querySelector(".uni-pin.is-selected")!.getBoundingClientRect();
      const credit = d.querySelector(".leaflet-control-attribution")!.getBoundingClientRect();
      return { cardBottom: cardBox.bottom, cardTop: cardBox.top, creditTop: credit.top, pinBottom: pin.bottom };
    });
    expect(geo.cardBottom).toBeLessThanOrEqual(geo.creditTop);
    expect(geo.pinBottom).toBeLessThanOrEqual(geo.cardTop);

    await dialog.getByRole("button", { name: m.map.close }).tap();
    // Markers come and go as clusters redraw; the map pane's offset is what a pan moves.
    const paneOffset = () => dialog.locator(".leaflet-map-pane").evaluate((el) => (el as HTMLElement).style.transform);
    const before = await paneOffset();
    await swipe(page, { x: 200, y: 520 }, { x: 120, y: 380 });
    await expect.poll(paneOffset).not.toBe(before);
    expect(await page.evaluate(() => window.scrollY)).toBe(listScroll);

    await dialog.getByRole("button", { name: m.map.backToList }).tap();
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/view=map/);
    expect(await page.evaluate(() => window.scrollY)).toBe(listScroll);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("the filter sheet opens over the map and the map follows it", async ({ page }) => {
    await page.goto("/tr/universities");
    await page.getByRole("button", { name: m.directory.viewMap, exact: true }).tap();
    const dialog = page.getByRole("dialog", { name: m.map.title });
    await mapReady(page, "dialog[open]");
    await dialog.getByRole("button", { name: new RegExp(`^${m.directory.filters}`) }).tap();
    const sheet = page.getByRole("dialog", { name: m.directory.filters });
    await sheet.getByText(m.directory.feeNone, { exact: true }).tap();
    await sheet.getByRole("button", { name: "61 üniversiteyi göster" }).tap();
    await expect(sheet).toBeHidden();
    await expect(dialog).toContainText("61 üniversite");
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
    await page.goBack();
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });
});
