export type UniversityImage = {
  url: string;
  artist: string;
  license: string;
};

// Real campus photos sourced from Wikimedia Commons (freely licensed: CC BY / CC BY-SA / Public Domain / CC0).
export const universityMedia: Record<string, UniversityImage[]> = {
  tum: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/TU_M%C3%BCnchen_GO-2.jpg/1920px-TU_M%C3%BCnchen_GO-2.jpg", artist: "Gras-Ober", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/M%C3%BCnchen_-_TU_M%C3%BCnchen_%28Luftbild%29.jpg/1920px-M%C3%BCnchen_-_TU_M%C3%BCnchen_%28Luftbild%29.jpg", artist: "Maximilian Dörrbecker (Chumwa)", license: "CC BY-SA 2.5" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/TUM_Audimax.jpg", artist: "The original uploader was Benson.by at German Wikipedia.", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/MI-Geb%C3%A4ude_der_TU_M%C3%BCnchen_Magistrale2.JPG/1920px-MI-Geb%C3%A4ude_der_TU_M%C3%BCnchen_Magistrale2.JPG", artist: "TobiasK", license: "CC BY-SA 4.0" },
  ],
  lmu: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Entrance_to_LMU_Munich_main_building.jpg/1920px-Entrance_to_LMU_Munich_main_building.jpg", artist: "Seeott", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/LMU_M%C3%BCnchen_-_Audimax2.JPG/1920px-LMU_M%C3%BCnchen_-_Audimax2.JPG", artist: "Church of emacs", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Lmu_grosse_aula.jpg/1920px-Lmu_grosse_aula.jpg", artist: "Kt80", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Chemistry_faculty_of_the_LMU_2003.JPG/1920px-Chemistry_faculty_of_the_LMU_2003.JPG", artist: "Schtone", license: "CC BY-SA 3.0" },
  ],
  huberlin: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg/1920px-Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg", artist: "Christian Wolf (www.c-w-design.de)", license: "CC BY-SA 3.0 DE" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Alexander_von_Humboldt_Denkmal_-_Humboldt_Universit%C3%A4t_zu_Berlin.jpg/1920px-Alexander_von_Humboldt_Denkmal_-_Humboldt_Universit%C3%A4t_zu_Berlin.jpg", artist: "Christian Wolf (www.c-w-design.de)", license: "CC BY-SA 3.0 DE" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Berlin-Mitte_Bebelplatz1_05-2014.jpg/1920px-Berlin-Mitte_Bebelplatz1_05-2014.jpg", artist: "A.Savin", license: "CC BY-SA 3.0" },
  ],
  rwth: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/SuperC_-_bei_Nacht.jpg/1920px-SuperC_-_bei_Nacht.jpg", artist: "Euku", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/RWTH_Aachen_Hauptgeb%C3%A4ude.jpg/1920px-RWTH_Aachen_Hauptgeb%C3%A4ude.jpg", artist: "א (Aleph)", license: "CC BY-SA 2.5" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/RWTH-H%C3%B6rsaalzentrum_CARL.JPG/1920px-RWTH-H%C3%B6rsaalzentrum_CARL.JPG", artist: "ArthurMcGill", license: "CC BY 3.0" },
  ],
  mannheim: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/SchlossMannheim-Pano-130616.jpg/1920px-SchlossMannheim-Pano-130616.jpg", artist: "Hubert Berberich (HubiB)", license: "CC BY 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Universit%C3%A4t_Mannheim_-_Geb%C3%A4ude_A5.jpg", artist: "WolfgangBo1975", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Uni-Mannheim_Bibliothek.jpg", artist: "Wikimedia Commons contributor", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Innenhof_Sued_Mannheimer_Schloss.jpg/1920px-Innenhof_Sued_Mannheimer_Schloss.jpg", artist: "Immanuel Giel", license: "Public domain" },
  ],
  hm: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Roter_W%C3%BCrfel.jpg/1920px-Roter_W%C3%BCrfel.jpg", artist: "Hochschule München", license: "CC BY-SA 4.0" },
  ],
  frankfurtuas: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/FH-FFM_Building_2_2012-08-01_%2801%29.jpg/1920px-FH-FFM_Building_2_2012-08-01_%2801%29.jpg", artist: "#Reaper", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Fh-frankfurt-am-main-blaue-stundel.jpg", artist: "Fotoinfo", license: "CC BY 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/FH-FFM_Building_3_2012-08-01_%2801%29.jpg/1920px-FH-FFM_Building_3_2012-08-01_%2801%29.jpg", artist: "#Reaper", license: "CC BY-SA 3.0" },
  ],
  dhbw: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Berufsakademie_Stuttgart_%28Kronenstra%C3%9Fe_53%29-2.jpg/1920px-Berufsakademie_Stuttgart_%28Kronenstra%C3%9Fe_53%29-2.jpg", artist: "Stefan-Xp", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/BA_Roteb%C3%BChl.jpg", artist: "Stefan-Xp, reworked by C124", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/090321_DHBW_MA_Infotag2.JPG/1920px-090321_DHBW_MA_Infotag2.JPG", artist: "DHBW Mannheim", license: "Copyrighted free use" },
  ],
  iu: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/IUBH_Erfurt%2C_Juri-Gagarin-Ring.JPG/1920px-IUBH_Erfurt%2C_Juri-Gagarin-Ring.JPG", artist: "Gmünder", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/IU_Internationale_Hochschule_Cologne_3.jpg/1920px-IU_Internationale_Hochschule_Cologne_3.jpg", artist: "Czalex", license: "CC0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Bad-honnef-FH01.jpg/1920px-Bad-honnef-FH01.jpg", artist: "A.Savin", license: "CC BY-SA 3.0" },
  ],
  fom: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/D%C3%BCsseldorf-Derendorf%3B_FOM_Hochschule_2016.jpg/1920px-D%C3%BCsseldorf-Derendorf%3B_FOM_Hochschule_2016.jpg", artist: "colling-architektur", license: "CC BY-SA 3.0" },
  ],
  heidelberg: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/86/2005_uni-03.jpg", artist: "JimmeyTimmey at en.wikipedia", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Heidlbergaula.JPG", artist: "Lear 21", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Heidelberg_Universit%C3%A4tsbibliothek_2003_b.jpg/1920px-Heidelberg_Universit%C3%A4tsbibliothek_2003_b.jpg", artist: "Wikimedia Commons contributor", license: "CC BY-SA 2.0" },
  ],
  tuebingen: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Uni_T%C3%BCbingen_Kupferbau.jpg", artist: "Wikimedia Commons contributor", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/81/Uni_T%C3%BCbingen_Neue_Aula_Sommer.jpg", artist: "Prissantenbär", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/T%C3%BCbingen_Alte_Aula_BW_2015-04-27_15-48-31.jpg/1920px-T%C3%BCbingen_Alte_Aula_BW_2015-04-27_15-48-31.jpg", artist: "Berthold Werner", license: "CC BY-SA 4.0" },
  ],
  kit: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Fridericiana_audimax.jpg", artist: "Tobias Helfrich", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Otto-Ammann-Platz_1_Karlsruhe_2.JPG/1920px-Otto-Ammann-Platz_1_Karlsruhe_2.JPG", artist: "Dr. Bernd Gross", license: "CC BY-SA 3.0" },
  ],
  freiburg: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Universit%C3%A4t_Freiburg_Kollegiengeb%C3%A4ude_I_%28Altbau%29.jpg", artist: "Wikimedia Commons contributor", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/KG_II.JPG/1920px-KG_II.JPG", artist: "Andreas Schwarzkopf", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Unibibliothek_Freiburg.JPG/1920px-Unibibliothek_Freiburg.JPG", artist: "Peitho84", license: "CC BY 3.0" },
  ],
  goettingen: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Goe_Sternwarte_pano.jpg/1920px-Goe_Sternwarte_pano.jpg", artist: "Daniel Schwen", license: "CC BY-SA 2.5" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/G%C3%B6ttingen_asv2022-06_img07_Paulinerkirche.jpg/1920px-G%C3%B6ttingen_asv2022-06_img07_Paulinerkirche.jpg", artist: "A.Savin", license: "FAL" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/G%C3%B6ttingen_asv2022-06_img42_Uni_Aula_Wilhelmsplatz.jpg/1920px-G%C3%B6ttingen_asv2022-06_img42_Uni_Aula_Wilhelmsplatz.jpg", artist: "A.Savin", license: "FAL" },
  ],
  bonn: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Bonn_Hofgarten.jpg", artist: "Hans Weingartz", license: "CC BY-SA 2.0 de" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Poppelsdorfer_Schloss.jpg/1920px-Poppelsdorfer_Schloss.jpg", artist: "Thomas Wolf (Der Wolf im Wald)", license: "CC BY-SA 2.5" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/2013-10-05-bonn-universitaet-innenansicht-aula-02.jpg/1920px-2013-10-05-bonn-universitaet-innenansicht-aula-02.jpg", artist: "Axel Kirch", license: "CC BY-SA 4.0" },
  ],
  koeln: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Universitat_zu_K%C3%B6ln_Hauptgeb%C3%A4ude_ost.jpg", artist: "UzK", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Unibibl-koeln.jpg/1920px-Unibibl-koeln.jpg", artist: "A.Savin", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Hauptgeb%C3%A4ude_der_Universit%C3%A4t_zu_K%C3%B6ln-5634.jpg/1920px-Hauptgeb%C3%A4ude_der_Universit%C3%A4t_zu_K%C3%B6ln-5634.jpg", artist: "Raimond Spekking", license: "CC BY-SA 4.0" },
  ],
  tuberlin: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Zentralbibliothek_der_TU_und_UDK%2C_n%C3%A4chtliches_Lichtspiel.jpg/1920px-Zentralbibliothek_der_TU_und_UDK%2C_n%C3%A4chtliches_Lichtspiel.jpg", artist: "Florian Lindner", license: "CC BY 2.5" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Berlin_Charlottenburg_TU_ZEMS.jpg", artist: "Nikolai Schwerg", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/TU_Berlin_Hauptgebaeude070710_UlrichDahl.jpg/1920px-TU_Berlin_Hauptgebaeude070710_UlrichDahl.jpg", artist: "TU Berlin/Pressestelle/Ulrich Dahl", license: "Copyrighted free use" },
  ],
  tudresden: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/a8/TU_Dresden_Campus_2024_Luftbild_Toni_Klemm_2500px.jpg", artist: "Toniklemm", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/20061118080DR_Georg-Schumann-Bau_der_TU_Dresden.jpg", artist: "Jörg Blobelt", license: "CC BY-SA 4.0" },
  ],
  tudarmstadt: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/TU_Darmstadt_Library_and_Main_Building.jpg", artist: "Omiyawaki", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/a5/TU_Darmstadt_CampusLichtwieseMitteVomOberstenStockDesL101.jpg", artist: "ThomasGP", license: "CC BY-SA 4.0" },
  ],
  tubraunschweig: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/69/BS_Hoersaalgebaeude_BI84.JPG", artist: "TeWeBs", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Campomat_TU_Braunschweig_2025_%28Brunswyk%29.jpg", artist: "Brunswyk", license: "CC BY-SA 4.0" },
  ],
  hannover: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Former_Welfenschloss_Leibniz_Universitaet_Hannover_Am_Welfengarten_1_Nordstadt_Hannover_Germany.jpg", artist: "Christian A. Schröder (ChristianSchd)", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/1/11/Marstall_building_Leibniz_Universitaet_Hannover_Welfengarten_Hanover_Germany.jpg", artist: "ChristianSchd", license: "CC BY-SA 4.0" },
  ],
  stuttgart: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/66/Haus_der_Studierenden_Campus_Vaihingen.jpg", artist: "Tataffe", license: "CC BY-SA 3.0 de" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Ausblick_Richtung_Universit%C3%A4t_Stuttgart_-_panoramio.jpg", artist: "qwesy qwesy", license: "CC BY 3.0" },
  ],
  konstanz: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/84/2017-08-31_Konstanz_Uni.jpg", artist: "Bernhard Uff dem Sand", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Exponierte_Lage%2C_Universit%C3%A4t_Konstanz.jpg", artist: "JoachimKohler-HB", license: "CC BY-SA 4.0" },
  ],
  htwberlin: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/da/Obersch%C3%B6neweide_Johannes-Kraatz-Stra%C3%9Fe_Hochschule_f%C3%BCr_Technik_und_Wirtschaft_Berlin_-001.jpg", artist: "Fridolin freudenfett", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Innenhof_Hochschule_f%C3%BCr_Technik_und_Wirtschaft_Berlin_2018-05-26_%281%29.jpg", artist: "Z thomas", license: "CC BY-SA 4.0" },
  ],
  furtwangen: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/7/71/HFU_Main_Building.JPG", artist: "Divakar246448", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/0/02/HFU_Main_Campus.jpg", artist: "Divakar246448", license: "CC BY-SA 3.0" },
  ],
};

// Official university logos, used on list/preview cards.
export const universityLogos: Record<string, UniversityImage> = {
  lmu: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/LMU_Muenchen_Logo.svg/960px-LMU_Muenchen_Logo.svg.png", artist: "Ludwig-Maximilians-Universität München", license: "Public domain" },
  huberlin: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Huberlin-logo.svg/960px-Huberlin-logo.svg.png", artist: "Humboldt-Universität Berlin", license: "Public domain" },
  mannheim: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/University_of_Mannheim.svg/960px-University_of_Mannheim.svg.png", artist: "University of Mannheim", license: "Public domain" },
  rwth: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/RWTH_Logo_3.svg/960px-RWTH_Logo_3.svg.png", artist: "The original uploader was Wwbread at Chinese Wikipedia.", license: "Public domain" },
  tum: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_of_the_Technical_University_of_Munich.svg/960px-Logo_of_the_Technical_University_of_Munich.svg.png", artist: "TUM ccc", license: "Public domain" },
  fom: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hochschule_f%C3%BCr_Oekonomie_%26_Management_2012_logo.svg/960px-Hochschule_f%C3%BCr_Oekonomie_%26_Management_2012_logo.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  frankfurtuas: { url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo-fu%402x.png", artist: "FH Frankfurt", license: "Public domain" },
  hm: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/HM_Logo_RGB.png/960px-HM_Logo_RGB.png", artist: "Keller Maurer Design", license: "Public domain" },
  iu: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Iu_German_black_RGB_horizontal.svg/960px-Iu_German_black_RGB_horizontal.svg.png", artist: "IU Internationale Hochschule", license: "Public domain" },
  kit: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_KIT.svg/960px-Logo_KIT.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  heidelberg: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Ruprecht-Karls-Universit%C3%A4t_Heidelberg_Logo.svg/960px-Ruprecht-Karls-Universit%C3%A4t_Heidelberg_Logo.svg.png", artist: "Original: Tou-x Vector:  Lệ Xuân", license: "Public domain" },
  freiburg: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wortmarke-grundform-universitaet_freiburg_blau_rgb.png/960px-Wortmarke-grundform-universitaet_freiburg_blau_rgb.png", artist: "Universität Freiburg", license: "CC BY-SA 4.0" },
  goettingen: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logo_Uni_G%C3%B6ttingen.svg/960px-Logo_Uni_G%C3%B6ttingen.svg.png", artist: "Universität Göttingen", license: "Public domain" },
  bonn: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Universit%C3%A4t_Bonn.svg/960px-Universit%C3%A4t_Bonn.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  tuberlin: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/LogoDerTechnischenUniversit%C3%A4tBerlin2020.svg/960px-LogoDerTechnischenUniversit%C3%A4tBerlin2020.svg.png", artist: "TU Berlin", license: "Public domain" },
  koeln: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Universitaet_zu_Koeln_Logo_ENG.jpg/960px-Universitaet_zu_Koeln_Logo_ENG.jpg", artist: "JVoeKoeln", license: "CC BY-SA 4.0" },
  dhbw: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/DHBW_d_MOS_195x95_rgb_300.jpg", artist: "DHBW", license: "Public domain" },
  tudresden: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_TU_Dresden_2025.svg", artist: "TU Dresden, Agentur 3pc", license: "Public domain" },
  tudarmstadt: { url: "https://upload.wikimedia.org/wikipedia/commons/2/24/TU_Darmstadt_Logo.svg", artist: "Hermann Eidenbenz", license: "CC BY-SA 4.0" },
  tubraunschweig: { url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Siegel_TU_Braunschweig_transparent.svg", artist: "TU Braunschweig", license: "Public domain" },
  konstanz: { url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_Universit%C3%A4t_Konstanz.png", artist: "Universität Konstanz", license: "Public domain" },
  htwberlin: { url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/HTW_Berlin_logo.svg", artist: "HTW Berlin", license: "Public domain" },
  furtwangen: { url: "https://upload.wikimedia.org/wikipedia/commons/1/11/Furtwangen_University_Logo.jpg", artist: "Divakar246448", license: "CC BY-SA 3.0" },
};

