import type { StateCode } from "@/lib/discovery/types";

export type StateInfo = {
  code: StateCode;
  /** URL slug — the German name, kept language-neutral like official institution names. */
  slug: string;
  name: { de: string; en: string; tr: string };
  capital: string;
};

export const STATES: StateInfo[] = [
  { code: "BW", slug: "baden-wuerttemberg", name: { de: "Baden-Württemberg", en: "Baden-Württemberg", tr: "Baden-Württemberg" }, capital: "Stuttgart" },
  { code: "BY", slug: "bayern", name: { de: "Bayern", en: "Bavaria", tr: "Bavyera" }, capital: "München" },
  { code: "BE", slug: "berlin", name: { de: "Berlin", en: "Berlin", tr: "Berlin" }, capital: "Berlin" },
  { code: "BB", slug: "brandenburg", name: { de: "Brandenburg", en: "Brandenburg", tr: "Brandenburg" }, capital: "Potsdam" },
  { code: "HB", slug: "bremen", name: { de: "Bremen", en: "Bremen", tr: "Bremen" }, capital: "Bremen" },
  { code: "HH", slug: "hamburg", name: { de: "Hamburg", en: "Hamburg", tr: "Hamburg" }, capital: "Hamburg" },
  { code: "HE", slug: "hessen", name: { de: "Hessen", en: "Hesse", tr: "Hessen" }, capital: "Wiesbaden" },
  { code: "MV", slug: "mecklenburg-vorpommern", name: { de: "Mecklenburg-Vorpommern", en: "Mecklenburg-Western Pomerania", tr: "Mecklenburg-Vorpommern" }, capital: "Schwerin" },
  { code: "NI", slug: "niedersachsen", name: { de: "Niedersachsen", en: "Lower Saxony", tr: "Aşağı Saksonya" }, capital: "Hannover" },
  { code: "NW", slug: "nordrhein-westfalen", name: { de: "Nordrhein-Westfalen", en: "North Rhine-Westphalia", tr: "Kuzey Ren-Vestfalya" }, capital: "Düsseldorf" },
  { code: "RP", slug: "rheinland-pfalz", name: { de: "Rheinland-Pfalz", en: "Rhineland-Palatinate", tr: "Renanya-Palatina" }, capital: "Mainz" },
  { code: "SL", slug: "saarland", name: { de: "Saarland", en: "Saarland", tr: "Saarland" }, capital: "Saarbrücken" },
  { code: "SN", slug: "sachsen", name: { de: "Sachsen", en: "Saxony", tr: "Saksonya" }, capital: "Dresden" },
  { code: "ST", slug: "sachsen-anhalt", name: { de: "Sachsen-Anhalt", en: "Saxony-Anhalt", tr: "Saksonya-Anhalt" }, capital: "Magdeburg" },
  { code: "SH", slug: "schleswig-holstein", name: { de: "Schleswig-Holstein", en: "Schleswig-Holstein", tr: "Schleswig-Holstein" }, capital: "Kiel" },
  { code: "TH", slug: "thueringen", name: { de: "Thüringen", en: "Thuringia", tr: "Türingiya" }, capital: "Erfurt" },
];

export const STATE_BY_CODE = Object.fromEntries(STATES.map((s) => [s.code, s])) as Record<StateCode, StateInfo>;
export const STATE_BY_SLUG = Object.fromEntries(STATES.map((s) => [s.slug, s])) as Record<string, StateInfo>;

/** English exonyms for the few campus cities whose English name differs from the German one. */
const CITY_EN: Record<string, string> = {
  München: "Munich",
  Köln: "Cologne",
  Nürnberg: "Nuremberg",
};

export function cityName(city: string, locale: string) {
  return locale === "en" ? (CITY_EN[city] ?? city) : city;
}

export function citySlug(city: string) {
  return city
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
