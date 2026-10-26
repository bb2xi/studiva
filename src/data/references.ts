/**
 * Reference figures and scholarship programmes, each tied to the official page
 * it was checked against. Update `checkedAt` whenever a value is re-verified.
 */

export const COST_REFERENCE = {
  checkedAt: "2026-10-26",
  source: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/",
  /** Average monthly student spending by item — DZHW 22nd Social Survey, as published by DAAD. */
  monthly: { rent: 410, food: 198, transport: 89, health: 100 },
  monthlyTotal: 876,
  /** Proof of funds for a student visa, per DAAD (valid as of 1 January 2025). */
  visaPerMonth: 992,
} as const;

export type ScholarshipLevel = "bachelor" | "master" | "phd";
export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  providerType: "government" | "foundation" | "eu" | "database";
  levels: ScholarshipLevel[];
  eligibility: { en: string; tr: string };
  funding: { en: string; tr: string };
  /** Recurring deadlines (month-day) when the provider publishes fixed annual dates. */
  annualDeadlines: { month: number; day: number }[] | null;
  deadlineNote: { en: string; tr: string };
  officialUrl: string;
  checkedAt: string;
};

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "daad-database",
    name: "DAAD Scholarship Database",
    provider: "DAAD — German Academic Exchange Service",
    providerType: "database",
    levels: ["bachelor", "master", "phd"],
    eligibility: {
      en: "Search tool listing around 150 DAAD and partner programmes. Filter by the country you apply from, your academic level and subject to see what you are eligible for.",
      tr: "DAAD ve ortaklarının yaklaşık 150 programını listeleyen arama aracı. Başvurduğunuz ülkeye, akademik seviyenize ve alanınıza göre filtreleyerek uygun olduklarınızı görün.",
    },
    funding: { en: "Depends on the programme.", tr: "Programa göre değişir." },
    annualDeadlines: null,
    deadlineNote: { en: "Each programme has its own deadline.", tr: "Her programın kendi son tarihi vardır." },
    officialUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/",
    checkedAt: "2026-10-26",
  },
  {
    id: "deutschlandstipendium",
    name: "Deutschlandstipendium",
    provider: "German Federal Government & private sponsors",
    providerType: "government",
    levels: ["bachelor", "master"],
    eligibility: {
      en: "Students of any nationality enrolled (or about to enrol) at a state or state-recognised university that takes part. Selection by the university: grades, social engagement and personal circumstances. Doctoral candidates are not eligible.",
      tr: "Katılan bir devlet veya devletçe tanınan üniversiteye kayıtlı (ya da kayıt olacak) her uyruktan öğrenci. Seçimi üniversite yapar: notlar, sosyal sorumluluk ve kişisel koşullar. Doktora öğrencileri başvuramaz.",
    },
    funding: {
      en: "€300 per month, independent of income; half from the federal government, half from private sponsors.",
      tr: "Gelirden bağımsız olarak ayda 300 €; yarısı federal hükümetten, yarısı özel destekçilerden.",
    },
    annualDeadlines: null,
    deadlineNote: {
      en: "Set by each university — often earlier than the study application deadline.",
      tr: "Her üniversite kendisi belirler — çoğu zaman program başvuru son tarihinden daha erkendir.",
    },
    officialUrl: "https://www.deutschlandstipendium.de/deutschlandstipendium/de/services/english/the-deutschlandstipendium-best-of-both-worlds-for-students.html",
    checkedAt: "2026-10-26",
  },
  {
    id: "boell",
    name: "Heinrich Böll Foundation scholarships for international students",
    provider: "Heinrich-Böll-Stiftung",
    providerType: "foundation",
    levels: ["master", "phd"],
    eligibility: {
      en: "International graduates with a first degree from abroad, for master's or doctoral study in Germany. Priority for applicants from countries on the OECD DAC list; good German is required (doctorate: DSH II / B2), application documents in German. The foundation announced rule changes from 1 March 2027 — check before applying.",
      tr: "Yurt dışından ilk diplomaya sahip uluslararası mezunlar, Almanya'da yüksek lisans veya doktora için. OECD DAC listesindeki ülkelerden başvuranlara öncelik; iyi Almanca gerekir (doktora: DSH II / B2), başvuru belgeleri Almanca. Vakıf 1 Mart 2027'den itibaren kural değişiklikleri duyurdu — başvurmadan önce kontrol edin.",
    },
    funding: {
      en: "Monthly stipend and allowances set by the foundation's guidelines — amounts are listed in its application documents.",
      tr: "Vakıf yönergelerine göre aylık burs ve ek ödemeler — tutarlar başvuru belgelerinde yer alır.",
    },
    annualDeadlines: [
      { month: 3, day: 1 },
      { month: 9, day: 1 },
    ],
    deadlineNote: {
      en: "Two rounds a year: 1 March and 1 September. The online portal opens about six weeks before.",
      tr: "Yılda iki tur: 1 Mart ve 1 Eylül. Çevrimiçi portal yaklaşık altı hafta önce açılır.",
    },
    officialUrl: "https://www.boell.de/en/scholarships",
    checkedAt: "2026-10-26",
  },
  {
    id: "erasmus-mundus",
    name: "Erasmus Mundus Joint Masters",
    provider: "European Union (Erasmus+)",
    providerType: "eu",
    levels: ["master"],
    eligibility: {
      en: "Holders of a first higher-education degree who have not previously received an Erasmus Mundus scholarship. You apply to an individual joint programme run by a consortium of universities, often including German ones.",
      tr: "İlk yükseköğretim diplomasına sahip, daha önce Erasmus Mundus bursu almamış kişiler. Çoğu zaman Alman üniversitelerinin de yer aldığı bir konsorsiyumun yürüttüğü belirli bir ortak programa başvurulur.",
    },
    funding: {
      en: "EU scholarships cover travel, visa, installation and subsistence costs; the amount is set in each call.",
      tr: "AB bursları seyahat, vize, yerleşme ve geçim masraflarını karşılar; tutar her çağrıda belirlenir.",
    },
    annualDeadlines: null,
    deadlineNote: {
      en: "Set by each programme — usually between October and January for the following academic year.",
      tr: "Her program belirler — genellikle bir sonraki akademik yıl için Ekim ile Ocak arasında.",
    },
    officialUrl: "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters",
    checkedAt: "2026-10-26",
  },
];

/** Next upcoming annual deadline relative to `today` (UTC), or null. */
export function nextDeadline(s: Scholarship, today: Date) {
  if (!s.annualDeadlines) return null;
  const year = today.getUTCFullYear();
  const candidates = s.annualDeadlines.flatMap(({ month, day }) => [
    new Date(Date.UTC(year, month - 1, day)),
    new Date(Date.UTC(year + 1, month - 1, day)),
  ]);
  const start = Date.UTC(year, today.getUTCMonth(), today.getUTCDate());
  return candidates.filter((d) => d.getTime() >= start).sort((a, b) => a.getTime() - b.getTime())[0] ?? null;
}
