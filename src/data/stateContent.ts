import type { StateCode } from "@/lib/discovery/types";

export const STATE_POLICY_CHECKED_AT = "2026-10-26";
const DAAD = "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/";
const BW = "https://mwk.baden-wuerttemberg.de/de/hochschulen-studium/studieren-in-bw/studienfinanzierung/gebuehren-fuer-internationale-studierende-und-zweitstudium/tuition-fees-for-international-students";

type Text = { en: string; tr: string };
export type StateContent = {
  intro: Text;
  policy: { status: "none" | "statewide" | "institution"; text: Text; source: string };
};

const NONE: StateContent["policy"] = {
  status: "none",
  text: {
    en: "No general tuition fee for non-EU students in a first bachelor's or most master's degrees at state institutions. Some states charge fees for second degrees or long study durations.",
    tr: "Devlet kurumlarında ilk lisans ve çoğu yüksek lisans için AB dışı öğrencilere genel bir okul ücreti yok. Bazı eyaletler ikinci diploma veya uzun öğrenim süresi için ücret alır.",
  },
  source: DAAD,
};

export const STATE_CONTENT: Record<StateCode, StateContent> = {
  BW: {
    intro: {
      en: "Baden-Württemberg, in Germany's south-west, has one of the densest concentrations of research universities in the country — Heidelberg, Tübingen, Freiburg and KIT in Karlsruhe among them — alongside a strong network of universities of applied sciences and the cooperative state university DHBW. The Stuttgart region is a centre of automotive and mechanical engineering, which shapes many applied programmes.",
      tr: "Almanya'nın güneybatısındaki Baden-Württemberg, Heidelberg, Tübingen, Freiburg ve Karlsruhe'deki KIT gibi araştırma üniversitelerinin en yoğun olduğu eyaletlerden biridir; buna güçlü bir uygulamalı bilimler üniversiteleri ağı ve ikili eğitim üniversitesi DHBW eşlik eder. Stuttgart bölgesi otomotiv ve makine mühendisliğinin merkezlerindendir ve bu, birçok uygulamalı programa yön verir.",
    },
    policy: {
      status: "statewide",
      text: {
        en: "State law sets a tuition fee of €1,500 per semester for students who come from outside the EU to study (since WiSe 2017/18), with exemptions for some groups. This applies to Turkish citizens.",
        tr: "Eyalet yasası, okumak için AB dışından gelen öğrencilere dönem başına 1.500 € okul ücreti uygular (WiSe 2017/18'den beri); bazı gruplar için muafiyetler vardır. Türk vatandaşları için de geçerlidir.",
      },
      source: BW,
    },
  },
  BY: {
    intro: {
      en: "Bavaria is Germany's largest state by area. Munich alone hosts TUM, LMU and Munich University of Applied Sciences, while Würzburg, Regensburg, Erlangen–Nuremberg, Bamberg, Bayreuth, Augsburg and Passau make the rest of the state an equally strong study destination.",
      tr: "Bavyera, yüzölçümü bakımından Almanya'nın en büyük eyaletidir. Yalnızca Münih'te TUM, LMU ve Münih Uygulamalı Bilimler Üniversitesi bulunur; Würzburg, Regensburg, Erlangen–Nürnberg, Bamberg, Bayreuth, Augsburg ve Passau ise eyaletin geri kalanını da güçlü bir eğitim adresi yapar.",
    },
    policy: {
      status: "institution",
      text: {
        en: "Bavarian law lets each institution decide whether to charge non-EU students. Several now do (for example TUM, HM Munich and TH Ingolstadt; FAU from the summer semester 2027), while others — such as Würzburg, Regensburg, Passau and Augsburg — state that they charge no tuition. Check each university's page in our directory.",
        tr: "Bavyera yasası, AB dışı öğrencilerden ücret alıp almamaya her kurumun kendisinin karar vermesine izin verir. Bazıları artık ücret alıyor (ör. TUM, HM Münih ve TH Ingolstadt; FAU yaz dönemi 2027'den itibaren); Würzburg, Regensburg, Passau ve Augsburg gibi diğerleri ise okul ücreti almadığını belirtiyor. Rehberimizdeki her üniversitenin sayfasını kontrol edin.",
      },
      source: DAAD,
    },
  },
  BE: {
    intro: {
      en: "Berlin is both a city and a federal state. Its three large universities — Freie Universität, Humboldt-Universität and TU Berlin — sit alongside universities of applied sciences such as HTW and BHT, in a capital with a large international student community.",
      tr: "Berlin hem bir şehir hem de bir eyalettir. Üç büyük üniversitesi — Freie Universität, Humboldt-Universität ve TU Berlin — HTW ve BHT gibi uygulamalı bilimler üniversiteleriyle birlikte, geniş bir uluslararası öğrenci topluluğuna sahip başkentte yer alır.",
    },
    policy: NONE,
  },
  BB: {
    intro: {
      en: "Brandenburg surrounds Berlin. Potsdam, Frankfurt (Oder) on the Polish border and Cottbus host its universities — including the European University Viadrina, known for its German–Polish cross-border profile.",
      tr: "Brandenburg, Berlin'i çevreler. Üniversiteleri Potsdam'da, Polonya sınırındaki Frankfurt (Oder)'de ve Cottbus'ta yer alır; Alman–Polonya sınır ötesi profiliyle bilinen Europa-Universität Viadrina da bunlardan biridir.",
    },
    policy: NONE,
  },
  HB: {
    intro: {
      en: "Bremen is Germany's smallest state, made up of the cities of Bremen and Bremerhaven. The University of Bremen is its largest institution, with a strong profile in marine, climate and engineering research.",
      tr: "Bremen, Bremen ve Bremerhaven şehirlerinden oluşan Almanya'nın en küçük eyaletidir. En büyük kurumu Bremen Üniversitesi'dir; deniz, iklim ve mühendislik araştırmalarında güçlü bir profile sahiptir.",
    },
    policy: NONE,
  },
  HH: {
    intro: {
      en: "Hamburg, a city-state and Germany's largest port, is home to Universität Hamburg — one of the country's largest universities — and a range of specialised institutions.",
      tr: "Bir şehir-eyalet ve Almanya'nın en büyük limanı olan Hamburg, ülkenin en büyük üniversitelerinden Universität Hamburg'a ve çeşitli uzmanlaşmış kurumlara ev sahipliği yapar.",
    },
    policy: NONE,
  },
  HE: {
    intro: {
      en: "Hesse combines the Frankfurt Rhine-Main business region with historic university towns. Our directory covers TU Darmstadt and Hochschule Darmstadt, Frankfurt University of Applied Sciences and the University of Marburg.",
      tr: "Hessen, Frankfurt Ren-Main iş bölgesini tarihî üniversite şehirleriyle bir araya getirir. Rehberimiz TU Darmstadt ve Hochschule Darmstadt'ı, Frankfurt Uygulamalı Bilimler Üniversitesi'ni ve Marburg Üniversitesi'ni kapsar.",
    },
    policy: NONE,
  },
  MV: {
    intro: {
      en: "Mecklenburg-Western Pomerania on the Baltic coast has two historic universities, Rostock and Greifswald — both among the oldest in northern Europe — in smaller cities with comparatively calm student life.",
      tr: "Baltık kıyısındaki Mecklenburg-Vorpommern'in iki tarihî üniversitesi vardır: Rostock ve Greifswald — ikisi de Kuzey Avrupa'nın en eskileri arasındadır ve görece sakin öğrenci yaşamı sunan küçük şehirlerdedir.",
    },
    policy: NONE,
  },
  NI: {
    intro: {
      en: "Lower Saxony is Germany's second-largest state by area. Its universities range from Göttingen and Leibniz Universität Hannover to TU Braunschweig and TU Clausthal, plus Oldenburg, Lüneburg, Hildesheim, Vechta and universities of applied sciences such as Osnabrück and Jade.",
      tr: "Aşağı Saksonya, yüzölçümü bakımından Almanya'nın ikinci büyük eyaletidir. Üniversiteleri Göttingen ve Leibniz Universität Hannover'den TU Braunschweig ve TU Clausthal'a, ayrıca Oldenburg, Lüneburg, Hildesheim, Vechta ile Osnabrück ve Jade gibi uygulamalı bilimler üniversitelerine kadar uzanır.",
    },
    policy: NONE,
  },
  NW: {
    intro: {
      en: "North Rhine-Westphalia is Germany's most populous state and has the most universities in our directory — from RWTH Aachen, Cologne, Bonn and Münster to the Ruhr universities in Bochum, Dortmund and Duisburg-Essen. The dense rail network makes it easy to live in one city and reach others.",
      tr: "Kuzey Ren-Vestfalya, Almanya'nın en kalabalık eyaletidir ve rehberimizde en çok üniversiteye sahip eyalettir — RWTH Aachen, Köln, Bonn ve Münster'den Bochum, Dortmund ve Duisburg-Essen'deki Ruhr üniversitelerine kadar. Yoğun demiryolu ağı, bir şehirde yaşayıp diğerlerine kolayca ulaşmayı sağlar.",
    },
    policy: NONE,
  },
  RP: {
    intro: {
      en: "Rhineland-Palatinate lies along the Rhine and Moselle. Johannes Gutenberg University in the state capital Mainz and RPTU, with campuses in Kaiserslautern and Landau, are its largest universities.",
      tr: "Renanya-Palatina, Ren ve Mosel nehirleri boyunca uzanır. Eyalet başkenti Mainz'daki Johannes Gutenberg Üniversitesi ile Kaiserslautern ve Landau'da kampüsleri bulunan RPTU en büyük üniversiteleridir.",
    },
    policy: NONE,
  },
  SL: {
    intro: {
      en: "Saarland borders France and Luxembourg. Saarland University in Saarbrücken is known for computer science and its French–German orientation.",
      tr: "Saarland, Fransa ve Lüksemburg ile sınır komşusudur. Saarbrücken'deki Saarland Üniversitesi bilgisayar bilimi ve Fransız–Alman yönelimiyle tanınır.",
    },
    policy: NONE,
  },
  SN: {
    intro: {
      en: "Saxony's universities are concentrated in Dresden, Leipzig and Chemnitz. TU Dresden is one of Germany's largest technical universities, and Leipzig University is among the oldest in the country.",
      tr: "Saksonya'nın üniversiteleri Dresden, Leipzig ve Chemnitz'de yoğunlaşır. TU Dresden Almanya'nın en büyük teknik üniversitelerinden biridir; Leipzig Üniversitesi ise ülkenin en eskileri arasındadır.",
    },
    policy: {
      status: "none",
      text: {
        en: "No general tuition fee for non-EU students at state universities as of our check. A bill to introduce non-EU fees was heard in the state parliament in 2026 but had not been passed — check again before you apply.",
        tr: "Kontrolümüz itibarıyla devlet üniversitelerinde AB dışı öğrencilere genel bir okul ücreti yok. AB dışı öğrencilere ücret getiren bir tasarı 2026'da eyalet meclisinde görüşüldü ancak yasalaşmadı — başvurmadan önce tekrar kontrol edin.",
      },
      source: DAAD,
    },
  },
  ST: {
    intro: {
      en: "Saxony-Anhalt's two universities are Otto von Guericke University in the state capital Magdeburg and Martin Luther University in Halle (Saale), whose roots go back to 1502.",
      tr: "Saksonya-Anhalt'ın iki üniversitesi, eyalet başkenti Magdeburg'daki Otto-von-Guericke Üniversitesi ve kökleri 1502'ye uzanan Halle (Saale)'deki Martin-Luther Üniversitesi'dir.",
    },
    policy: NONE,
  },
  SH: {
    intro: {
      en: "Schleswig-Holstein, Germany's northernmost state between the North Sea and the Baltic, is home to Kiel University and the University of Lübeck, which specialises in medicine and life sciences.",
      tr: "Kuzey Denizi ile Baltık arasındaki Almanya'nın en kuzey eyaleti Schleswig-Holstein; Kiel Üniversitesi'ne ve tıp ile yaşam bilimlerinde uzmanlaşmış Lübeck Üniversitesi'ne ev sahipliği yapar.",
    },
    policy: NONE,
  },
  TH: {
    intro: {
      en: "Thuringia in central Germany is home to Friedrich Schiller University Jena, known for optics and photonics. The private IU International University has its legal seat in Erfurt but teaches on campuses across Germany and online.",
      tr: "Orta Almanya'daki Türingiya, optik ve fotonikle tanınan Friedrich-Schiller Üniversitesi Jena'ya ev sahipliği yapar. Özel IU Uluslararası Üniversitesi'nin yasal merkezi Erfurt'tadır, ancak Almanya genelindeki kampüslerde ve çevrimiçi eğitim verir.",
    },
    policy: NONE,
  },
};
