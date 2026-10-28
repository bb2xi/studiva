import { expect, test, type Page } from "@playwright/test";
import { STATES } from "../src/data/states";
import { SUBJECT_AREAS } from "../src/lib/discovery/types";
import { DESKTOP, PHONE, cards, messages, universities, type University } from "./helpers";

const m = messages("tr");
const unis = universities();
const count = (pred: (u: University) => boolean) => unis.filter(pred).length;
const fee = (u: University) => u.facts?.nonEuTuition.status;
const contribution = (u: University) => u.facts?.semesterContribution.amountEur ?? null;
const TYPES = { universitat: "Universität", hochschule: "Fachhochschule", dual: "Duale Hochschule" } as const;

/** The count shown next to a filter option in the desktop sidebar. */
async function shownCount(page: Page, section: string, label: string) {
  const option = page.locator(`#side-${section} label`).filter({ has: page.getByText(label, { exact: true }) });
  return Number(await option.locator("span").last().innerText());
}

test.describe("filter counts", () => {
  test.use({ viewport: DESKTOP });

  test("every option's count matches the data", async ({ page }) => {
    await page.goto("/tr/universities");
    for (const section of ["ownership", "badges"]) await page.locator(`#side-${section} button[aria-expanded="false"]`).first().click();
    await page.locator("#side-state").getByRole("button", { name: /Tüm eyaletleri göster/ }).click();

    const expected: [string, string, number][] = [
      ["fee", m.directory.feeNone, count((u) => fee(u) === "none")],
      ["fee", m.directory.feeCharged, count((u) => fee(u) === "charged" || fee(u) === "varies")],
      ["language", m.directory.english, count((u) => u.facts?.englishTaught === true)],
      ...SUBJECT_AREAS.map((s): [string, string, number] => ["subject", m.subjects[s], count((u) => !!u.facts?.subjectAreas?.includes(s))]),
      ...STATES.map((s): [string, string, number] => ["state", s.name.tr, count((u) => u.facts?.state === s.code)]),
      ...Object.entries(TYPES).map(([key, type]): [string, string, number] => ["type", m.types[key], count((u) => u.type === type)]),
      ["route", m.directory.routeUniAssist, count((u) => u.facts?.uniAssistMember === true)],
      ["route", m.directory.routeDirect, count((u) => u.facts?.uniAssistMember === false)],
      ...[200, 350, 450].map((cap): [string, string, number] => [
        "contribution",
        m.directory.contributionMax.replace("{amount}", String(cap)),
        count((u) => contribution(u) !== null && contribution(u)! <= cap),
      ]),
      ["ownership", m.ownership.public, count((u) => u.facts?.ownership === "public")],
      ["ownership", m.ownership.private, count((u) => u.facts?.ownership === "private" || u.facts?.ownership === "church")],
      ["badges", m.directory.tu9, count((u) => u.badges.includes("tu9"))],
      ["badges", m.directory.excellence, count((u) => u.badges.includes("excellence"))],
    ];
    for (const [section, label, want] of expected) expect.soft(await shownCount(page, section, label), `${section}: ${label}`).toBe(want);
    await expect(page.locator("#side-contribution")).toContainText(String(count((u) => contribution(u) === null)));
  });

  test("counts take the other filters into account", async ({ page }) => {
    await page.goto("/tr/universities?state=BY&en=1");
    const inBavaria = (u: University) => u.facts?.state === "BY" && u.facts?.englishTaught === true;
    expect(await shownCount(page, "fee", m.directory.feeNone)).toBe(count((u) => inBavaria(u) && fee(u) === "none"));
    expect(await shownCount(page, "fee", m.directory.feeCharged)).toBe(count((u) => inBavaria(u) && (fee(u) === "charged" || fee(u) === "varies")));
    await expect(page.locator("[aria-live=polite]").first()).toHaveText(`${count(inBavaria)} üniversite`);
  });

  test("an option that would leave nothing is disabled, not hidden", async ({ page }) => {
    // A state with universities but no cooperative (dual) one.
    const state = STATES.find((s) => count((u) => u.facts?.state === s.code) > 0 && count((u) => u.facts?.state === s.code && u.type === TYPES.dual) === 0)!;
    await page.goto(`/tr/universities?state=${state.code}`);
    const dual = page.locator("#side-type label").filter({ has: page.getByText(m.types.dual, { exact: true }) });
    await expect(dual).toBeVisible();
    await expect(dual.locator("input")).toBeDisabled();
    await expect(dual.locator("span").last()).toHaveText("0");
  });
});

test.describe("URL state", () => {
  test.use({ viewport: DESKTOP });

  test("a shared URL restores filters, sort and view", async ({ page }) => {
    await page.goto("/tr/universities?fee=none&en=1&subject=law,medicine-health&ua=direct&cmax=350&sort=name&view=table");
    const chips = page.getByRole("group", { name: m.directory.activeFilters });
    for (const text of [m.directory.feeNone, m.directory.english, m.subjects.law, m.subjects["medicine-health"], m.directory.routeDirect, m.directory.contributionChip.replace("{amount}", "350")]) {
      await expect(chips.getByRole("button", { name: new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })).toBeVisible();
    }
    await expect(page.getByRole("combobox", { name: m.directory.sort })).toHaveValue("name");
    await expect(page.getByRole("button", { name: m.directory.viewTable, exact: true })).toHaveAttribute("aria-pressed", "true");
    const want = count(
      (u) =>
        fee(u) === "none" &&
        u.facts?.englishTaught === true &&
        !!u.facts.subjectAreas?.some((s) => s === "law" || s === "medicine-health") &&
        u.facts.uniAssistMember === false &&
        contribution(u) !== null &&
        contribution(u)! <= 350
    );
    await expect(page.locator("tbody tr")).toHaveCount(want);
  });

  test("older parameters keep working", async ({ page }) => {
    await page.goto("/tr/universities?ua=1");
    await expect(page.getByRole("group", { name: m.directory.activeFilters })).toContainText(m.directory.routeUniAssist);
    await expect(page.locator("[aria-live=polite]").first()).toHaveText(`${count((u) => u.facts?.uniAssistMember === true)} üniversite`);

    await page.goto("/tr/universities?subject=engineering");
    await expect(page.locator("[aria-live=polite]").first()).toHaveText(`${count((u) => !!u.facts?.subjectAreas?.includes("engineering"))} üniversite`);

    await page.goto("/tr/universities?page=2");
    await expect(cards(page)).toHaveCount(48);

    await page.goto("/tr/universities?level=master&type=universitat&badge=tu9&own=public");
    const chips = page.getByRole("group", { name: m.directory.activeFilters });
    for (const text of [m.levels.master, m.types.universitat, m.directory.tu9, m.ownership.public]) await expect(chips).toContainText(text);
    await expect(cards(page).first()).toBeVisible();
  });

  test("view switches go into history, so Back returns to the cards with the same filters", async ({ page }) => {
    await page.goto("/tr/universities?fee=none");
    await page.getByRole("button", { name: m.directory.viewTable, exact: true }).click();
    await expect(page).toHaveURL(/view=table/);
    await page.goBack();
    await expect(page).toHaveURL(/\/tr\/universities\?fee=none$/);
    await expect(cards(page)).toHaveCount(24);
  });

  test("changing a filter keeps the result count on screen", async ({ page }) => {
    await page.goto("/tr/universities");
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.locator("#side-subject").getByText(m.subjects.law, { exact: true }).click();
    const text = `${count((u) => !!u.facts?.subjectAreas?.includes("law"))} üniversite`;
    // The toolbar's own count (not the screen-reader live region) is inside the viewport.
    await expect
      .poll(() =>
        page.evaluate(
          (text) =>
            [...document.querySelectorAll("p")].some((p) => {
              const box = p.getBoundingClientRect();
              return !!p.textContent?.startsWith(text) && !p.classList.contains("sr-only") && box.height > 0 && box.top >= 0 && box.bottom <= innerHeight;
            }),
          text
        )
      )
      .toBe(true);
  });
});

test.describe("filter sheet on a phone", () => {
  test.use(PHONE);

  test("opens as a modal, shows the live count, closes with Esc and gives focus back", async ({ page }) => {
    await page.goto("/tr/universities");
    const opener = page.getByRole("button", { name: new RegExp(`^${m.directory.filters}`) }).first();
    await opener.click();
    const sheet = page.getByRole("dialog", { name: m.directory.filters });
    await expect(sheet).toBeVisible();
    expect(await sheet.evaluate((d) => d.matches(":modal"))).toBe(true);
    await sheet.getByText(m.directory.feeNone, { exact: true }).click();
    await expect(sheet.getByRole("button", { name: `${count((u) => fee(u) === "none")} üniversiteyi göster` })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(opener).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    await expect(page).toHaveURL(/fee=none/);
  });

  test("the subject chip opens the sheet at the subject section", async ({ page }) => {
    await page.goto("/tr/universities");
    await page.getByRole("button", { name: m.subjects.label }).first().click();
    await expect(page.locator("#sheet-subject")).toBeInViewport();
  });
});
