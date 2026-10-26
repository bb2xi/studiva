// Builds src/data/university-facts.json from a dated, hand-verified source
// module (scripts/data/verified-*.mjs) plus the DAAD programme counts written
// by `npm run data:daad` (scripts/data/daad-programmes.json).
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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const basePath = path.join(root, "src/data/universities.json");
const outPath = path.join(root, "src/data/university-facts.json");
const force = process.argv.includes("--force");

const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")).records ?? {} : {};
const daad = JSON.parse(fs.readFileSync(path.join(root, "scripts/data/daad-programmes.json"), "utf8"));
// Same URL shape as daadSearchUrl() in src/lib/discovery/daad.ts.
const daadInstitutionUrl = (insId) => `https://www2.daad.de/deutschland/studienangebote/international-programmes/en/result/?ins%5B%5D=${insId}`;

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
  // DAAD lists international programmes only: a count above zero confirms English
  // teaching, but zero or no listing is "unknown", not "no".
  const englishConfirmed = (daadFacts?.englishProgrammes ?? 0) > 0;
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
    semesterContribution: verified.SEMESTER_CONTRIBUTIONS[slug] ?? { amountEur: null, term: null, includesTicket: null, source: null },
    uniAssistMember: uniAssist,
    uniAssistSource: uniAssist === null ? null : verified.SOURCES.uniAssist,
    englishTaught: englishConfirmed ? true : null,
    englishTaughtSource: englishConfirmed ? daadInstitutionUrl(daadFacts.insId) : null,
    daad: daadFacts,
    subjectAreas: null,
    subjectAreasSource: null,
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
].filter((s) => !slugs.includes(s));
if (unknownSlugs.length) throw new Error(`Verified data references unknown slugs: ${unknownSlugs.join(", ")}`);

fs.writeFileSync(outPath, JSON.stringify({ generatedAt: verified.CHECKED_AT, records }, null, 2) + "\n");

const statusCounts = {};
for (const r of Object.values(records)) statusCounts[r.nonEuTuition.status] = (statusCounts[r.nonEuTuition.status] ?? 0) + 1;
console.log(`Wrote ${slugs.length} records to ${path.relative(root, outPath)}`);
console.log("Non-EU tuition status:", statusCounts);
const count = (fn) => Object.values(records).filter(fn).length;
console.log(
  `Semester contribution: ${count((r) => r.semesterContribution.amountEur !== null)} · uni-assist known: ${count((r) => r.uniAssistMember !== null)} · English-taught (DAAD): ${count((r) => r.englishTaught === true)}`
);
if (missingState.length) console.log("No state assigned:", missingState.join(", "));
if (kept.length) console.log(`Kept ${kept.length} previously verified value(s) that the new source left empty:`, kept.join(", "));
