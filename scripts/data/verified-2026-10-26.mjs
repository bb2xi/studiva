// Facts verified on 2026-10-26 against the sources named below. Every source
// URL was fetched (or, for official homepages, requested and its page title
// checked) on that date. Anything not verified is left null on purpose.

export const CHECKED_AT = "2026-10-26";

export const SOURCES = {
  bw: "https://mwk.baden-wuerttemberg.de/de/hochschulen-studium/studieren-in-bw/studienfinanzierung/gebuehren-fuer-internationale-studierende-und-zweitstudium/tuition-fees-for-international-students",
  daad: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/",
  uniAssist: "https://www.uni-assist.de/en/tools/uni-assist-universities/",
  tum: "https://www.tum.de/en/studies/fees/tuition",
  hm: "https://hm.edu/studium_1/bewerbung/faq_gebuehren_non_eu_auslaender.de.html",
  thi: "https://www.thi.de/en/studies/international-degree-students/tuition-fees/",
  fau: "https://www.fau.de/studium/international-studierende/bewerbung-und-einschreibung-fuer-internationale/studiengebuehren-fuer-studierende-aus-nicht-eu-staaten",
};

export const OFFICIAL_URLS = {
  tum: "https://www.tum.de", lmu: "https://www.lmu.de", huberlin: "https://www.hu-berlin.de",
  rwth: "https://www.rwth-aachen.de", mannheim: "https://www.uni-mannheim.de", hm: "https://hm.edu",
  frankfurtuas: "https://www.frankfurt-university.de", dhbw: "https://www.dhbw.de", iu: "https://www.iu.de",
  fom: "https://www.fom.de", heidelberg: "https://www.uni-heidelberg.de", tuebingen: "https://uni-tuebingen.de",
  kit: "https://www.kit.edu", freiburg: "https://uni-freiburg.de", goettingen: "https://www.uni-goettingen.de",
  bonn: "https://www.uni-bonn.de", koeln: "https://uni-koeln.de", tuberlin: "https://www.tu.berlin",
  tudresden: "https://tu-dresden.de", tudarmstadt: "https://www.tu-darmstadt.de", tubraunschweig: "https://www.tu-braunschweig.de",
  hannover: "https://www.uni-hannover.de", stuttgart: "https://www.uni-stuttgart.de", konstanz: "https://www.uni-konstanz.de",
  htwberlin: "https://www.htw-berlin.de", furtwangen: "https://www.hs-furtwangen.de", hamburg: "https://www.uni-hamburg.de",
  fuberlin: "https://www.fu-berlin.de", erlangen: "https://www.fau.de", bochum: "https://www.ruhr-uni-bochum.de",
  mainz: "https://www.uni-mainz.de", muenster: "https://www.uni-muenster.de", bremen: "https://www.uni-bremen.de",
  kiel: "https://www.uni-kiel.de", marburg: "https://www.uni-marburg.de", jena: "https://www.uni-jena.de",
  thkoeln: "https://www.th-koeln.de", hsmannheim: "https://www.hs-mannheim.de", hskarlsruhe: "https://www.h-ka.de",
  htwgkonstanz: "https://www.htwg-konstanz.de", thingolstadt: "https://www.thi.de", hbrs: "https://www.h-brs.de",
  hda: "https://h-da.de", reutlingen: "https://www.reutlingen-university.de", fhmuenster: "https://www.fh-muenster.de",
  osnabrueck: "https://www.hs-osnabrueck.de", bht: "https://www.bht-berlin.de", jade: "https://www.jade-hs.de",
  duesseldorf: "https://www.hhu.de", ude: "https://www.uni-due.de", tudortmund: "https://www.tu-dortmund.de",
  bielefeld: "https://www.uni-bielefeld.de", paderborn: "https://www.uni-paderborn.de", siegen: "https://www.uni-siegen.de",
  wuppertal: "https://www.uni-wuppertal.de", luebeck: "https://www.uni-luebeck.de", rostock: "https://www.uni-rostock.de",
  greifswald: "https://www.uni-greifswald.de", magdeburg: "https://www.ovgu.de", halle: "https://www.uni-halle.de",
  leipzig: "https://www.uni-leipzig.de", tuchemnitz: "https://www.tu-chemnitz.de", potsdam: "https://www.uni-potsdam.de",
  viadrina: "https://www.europa-uni.de", btucottbus: "https://www.b-tu.de", wuerzburg: "https://www.uni-wuerzburg.de",
  regensburg: "https://www.uni-regensburg.de", passau: "https://www.uni-passau.de", bayreuth: "https://www.uni-bayreuth.de",
  augsburg: "https://www.uni-augsburg.de", bamberg: "https://www.uni-bamberg.de", kueichstaett: "https://www.ku.de",
  hohenheim: "https://www.uni-hohenheim.de", ulm: "https://www.uni-ulm.de", saarland: "https://www.uni-saarland.de",
  rptu: "https://rptu.de", fernunihagen: "https://www.fernuni-hagen.de", oldenburg: "https://uol.de",
  hildesheim: "https://www.uni-hildesheim.de", leuphana: "https://www.leuphana.de", tuclausthal: "https://www.tu-clausthal.de",
  vechta: "https://www.uni-vechta.de",
};

/** Legal seat state. IU and FOM are listed under their seat (Erfurt, Essen) but run campuses nationwide. */
export const STATE = {
  BW: ["mannheim", "dhbw", "heidelberg", "tuebingen", "kit", "freiburg", "stuttgart", "konstanz", "furtwangen", "hsmannheim", "hskarlsruhe", "htwgkonstanz", "reutlingen", "hohenheim", "ulm"],
  BY: ["tum", "lmu", "hm", "erlangen", "thingolstadt", "wuerzburg", "regensburg", "passau", "bayreuth", "augsburg", "bamberg", "kueichstaett"],
  BE: ["huberlin", "tuberlin", "htwberlin", "fuberlin", "bht"],
  BB: ["potsdam", "viadrina", "btucottbus"],
  HB: ["bremen"],
  HH: ["hamburg"],
  HE: ["frankfurtuas", "tudarmstadt", "marburg", "hda"],
  MV: ["rostock", "greifswald"],
  NI: ["goettingen", "tubraunschweig", "hannover", "osnabrueck", "jade", "oldenburg", "hildesheim", "leuphana", "tuclausthal", "vechta"],
  NW: ["rwth", "fom", "bonn", "koeln", "bochum", "muenster", "thkoeln", "hbrs", "fhmuenster", "duesseldorf", "ude", "tudortmund", "bielefeld", "paderborn", "siegen", "wuppertal", "fernunihagen"],
  RP: ["mainz", "rptu"],
  SL: ["saarland"],
  SN: ["tudresden", "leipzig", "tuchemnitz"],
  ST: ["magdeburg", "halle"],
  SH: ["kiel", "luebeck"],
  TH: ["jena", "iu"],
};

export const OWNERSHIP_EXCEPTIONS = { iu: "private", fom: "private", kueichstaett: "church" };

export const UNI_ASSIST_MEMBERS = [
  "ulm", "wuerzburg", "kueichstaett", "lmu", "hm", "tum", "thingolstadt", "augsburg", "passau", "bayreuth", "regensburg",
  "bht", "fuberlin", "htwberlin", "huberlin", "tuberlin", "btucottbus", "viadrina", "potsdam", "bremen",
  "frankfurtuas", "hda", "marburg", "oldenburg", "jade", "hannover", "leuphana", "osnabrueck", "hildesheim",
  "greifswald", "rostock", "bielefeld", "duesseldorf", "hbrs", "paderborn", "thkoeln", "tudortmund", "koeln", "ude",
  "wuppertal", "rptu", "saarland", "tuchemnitz", "leipzig", "tudresden", "halle", "magdeburg", "kiel", "luebeck",
];

const BW_NOTE = {
  en: "Baden-Württemberg charges non-EU students €1,500 per semester at state institutions (since WiSe 2017/18). Exemptions exist, e.g. for some exchange students.",
  tr: "Baden-Württemberg, eyalet yükseköğretim kurumlarında AB dışından gelen öğrencilerden dönem başına 1.500 € alır (WiSe 2017/18'den beri). Bazı değişim öğrencileri gibi muafiyetler vardır.",
};

/** Institution-specific findings; everything else derives from the state baseline below. */
export const TUITION = {
  tum: {
    status: "varies", minEur: 2000, maxEur: 6000, source: SOURCES.tum,
    noteEn: "Usually €2,000/3,000 per semester for bachelor's and €4,000/6,000 for master's; rising for new students from WiSe 2027/28. Turkish citizens are exempt only under specific family-residence conditions.",
    noteTr: "Lisansta genellikle dönem başına 2.000/3.000 €, yüksek lisansta 4.000/6.000 €; WiSe 2027/28'den itibaren yeni öğrenciler için artıyor. Türk vatandaşları yalnızca belirli aile/ikamet koşullarında muaf.",
  },
  hm: {
    status: "varies", minEur: 500, maxEur: 700, source: SOURCES.hm,
    noteEn: "€500 per semester for bachelor's and €700 for master's, for non-EU students newly enrolling from WiSe 2026/27.",
    noteTr: "WiSe 2026/27'den itibaren yeni kayıt olan AB dışı öğrenciler için lisansta dönem başına 500 €, yüksek lisansta 700 €.",
  },
  thingolstadt: {
    status: "varies", minEur: 800, maxEur: 1200, source: SOURCES.thi,
    noteEn: "€800 per semester for bachelor's and €1,200 for master's for students from non-EU countries, from the summer semester 2026.",
    noteTr: "Yaz dönemi 2026'dan itibaren AB dışı öğrenciler için lisansta dönem başına 800 €, yüksek lisansta 1.200 €.",
  },
  erlangen: {
    status: "varies", minEur: 1000, maxEur: 6000, source: SOURCES.fau,
    noteEn: "No tuition for current enrolments; non-EU students enrolling or changing programme from the summer semester 2027 pay €1,000–6,000 per semester depending on programme.",
    noteTr: "Mevcut kayıtlar için ücret yok; yaz dönemi 2027'den itibaren kayıt olan veya program değiştiren AB dışı öğrenciler programa göre dönem başına 1.000–6.000 € öder.",
  },
  lmu: {
    status: "unknown", minEur: null, maxEur: null, source: null,
    noteEn: "Bavarian law lets universities charge non-EU students. As of October 2026, fees at LMU were reported as under discussion with no published decision — check LMU directly.",
    noteTr: "Bavyera yasası üniversitelerin AB dışı öğrencilerden ücret almasına izin veriyor. Ekim 2026 itibarıyla LMU'da ücretin tartışıldığı bildirildi, yayımlanmış bir karar yok — doğrudan LMU'ya danışın.",
  },
  iu: {
    status: "charged", minEur: null, maxEur: null, source: null,
    noteEn: "Private, state-recognised institution: tuition depends on the programme and study model — see its official price information.",
    noteTr: "Özel, devletçe tanınan kurum: okul ücreti programa ve çalışma modeline göre değişir — resmî fiyat bilgisine bakın.",
  },
  fom: {
    status: "charged", minEur: null, maxEur: null, source: null,
    noteEn: "Private, state-recognised institution: tuition depends on the programme — see its official price information.",
    noteTr: "Özel, devletçe tanınan kurum: okul ücreti programa göre değişir — resmî fiyat bilgisine bakın.",
  },
};

const BAVARIA_UNKNOWN = {
  status: "unknown", minEur: null, maxEur: null, source: null,
  noteEn: "Bavarian law lets each institution decide on fees for non-EU students. We found no published fee decision for this institution — confirm with its admissions office.",
  noteTr: "Bavyera yasası AB dışı öğrenciler için ücret kararını her kuruma bırakıyor. Bu kurum için yayımlanmış bir ücret kararı bulamadık — kabul ofisine danışın.",
};

const NO_TUITION = {
  status: "none", minEur: null, maxEur: null, source: SOURCES.daad,
  noteEn: "No general tuition for a first bachelor's or most master's degrees at state institutions; some individual master's programmes and second degrees can cost extra.",
  noteTr: "Devlet kurumlarında ilk lisans ve çoğu yüksek lisans için genel bir okul ücreti yok; bazı yüksek lisans programları ve ikinci diplomalar ek ücretli olabilir.",
};

const SAXONY_NOTE = {
  en: " Saxony: a bill to introduce non-EU fees was heard in parliament in 2026 but had not been passed as of our check.",
  tr: " Saksonya: AB dışı öğrencilere ücret getiren bir tasarı 2026'da mecliste görüşüldü, kontrolümüz itibarıyla yasalaşmamıştı.",
};

export function tuitionFor(slug, state) {
  if (TUITION[slug]) return TUITION[slug];
  if (state === "BW") return { status: "charged", minEur: 1500, maxEur: 1500, source: SOURCES.bw, noteEn: BW_NOTE.en, noteTr: BW_NOTE.tr };
  if (state === "BY") return BAVARIA_UNKNOWN;
  if (state === "SN") return { ...NO_TUITION, noteEn: NO_TUITION.noteEn + SAXONY_NOTE.en, noteTr: NO_TUITION.noteTr + SAXONY_NOTE.tr };
  return NO_TUITION;
}

export const INTERNATIONAL_URLS = {
  tum: "https://www.tum.de/en/studies/international-students/",
  thingolstadt: "https://www.thi.de/en/studies/international-degree-students/tuition-fees/",
};

export const OFFICIAL_NAMES = { hsmannheim: "Technische Hochschule Mannheim" };
