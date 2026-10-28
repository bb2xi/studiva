import { expect, test } from "@playwright/test";
import { DESKTOP, PHONE, cards, messages } from "./helpers";

const m = messages("tr");
const showMore = /üniversite daha göster/;

test.describe("cards on desktop", () => {
  test.use({ viewport: DESKTOP });

  test("each card has four figures and says when one is not verified", async ({ page }) => {
    await page.goto("/tr/universities");
    await expect(cards(page).first().locator("dl > div")).toHaveCount(4);
    await expect(cards(page).first()).not.toContainText("Doğrulanan");
    // Unverified contributions sort last; they read "Doğrulanmadı" instead of a guess.
    await page.goto("/tr/universities?sort=contribution&page=4");
    await expect(cards(page).last().locator("dl > div").first()).toContainText(m.common.notVerified);
  });

  test("show more adds 24 cards, keeps page=2 and brings the first new card to the top with focus", async ({ page }) => {
    await page.goto("/tr/universities");
    await page.getByRole("button", { name: showMore }).click();
    await expect(cards(page)).toHaveCount(48);
    await expect(page).toHaveURL(/page=2/);
    await expect(cards(page).nth(24).locator("a").first()).toBeFocused();
    const fullyVisible = await page.evaluate(
      () =>
        [...document.querySelectorAll("#results > ul > li")].filter((li) => {
          const box = li.getBoundingClientRect();
          return box.top >= 0 && box.bottom <= innerHeight;
        }).length
    );
    expect(fullyVisible).toBeGreaterThanOrEqual(3);
  });
});

test.describe("cards on a phone", () => {
  test.use(PHONE);

  test("show more brings the first new card right under the search bar", async ({ page }) => {
    await page.goto("/tr/universities");
    await page.getByRole("button", { name: showMore }).click();
    await expect(cards(page)).toHaveCount(48);
    await expect(cards(page).nth(24).locator("a").first()).toBeFocused();
    const top = await cards(page).nth(24).evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThan(150);
    expect(top).toBeLessThan(260);
  });

  test("card actions are at least 44 px tall and wide", async ({ page }) => {
    await page.goto("/tr/universities");
    const sizes = await cards(page)
      .first()
      .locator("button")
      .evaluateAll((buttons) => buttons.map((b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height)));
    expect(sizes.length).toBe(3);
    for (const size of sizes) expect(size).toBeGreaterThanOrEqual(44);
  });
});

test.describe("table on desktop", () => {
  test.use({ viewport: DESKTOP });

  test("lists every result with sortable headers tied to the sort parameter", async ({ page }) => {
    await page.goto("/tr/universities?view=table");
    await expect(page.locator("tbody tr")).toHaveCount(82);
    await expect(page.locator('th[aria-sort="descending"]')).toContainText(m.table.programmes);
    await page.getByRole("button", { name: m.table.university, exact: true }).click();
    await expect(page).toHaveURL(/sort=name/);
    await expect(page.locator('th[aria-sort="ascending"]')).toContainText(m.table.university);
    const names = await page.locator("tbody th a").allInnerTexts();
    expect(names.slice(0, 5)).toEqual([...names].sort((a, b) => a.localeCompare(b, "tr")).slice(0, 5));
  });

  test("fits its column and keeps the header under the toolbar while scrolling", async ({ page }) => {
    await page.goto("/tr/universities?view=table&fee=none");
    expect(await page.locator("table").evaluate((t) => t.parentElement!.scrollWidth - t.parentElement!.clientWidth)).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect
      .poll(() =>
        page.evaluate(() => {
          const header = document.querySelector("thead th")!.getBoundingClientRect().top;
          const toolbar = getComputedStyle(document.querySelector("table")!.closest("[style]")!).getPropertyValue("--directory-toolbar-bottom");
          return `${Math.round(header)}px` === toolbar;
        })
      )
      .toBe(true);
  });

  test("the map action in a row opens the map on that university", async ({ page }) => {
    await page.goto("/tr/universities?view=table");
    const row = page.locator("tbody tr").nth(3);
    const name = await row.locator("th a").innerText();
    await row.getByRole("button", { name: m.card.showOnMapFor.replace("{name}", name) }).click();
    await expect(page).toHaveURL(/view=map&focus=/);
    await expect(page.locator("[data-map-card] h3")).toHaveText(name);
  });
});

test.describe("table on a phone", () => {
  test.use(PHONE);

  test("scrolls sideways in its own box with the name column pinned", async ({ page }) => {
    await page.goto("/en/universities?view=table");
    const box = await page.locator("table").evaluate((t) => ({
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      inner: t.parentElement!.scrollWidth - t.parentElement!.clientWidth,
      pinned: getComputedStyle(t.querySelector("tbody th")!).position,
    }));
    expect(box).toEqual({ page: 0, inner: expect.any(Number), pinned: "sticky" });
    expect(box.inner).toBeGreaterThan(0);
  });
});
