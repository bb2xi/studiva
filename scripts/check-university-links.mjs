// Re-checks every official/international/source URL in src/data/university-facts.json
// and reports field completeness. Run periodically (e.g. before each semester):
//   node scripts/check-university-links.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { records, generatedAt } = JSON.parse(fs.readFileSync(path.join(root, "src/data/university-facts.json"), "utf8"));

const urls = new Map();
for (const r of Object.values(records)) {
  for (const [field, url] of [
    ["officialUrl", r.officialUrl],
    ["internationalUrl", r.internationalUrl],
    ["nonEuTuition.source", r.nonEuTuition.source],
    ["semesterContribution.source", r.semesterContribution.source],
    ["uniAssistSource", r.uniAssistSource],
    ["englishTaughtSource", r.englishTaughtSource],
  ]) {
    if (!url) continue;
    if (!urls.has(url)) urls.set(url, []);
    urls.get(url).push(`${r.slug}.${field}`);
  }
}

async function check(url) {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (Studiva link check)" }, signal: AbortSignal.timeout(15000) });
    return res.status;
  } catch (err) {
    return `error: ${err.cause?.code ?? err.name}`;
  }
}

const broken = [];
const entries = [...urls.entries()];
for (let i = 0; i < entries.length; i += 8) {
  const batch = entries.slice(i, i + 8);
  const results = await Promise.all(batch.map(([url]) => check(url)));
  batch.forEach(([url, refs], j) => {
    const status = results[j];
    if (status !== 200) broken.push({ url, status, refs });
  });
}

const fields = ["officialUrl", "internationalUrl", "state", "ownership", "nonEuTuition", "semesterContribution", "uniAssistMember", "englishTaught", "subjectAreas"];
const filled = Object.fromEntries(fields.map((f) => [f, 0]));
for (const r of Object.values(records)) {
  if (r.officialUrl) filled.officialUrl++;
  if (r.internationalUrl) filled.internationalUrl++;
  if (r.state) filled.state++;
  if (r.ownership) filled.ownership++;
  if (r.nonEuTuition.status !== "unknown") filled.nonEuTuition++;
  if (r.semesterContribution.amountEur !== null) filled.semesterContribution++;
  if (r.uniAssistMember !== null) filled.uniAssistMember++;
  if (r.englishTaught !== null) filled.englishTaught++;
  if (r.subjectAreas) filled.subjectAreas++;
}

const total = Object.keys(records).length;
console.log(`Data generated ${generatedAt}; ${total} records; ${urls.size} distinct URLs checked.`);
console.log("Field coverage:", Object.entries(filled).map(([f, n]) => `${f} ${n}/${total}`).join(", "));
if (broken.length) {
  console.log(`\n${broken.length} URL(s) did not return 200:`);
  for (const b of broken) console.log(`  ${b.status}  ${b.url}  (${b.refs.join(", ")})`);
  process.exitCode = 1;
} else {
  console.log("All URLs returned 200.");
}
