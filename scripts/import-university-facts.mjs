// Builds src/data/university-facts.json from a dated, hand-verified source
// module (scripts/data/verified-*.mjs) plus the programme counts written by
// `npm run data:daad` (scripts/data/daad-programmes.json) and `npm run data:hsk`
// (scripts/data/hsk-programmes.json).
//
//   node scripts/import-university-facts.mjs            # merge, keep existing verified values
//   node scripts/import-university-facts.mjs --force    # allow replacing non-null values with null
//
// Stable identifier is the slug (shared with src/data/universities.json), never
// the display name. A run never silently replaces a verified value with a
// missing one: such fields are kept and reported unless --force is passed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as verified from "./data/verified-2026-10-26.mjs";
import { HSK_FIELD_AREAS, HSK_UNMAPPED_FIELDS } from "./data/hsk-subject-areas.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const basePath = path.join(root, "src/data/universities.json");
const outPath = path.join(root, "src/data/university-facts.json");
const force = process.argv.includes("--force");

const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")).records ?? {} : {};
const daad = JSON.parse(fs.readFileSync(path.join(root, "scripts/data/daad-programmes.json"), "utf8"));
// Same URL shape as daadSearchUrl() in src/lib/discovery/daad.ts.
const daadInstitutionUrl = (insId) => `https://www2.daad.de/deutschland/studienangebote/international-programmes/en/result/?ins%5B%5D=${insId}`;
const hsk = JSON.parse(fs.readFileSync(path.join(root, "scripts/data/hsk-programmes.json"), "utf8"));
// Same URL shape as hskSearchUrl() in src/lib/discovery/daad.ts.
const hskInstitutionUrl = (id, english = false) =>
  `https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/?hec-institution=${id}${english ? "&hec-teachingLanguage=2" : ""}`;

const unmappedFields = new Set();
function subjectAreasOf(fields) {
  const areas = new Set();
  for (const id of Object.keys(fields)) {
    if (HSK_FIELD_AREAS[id]) HSK_FIELD_AREAS[id].forEach((a) => areas.add(a));
    else if (!HSK_UNMAPPED_FIELDS.includes(id)) unmappedFields.add(id);
  }
  return [...areas].sort();
}

const memberSet = new Set(verified.UNI_ASSIST_MEMBERS);
const overlap = verified.UNI_ASSIST_NON_MEMBERS.filter((s) => memberSet.has(s));
if (overlap.length) throw new Error(`Listed as uni-assist member and non-member: ${overlap.join(", ")}`);
const uniAssistOf = (slug) => (memberSet.has(slug) ? true : verified.UNI_ASSIST_NON_MEMBERS.includes(slug) ? false : null);

const slugs = base.map((u) => u.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) throw new Error(`Duplicate slugs in universities.json: ${dupes.join(", ")}`);

const stateOf = {};
for (const [code, list] of Object.entries(verified.STATE)) {
  for (const slug of list) {
    if (stateOf[slug]) throw new Error(`${slug} assigned to two states`);
    stateOf[slug] = code;
  }
}

const domains = new Map();
const kept = [];
const records = {};

for (const slug of slugs) {
  const state = stateOf[slug] ?? null;
  const officialUrl = verified.OFFICIAL_URLS[slug] ?? null;
  if (officialUrl) {
    const host = new URL(officialUrl).hostname.replace(/^www\./, "");
    if (domains.has(host)) throw new Error(`Domain ${host} used by ${domains.get(host)} and ${slug}`);
    domains.set(host, slug);
  }
  const listing = daad.institutions[slug];
  const daadFacts =
    listing?.insId && listing.degreeProgrammes > 0
      ? {
          insId: listing.insId,
          degreeProgrammes: listing.degreeProgrammes,
          englishProgrammes: listing.englishProgrammes,
          englishBachelor: listing.englishBachelor,
          englishMaster: listing.englishMaster,
          fetchedAt: daad.fetchedAt,
        }
      : null;
  const compass = hsk.institutions[slug];
  const hskFacts =
    compass && compass.programmes > 0
      ? {
          institutionId: compass.institutionId,
          programmes: compass.programmes,
          undergraduate: compass.undergraduate,
          graduate: compass.graduate,
          english: compass.english,
          fetchedAt: hsk.fetchedAt,
        }
      : null;
  const subjectAreas = hskFacts ? subjectAreasOf(compass.fields) : [];
  // DAAD (international programmes) is the primary English source; the Compass's
  // language facet backs institutions DAAD does not list. Zero is "unknown", not "no".
  const englishSource =
    (daadFacts?.englishProgrammes ?? 0) > 0
      ? daadInstitutionUrl(daadFacts.insId)
      : (hskFacts?.english ?? 0) > 0
        ? hskInstitutionUrl(hskFacts.institutionId, true)
        : null;
  const uniAssist = uniAssistOf(slug);
  const fresh = {
    slug,
    officialName: verified.OFFICIAL_NAMES[slug] ?? null,
    officialUrl,
    internationalUrl: verified.INTERNATIONAL_URLS[slug] ?? null,
    state,
    seatCity: null,
    ownership: verified.OWNERSHIP_EXCEPTIONS[slug] ?? (state ? "public" : null),
    ownershipSource: null,
    nonEuTuition: verified.tuitionFor(slug, state),
    semesterContribution: verified.SEMESTER_CONTRIBUTIONS[slug] ?? { amountEur: null, term: null, includesTicket: null, noteEn: null, noteTr: null, source: null },
    uniAssistMember: uniAssist,
    uniAssistSource: uniAssist === null ? null : verified.SOURCES.uniAssist,
    englishTaught: englishSource ? true : null,
    englishTaughtSource: englishSource,
    daad: daadFacts,
    hsk: hskFacts,
    subjectAreas: subjectAreas.length ? subjectAreas : null,
    subjectAreasSource: subjectAreas.length ? hskInstitutionUrl(hskFacts.institutionId) : null,
    checkedAt: verified.CHECKED_AT,
  };

  const previous = existing[slug];
  if (previous && !force) {
    for (const [key, value] of Object.entries(fresh)) {
      if (value === null && previous[key] !== null && previous[key] !== undefined) {
        fresh[key] = previous[key];
        kept.push(`${slug}.${key}`);
      }
    }
  }
  records[slug] = fresh;
}

const missingState = slugs.filter((s) => !stateOf[s]);
const unknownSlugs = [
  ...Object.keys(verified.OFFICIAL_URLS),
  ...Object.keys(verified.SEMESTER_CONTRIBUTIONS),
  ...Object.keys(verified.TUITION),
  ...verified.UNI_ASSIST_NON_MEMBERS,
  ...Object.keys(daad.institutions),
  ...Object.keys(hsk.institutions),
].filter((s) => !slugs.includes(s));
if (unmappedFields.size) throw new Error(`Compass fields without a subject-area mapping: ${[...unmappedFields].join(", ")}`);
if (unknownSlugs.length) throw new Error(`Verified data references unknown slugs: ${unknownSlugs.join(", ")}`);

fs.writeFileSync(outPath, JSON.stringify({ generatedAt: verified.CHECKED_AT, records }, null, 2) + "\n");

const statusCounts = {};
for (const r of Object.values(records)) statusCounts[r.nonEuTuition.status] = (statusCounts[r.nonEuTuition.status] ?? 0) + 1;
console.log(`Wrote ${slugs.length} records to ${path.relative(root, outPath)}`);
console.log("Non-EU tuition status:", statusCounts);
const count = (fn) => Object.values(records).filter(fn).length;
console.log(
  `Semester contribution: ${count((r) => r.semesterContribution.amountEur !== null)} · uni-assist known: ${count((r) => r.uniAssistMember !== null)} · English-taught: ${count((r) => r.englishTaught === true)} · subject areas: ${count((r) => r.subjectAreas !== null)}`
);
if (missingState.length) console.log("No state assigned:", missingState.join(", "));
if (kept.length) console.log(`Kept ${kept.length} previously verified value(s) that the new source left empty:`, kept.join(", "));
