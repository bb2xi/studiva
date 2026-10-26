// Pulls per-institution programme facets from the HRK Higher Education Compass
// (Hochschulkompass), as served by DAAD's "All degree programmes" search, and
// writes a small summary to scripts/data/hsk-programmes.json:
//
//   npm run data:hsk
//
// Only counts are stored — programmes per field of study, per level and per
// teaching language — and the site deep-links into the search instead of
// republishing programme records. Unlike DAAD's International Programmes
// database, the Compass covers every degree programme at state-recognised
// institutions, so it backs subject areas and degree levels.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.daad.de/api/ajax/hsk/list";

/** Our slug → Compass institution id, checked against the German institution names. */
const HSK_IDS = {
  tum: "184", lmu: "183", huberlin: "12", rwth: "1", mannheim: "176", hm: "291", frankfurtuas: "79", dhbw: "398",
  iu: "329", fom: "286", heidelberg: "119", tuebingen: "258", kit: "136", freiburg: "86", goettingen: "98", bonn: "32",
  koeln: "147", tuberlin: "13", tudresden: "53", tudarmstadt: "46", tubraunschweig: "35", hannover: "114", stuttgart: "248",
  konstanz: "154", htwberlin: "16", furtwangen: "94", hamburg: "104", fuberlin: "11", erlangen: "70", bochum: "29",
  mainz: "174", muenster: "191", bremen: "38", kiel: "144", marburg: "179", jena: "133", thkoeln: "149", hsmannheim: "177",
  hskarlsruhe: "138", htwgkonstanz: "155", thingolstadt: "288", hbrs: "294", hda: "47", reutlingen: "227", fhmuenster: "192",
  osnabrueck: "214", bht: "15", jade: "406", duesseldorf: "59", ude: "71", tudortmund: "51", bielefeld: "27", paderborn: "215",
  siegen: "245", wuppertal: "279", luebeck: "168", rostock: "233", greifswald: "99", magdeburg: "172", halle: "101",
  leipzig: "159", tuchemnitz: "42", potsdam: "221", viadrina: "84", btucottbus: "45", wuerzburg: "276", regensburg: "225",
  passau: "218", bayreuth: "9", augsburg: "6", bamberg: "8", kueichstaett: "65", hohenheim: "129", ulm: "259",
  saarland: "235", rptu: "135", fernunihagen: "100", oldenburg: "209", hildesheim: "127", leuphana: "171",
  tuclausthal: "43", vechta: "293",
};

async function getJson(locale, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API}/${locale}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Studiva data sync)" }, signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`Compass API ${res.status} for ${url}`);
  return res.json();
}

const facets = (json) => Object.fromEntries(json.filters.facets.items.map((f) => [f.name, f.data ?? []]));
const countOf = (data, value) => data.find((d) => d.value === value)?.count ?? 0;

const all = await getJson("en");
const germanNames = Object.fromEntries(facets(await getJson("de"))["hec-institution"].map((i) => [i.value, i.label]));

const institutions = {};
for (const [slug, id] of Object.entries(HSK_IDS)) {
  if (!germanNames[id]) throw new Error(`Compass institution ${id} (${slug}) not found`);
  const r = await getJson("en", { "hec-institution": id });
  const f = facets(r);
  const fields = {};
  for (const group of f["hec-subjectGroup"]) for (const field of group.children ?? []) if (field.count) fields[field.value] = field.count;
  institutions[slug] = {
    hskName: germanNames[id],
    institutionId: id,
    programmes: r.results.count,
    undergraduate: countOf(f["hec-degreeProgrammeType"], "g"),
    graduate: countOf(f["hec-degreeProgrammeType"], "w"),
    english: countOf(f["hec-teachingLanguage"], "2"),
    fields,
  };
  await new Promise((resolve) => setTimeout(resolve, 300));
}

const out = {
  source: "https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/",
  provider: "HRK Hochschulkompass",
  fetchedAt: new Date().toISOString().slice(0, 10),
  totalProgrammes: all.results.count,
  institutions,
};
fs.writeFileSync(path.join(root, "scripts/data/hsk-programmes.json"), JSON.stringify(out, null, 2) + "\n");
const empty = Object.entries(institutions).filter(([, v]) => v.programmes === 0).map(([s]) => s);
console.log(`Compass: ${all.results.count} programmes; ${Object.keys(institutions).length} institutions written.`);
if (empty.length) console.log("No programmes listed for:", empty.join(", "));
