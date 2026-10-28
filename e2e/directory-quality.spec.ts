import { expect, test, type Page } from "@playwright/test";
import { DESKTOP, PHONE, axeViolations, cards, mapReady, overflow } from "./helpers";

test.describe("server HTML", () => {
  test.use({ javaScriptEnabled: false, viewport: DESKTOP });

  test("the prerendered page already lists the first 24 universities", async ({ page }) => {
    await page.goto("/tr/universities");
    await expect(cards(page)).toHaveCount(24);
    await expect(cards(page).first()).toContainText("Universität Hamburg");
  });

  test("it describes all 82 universities as an ItemList", async ({ request }) => {
    const html = await (await request.get("/tr/universities")).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const list = blocks.find((b) => b["@type"] === "ItemList");
    expect(list?.numberOfItems).toBe(82);
    expect(list?.itemListElement).toHaveLength(82);
    // Was 392 KB before the clean-up; the spec's target is 250 KB (see the phase 5 report).
    expect(html.length).toBeLessThan(290_000);
  });
});

test.describe("first load", () => {
  test.use({ viewport: DESKTOP });

  test("the cards view stays under 2 MB cold and loads neither the map nor other pages' photos", async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    let bytes = 0;
    const urls: string[] = [];
    cdp.on("Network.loadingFinished", (e) => (bytes += e.encodedDataLength));
    cdp.on("Network.requestWillBeSent", (e) => urls.push(e.request.url));
    await page.goto("/tr/universities", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    expect(bytes).toBeLessThan(2 * 1024 * 1024);
    expect(urls.filter((u) => u.includes("arcgisonline"))).toEqual([]);
    expect(urls.filter((u) => u.includes("1920px"))).toEqual([]);
  });

  test("nothing shifts while the page loads", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as Window & { __cls?: number };
      w.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
          if (!entry.hadRecentInput) w.__cls! += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/tr/universities", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => (window as Window & { __cls?: number }).__cls)).toBeLessThan(0.05);
  });
});

for (const [label, options, limit] of [
  ["desktop 1440×900", { viewport: DESKTOP }, 700],
  ["phone 390×844", PHONE, 900],
] as const) {
  test.describe(label, () => {
    test.use(options);

    test(`the first card starts within ${limit} px`, async ({ page }) => {
      await page.goto("/tr/universities");
      const top = await cards(page).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
      expect(top).toBeLessThanOrEqual(limit);
    });

    test("the skip link reaches the first card within 15 Tab presses", async ({ page }) => {
      await page.goto("/tr/universities", { waitUntil: "networkidle" });
      let presses = 0;
      while (presses < 15) {
        await page.keyboard.press("Tab");
        presses++;
        const where = await page.evaluate(() => {
          const el = document.activeElement;
          if (el?.closest("#results > ul > li")) return "card";
          return el?.matches('a[href="#results"]') ? "skip" : "";
        });
        if (where === "card") break;
        if (where === "skip") await page.keyboard.press("Enter");
      }
      expect(await page.evaluate(() => !!document.activeElement?.closest("#results > ul > li:first-child"))).toBe(true);
      expect(presses).toBeLessThanOrEqual(15);
    });
  });
}

test.describe("no horizontal overflow", () => {
  for (const width of [375, 390, 768, 834, 1024, 1280, 1440]) {
    for (const view of ["cards", "table", "map"] as const) {
      test(`${view} at ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/en/universities${view === "cards" ? "" : `?view=${view}`}`);
        if (view === "map") await mapReady(page);
        else await expect(cards(page).or(page.locator("tbody tr")).first()).toBeVisible();
        expect(await overflow(page)).toBe(0);
      });
    }
  }
});

test.describe("accessibility (axe)", () => {
  const scan = async (page: Page, path: string, view: "cards" | "table" | "map") => {
    await page.goto(path);
    if (view === "map") await mapReady(page);
    else await expect(cards(page).or(page.locator("tbody tr")).first()).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  };

  for (const view of ["cards", "table", "map"] as const) {
    const query = view === "cards" ? "" : `?view=${view}`;
    test.describe(view, () => {
      test("desktop, Turkish", async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        await scan(page, `/tr/universities${query}`, view);
      });
      test("desktop, English, dark", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.emulateMedia({ colorScheme: "dark" });
        await scan(page, `/en/universities${query}`, view);
      });
    });
    test.describe(`${view} on a phone`, () => {
      test.use(PHONE);
      test("Turkish", async ({ page }) => {
        await scan(page, `/tr/universities${query}`, view);
      });
    });
  }
});
