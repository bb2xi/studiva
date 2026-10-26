export type Locale = "tr" | "en";

export type UniversityType = "Universität" | "Fachhochschule" | "Duale Hochschule";
export type Level = "bachelor" | "master" | "both";
export type Ownership = "public" | "private" | "church";
export type TuitionStatus = "none" | "charged" | "varies" | "unknown";

export const STATE_CODES = [
  "BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV",
  "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH",
] as const;
export type StateCode = (typeof STATE_CODES)[number];

export const SUBJECT_AREAS = [
  "engineering",
  "computer-science",
  "natural-sciences",
  "mathematics",
  "medicine-health",
  "business-economics",
  "law",
  "social-sciences",
  "humanities-languages",
  "education-teaching",
  "arts-design-music",
  "agriculture-environment",
  "architecture-planning",
] as const;
export type SubjectArea = (typeof SUBJECT_AREAS)[number];

/** Language-independent record shared by both locales (src/data/universities.json). */
export type UniversityBase = {
  slug: string;
  type: UniversityType;
  founded: string;
  badges: string[];
  level: Level;
  /** Studiva's own editorial assessment — guidance, not an official statistic. */
  competitiveness: "low" | "medium" | "high";
  lat: number;
  lng: number;
  /** Canonical (German) campus city names this institution is listed under. */
  cities: string[];
  multiCampus: boolean;
};

/**
 * Facts verified against official sources (src/data/university-facts.json).
 * Every value is either backed by a source URL that was fetched and checked on
 * `checkedAt`, or null — never estimated.
 */
export type UniversityFacts = {
  slug: string;
  officialName: string | null;
  officialUrl: string | null;
  internationalUrl: string | null;
  state: StateCode | null;
  seatCity: string | null;
  ownership: Ownership | null;
  ownershipSource: string | null;
  nonEuTuition: {
    status: TuitionStatus;
    minEur: number | null;
    maxEur: number | null;
    noteEn: string | null;
    noteTr: string | null;
    source: string | null;
  };
  semesterContribution: {
    amountEur: number | null;
    /** Term the amount was published for, e.g. "WiSe 2026/27", "SoSe 2027", "FSS 2027". */
    term: string | null;
    /** True/false only when the cited breakdown shows whether a transport ticket is included. */
    includesTicket: boolean | null;
    source: string | null;
  };
  uniAssistMember: boolean | null;
  uniAssistSource: string | null;
  englishTaught: boolean | null;
  englishTaughtSource: string | null;
  /**
   * Programme counts from DAAD's International Programmes database. That database
   * lists international programmes only, so a missing or zero count never means
   * "no English-taught programmes".
   */
  daad: {
    insId: string;
    degreeProgrammes: number;
    englishProgrammes: number;
    englishBachelor: number;
    englishMaster: number;
    fetchedAt: string;
  } | null;
  subjectAreas: SubjectArea[] | null;
  subjectAreasSource: string | null;
  checkedAt: string;
};

export const COMPLETENESS_FIELDS = [
  "officialUrl",
  "internationalUrl",
  "state",
  "ownership",
  "nonEuTuition",
  "semesterContribution",
  "uniAssist",
  "englishTaught",
  "subjectAreas",
] as const;
export type CompletenessField = (typeof COMPLETENESS_FIELDS)[number];

export type Completeness = {
  filled: number;
  total: number;
  missing: CompletenessField[];
};

/** Client-safe merged record: shared base + localized summary text + verified facts. */
export type UniversitySummary = UniversityBase & {
  name: string;
  /** Localized display string for the location (may describe multiple campuses). */
  cityLabel: string;
  description: string;
  popularPrograms: string[];
  students: string | null;
  languageSummary: string | null;
  state: StateCode | null;
  facts: UniversityFacts | null;
  completeness: Completeness;
};

/** Full record for the detail page. */
export type UniversityDetail = UniversitySummary & {
  history: string[];
  highlights: string[];
  pros: string[];
  cons: string[];
};
