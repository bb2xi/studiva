// Pulls per-institution programme counts from DAAD's "International Programmes in
// Germany" database (the official search at www2.daad.de) and writes a small
// summary to scripts/data/daad-programmes.json:
//
//   npm run data:daad
//
// Only counts and DAAD's own institution IDs are stored — the site deep-links
// into DAAD's search instead of republishing its programme records. The DAAD
// database lists international (mostly English-taught) programmes, not every
// programme in Germany, so a missing institution means "not listed", never
// "no English-taught programmes".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://www2.daad.de/deutschland/studienangebote/international-programmes/api/solr/en/search.json";
const DEGREE_TYPES = { 1: "bachelor", 2: "master", 3: "phd", 4: "phd" };

/** Our slug → DAAD institution name, as DAAD spells it. */
const DAAD_NAMES = {
  tum: "Technical University of Munich",
  lmu: "Ludwig-Maximilians-Universität München",
  huberlin: "Humboldt-Universität zu Berlin",
  rwth: "RWTH Aachen University",
  mannheim: "University of Mannheim",
  hm: "Hochschule München University of Applied Sciences",
  frankfurtuas: "Frankfurt University of Applied Sciences",
  dhbw: "Baden-Wuerttemberg Cooperative State University",
  heidelberg: "Heidelberg University",
  tuebingen: "University of Tübingen",
  kit: "Karlsruhe Institute of Technology",
  freiburg: "University of Freiburg",
  goettingen: "University of Göttingen",
  bonn: "University of Bonn",
  koeln: "University of Cologne",
  tuberlin: "Technische Universität Berlin",
  tudresden: "Dresden University of Technology",
  tudarmstadt: "Technical University of Darmstadt",
  tubraunschweig: "Technische Universität Braunschweig",
  hannover: "Leibniz University Hannover",
  stuttgart: "University of Stuttgart",
  konstanz: "University of Konstanz",
  htwberlin: "HTW Berlin University of Applied Sciences",
  furtwangen: "Furtwangen University",
  hamburg: "University of Hamburg",
  fuberlin: "Freie Universität Berlin",
  erlangen: "FAU Erlangen-Nürnberg",
  bochum: "Ruhr-Universität Bochum",
  mainz: "Johannes Gutenberg University Mainz",
  muenster: "University of Münster",
  bremen: "University of Bremen",
  kiel: "Kiel University",
  marburg: "Marburg University",
  jena: "Friedrich Schiller University Jena",
  thkoeln: "Technische Hochschule Köln - University of Applied Sciences",
  hsmannheim: "Technische Hochschule Mannheim",
  hskarlsruhe: "Karlsruhe University of Applied Sciences",
  htwgkonstanz: "HTWG Konstanz - University of Applied Sciences",
  thingolstadt: "Technische Hochschule Ingolstadt",
  hbrs: "Hochschule Bonn-Rhein-Sieg",
  hda: "Darmstadt University of Applied Sciences",
  reutlingen: "Reutlingen University",
  fhmuenster: "FH Münster University of Applied Sciences",
  osnabrueck: "Osnabrück University of Applied Sciences",
  bht: "Berliner Hochschule für Technik",
  jade: "Jade University of Applied Sciences Wilhelmshaven/Oldenburg/Elsfleth",
  duesseldorf: "Heinrich Heine University Düsseldorf",
  ude: "University of Duisburg-Essen",
  tudortmund: "TU Dortmund University",
  bielefeld: "Bielefeld University",
  paderborn: "Paderborn University",
  siegen: "University of Siegen",
  wuppertal: "University of Wuppertal",
  luebeck: "Universität zu Lübeck",
  rostock: "University of Rostock",
  greifswald: "University of Greifswald",
  magdeburg: "Otto von Guericke University Magdeburg",
  halle: "Martin Luther University Halle-Wittenberg",
  leipzig: "Leipzig University",
  tuchemnitz: "Chemnitz University of Technology",
  potsdam: "University of Potsdam",
  viadrina: "European University Viadrina",
  btucottbus: "Brandenburg University of Technology Cottbus-Senftenberg",
  wuerzburg: "Julius-Maximilians-Universität Würzburg",
  regensburg: "University of Regensburg",
  passau: "University of Passau",
  bayreuth: "University of Bayreuth",
  augsburg: "University of Augsburg",
  bamberg: "University of Bamberg",
  kueichstaett: "Catholic University of Eichstätt-Ingolstadt",
  hohenheim: "University of Hohenheim",
  ulm: "Ulm University",
  saarland: "Saarland University",
  rptu: "RPTU University Kaiserslautern-Landau",
  oldenburg: "University of Oldenburg",
  hildesheim: "University of Hildesheim",
  leuphana: "Leuphana University Lüneburg",
  vechta: "University of Vechta",
};

async function getJson(params) {
  const url = `${API}?${new URLSearchParams(params)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Studiva data sync)" }, signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`DAAD API ${res.status} for ${url}`);
  return res.json();
}

const all = await getJson({ q: "", limit: "5000", offset: "0", display: "list" });
if (all.courses.length !== all.numResults) throw new Error(`Expected ${all.numResults} courses, got ${all.courses.length}`);

// Resolve DAAD's institution IDs (needed for deep links) — one small request per ID.
const insIds = {};
for (const { value } of all.filter.ins) {
  const r = await getJson({ "ins[]": value, limit: "1", offset: "0", display: "list" });
  const name = r.courses[0]?.academy;
  if (name) insIds[name] = value;
  await new Promise((resolve) => setTimeout(resolve, 200));
}

const knownNames = new Set(Object.values(DAAD_NAMES));
const institutions = {};
for (const [slug, name] of Object.entries(DAAD_NAMES)) {
  const degrees = all.courses.filter((c) => c.academy === name && DEGREE_TYPES[c.courseType]);
  const english = degrees.filter((c) => (c.languages ?? []).includes("English"));
  institutions[slug] = {
    daadName: name,
    insId: insIds[name] ?? null,
    degreeProgrammes: degrees.length,
    englishProgrammes: english.length,
    englishBachelor: english.filter((c) => c.courseType === 1).length,
    englishMaster: english.filter((c) => c.courseType === 2).length,
  };
}

const missing = Object.entries(institutions).filter(([, v]) => v.degreeProgrammes === 0).map(([s]) => s);
const unmatched = [...new Set(all.courses.map((c) => c.academy))].filter((n) => !knownNames.has(n)).length;
const out = {
  source: "https://www2.daad.de/deutschland/studienangebote/international-programmes/en/",
  fetchedAt: new Date().toISOString().slice(0, 10),
  totalEntries: all.numResults,
  institutions,
};
fs.writeFileSync(path.join(root, "scripts/data/daad-programmes.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`DAAD: ${all.numResults} entries; ${Object.keys(institutions).length} mapped institutions; ${unmatched} other institutions not in our directory.`);
if (missing.length) console.log("No degree programmes listed for:", missing.join(", "));
