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
};

// ===== New countries (UK, NL, FR, CH, EE, SE, BE, DK) =====
Object.assign(universityMedia, {
  oxford: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/1_oxford_aerial_panorama_2016.jpg/1920px-1_oxford_aerial_panorama_2016.jpg", artist: "Chensiyuan", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bibliotheca_Bodleiana.jpg/1920px-Bibliotheca_Bodleiana.jpg", artist: "Honcques Laus", license: "CC0" },
  ],
  cambridge: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cmglee_Cambridge_Trinity_College_Great_Court.jpg/1920px-Cmglee_Cambridge_Trinity_College_Great_Court.jpg", artist: "Cmglee", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/KingsCollegeChapelWest.jpg", artist: "Andrew Dunn", license: "CC BY-SA 2.0" },
  ],
  imperial: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Imperial_College_-_South_Kensington_Campus.jpg/1920px-Imperial_College_-_South_Kensington_Campus.jpg", artist: "Dmnk.saman", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Royal_School_of_Mines_Imperial_College_London_2020_02.jpg/1920px-Royal_School_of_Mines_Imperial_College_London_2020_02.jpg", artist: "Julian Herzog (Website)", license: "CC BY 4.0" },
  ],
  ucl: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Portico_and_steps%2C_University_College%2C_London_-_geograph.org.uk_-_364428.jpg", artist: "Dr Neil Clifton", license: "CC BY-SA 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Wilkins_Building_1%2C_UCL%2C_London_-_Diliff.jpg/1920px-Wilkins_Building_1%2C_UCL%2C_London_-_Diliff.jpg", artist: "Diliff", license: "CC BY-SA 3.0" },
  ],
  lse: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/7/77/LSE_main_entrance.jpg", artist: "Umezo KAMATA", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/26/HoughtonStreet.jpg", artist: "Mulloom2 at English Wikipedia", license: "CC BY-SA 3.0" },
  ],
  kcl: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/King%27s_College_London_Chapel_2%2C_London_-_Diliff.jpg/1920px-King%27s_College_London_Chapel_2%2C_London_-_Diliff.jpg", artist: "Diliff", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/KCL_King%27s_Building_3_Final.jpg", artist: "KiloCharlieLima", license: "CC BY-SA 4.0" },
  ],
  edinburgh: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Edinburgh%2C_Teviot_Place%2C_University_Of_Edinburgh%2C_Medical_School%2C_New_Building_-_main_quad.jpg/1920px-Edinburgh%2C_Teviot_Place%2C_University_Of_Edinburgh%2C_Medical_School%2C_New_Building_-_main_quad.jpg", artist: "Stinglehammer", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Edinburgh_Architecture_-_The_University_of_Edinburgh_Business_School%2C_Buccleuch_Place_%28geograph_2458971%29.jpg/1920px-Edinburgh_Architecture_-_The_University_of_Edinburgh_Business_School%2C_Buccleuch_Place_%28geograph_2458971%29.jpg", artist: "Richard West", license: "CC BY-SA 2.0" },
  ],
  manchester: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/The_University_of_Manchester_%28with_snow%29.jpg/1920px-The_University_of_Manchester_%28with_snow%29.jpg", artist: "Pete Birkinshaw", license: "CC BY 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Whitworth_Hall_Manchester.jpg", artist: "Stephen Richards", license: "CC BY-SA 2.0" },
  ],
  bristol: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/7/72/Wills_memorial_library.JPG", artist: "Milla and Mark", license: "CC BY 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/University_of_Bristol_buildings.JPG/1920px-University_of_Bristol_buildings.JPG", artist: "Francium12 (talk)", license: "Public domain" },
  ],
  uva: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Maagdenhuis_%28Amsterdam%29.jpg/1920px-Maagdenhuis_%28Amsterdam%29.jpg", artist: "Marcelmulder68", license: "CC BY-SA 3.0 nl" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Oudemannenhuis_Universiteit_van_Amsterdam.JPG/1920px-Oudemannenhuis_Universiteit_van_Amsterdam.JPG", artist: "Marcel mulder", license: "CC BY-SA 3.0 nl" },
  ],
  vu: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/VU_Main_Building_Entrance.jpg/1920px-VU_Main_Building_Entrance.jpg", artist: "Galaufs", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/2/25/VU-campus-01.jpg", artist: "Scientist-100 at English Wikipedia", license: "Public domain" },
  ],
  tudelft: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TU_Delft_Mekelpark.jpg/1920px-TU_Delft_Mekelpark.jpg", artist: "Przemyslaw Pawelczak", license: "CC BY 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Aula_Technical_University_Delft.jpg/1920px-Aula_Technical_University_Delft.jpg", artist: "Fabio Bruna from Den Haag, Netherlands", license: "CC BY-SA 2.0" },
  ],
  utrecht: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Utrecht_Academiegebouw.jpg/1920px-Utrecht_Academiegebouw.jpg", artist: "Zairon", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/David-de-Wied-gebouw_Leuvenlaan-4_De-Uithof_Utrecht_Nederland.JPG/1920px-David-de-Wied-gebouw_Leuvenlaan-4_De-Uithof_Utrecht_Nederland.JPG", artist: "Antoine", license: "CC BY-SA 3.0" },
  ],
  leiden: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leiden_-_Rapenburg_-_universiteit.JPG/1920px-Leiden_-_Rapenburg_-_universiteit.JPG", artist: "Rudolphous", license: "CC BY 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Huygens_and_Oort_Buildings.JPG/1920px-Huygens_and_Oort_Buildings.JPG", artist: "Samwalton9", license: "CC BY-SA 3.0" },
  ],
  erasmus: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Rotterdam_School_of_Management_Erasmus_University_Campus_spring.jpg/1920px-Rotterdam_School_of_Management_Erasmus_University_Campus_spring.jpg", artist: "RSM erasmus", license: "CC BY-SA 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/ErasmusUniv3.JPG/1920px-ErasmusUniv3.JPG", artist: "Vysotsky", license: "CC BY-SA 3.0" },
  ],
  maastricht: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/84/Maastricht%2C_Randwyck%2C_UM_building1.jpg", artist: "Kleon3", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Maastricht%2C_Oud_Gouvernement02.jpg", artist: "Kleon3", license: "CC BY-SA 3.0" },
  ],
  tue: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/TUe_by_night.png", artist: "Antepali", license: "CC BY-SA 4.0" },
  ],
  sorbonne: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Paris_75005_Rue_Saint-Jacques_La_Sorbonne_facade_01c.jpg", artist: "Thierry Bezecourt", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/P1300734_Paris_V_place_de_la_Sorbonne_rwk.jpg/1920px-P1300734_Paris_V_place_de_la_Sorbonne_rwk.jpg", artist: "Mbzt", license: "CC BY-SA 4.0" },
  ],
  psl: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/PSL_Headquarters.jpg/1920px-PSL_Headquarters.jpg", artist: "DanielE", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Coll%C3%A8ge_de_France.JPG/1920px-Coll%C3%A8ge_de_France.JPG", artist: "LPLT", license: "CC BY-SA 3.0" },
  ],
  sciencespo: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Entree_scpo.jpg/1920px-Entree_scpo.jpg", artist: "peco", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/4/48/Scpo_jardin.jpg", artist: "peco", license: "CC BY-SA 3.0" },
  ],
  polytechnique: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Campus_Ecole_polytechnique_de_palaiseau.jpg/1920px-Campus_Ecole_polytechnique_de_palaiseau.jpg", artist: "Jérémy Barande", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ecole_Polytechnique_France_seen_from_lake_DSC03389.JPG/1920px-Ecole_Polytechnique_France_seen_from_lake_DSC03389.JPG", artist: "David Monniaux", license: "CC BY-SA 3.0" },
  ],
  hecparis: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Chateau%2C_HEC_Paris%2C_Jouy-en-Josas%2C_South_view_20160501_1.jpg/1920px-Chateau%2C_HEC_Paris%2C_Jouy-en-Josas%2C_South_view_20160501_1.jpg", artist: "DXR", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/HEC_Paris_entr%C3%A9e.JPG/1920px-HEC_Paris_entr%C3%A9e.JPG", artist: "Cinerama14", license: "CC BY-SA 4.0" },
  ],
  parissaclay: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/%C3%89cole_normale_sup%C3%A9rieure_Paris-Saclay_5_-_Universit%C3%A9_Paris-Saclay.jpg/1920px-%C3%89cole_normale_sup%C3%A9rieure_Paris-Saclay_5_-_Universit%C3%A9_Paris-Saclay.jpg", artist: "Kévin Belbéoc'h", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ch%C3%A2teau_de_Launay%2C_Universit%C3%A9_Paris-Saclay%2C_Orsay%2C_France.jpg/1920px-Ch%C3%A2teau_de_Launay%2C_Universit%C3%A9_Paris-Saclay%2C_Orsay%2C_France.jpg", artist: "Christophe Peus / Université Paris-Saclay", license: "CC BY 4.0" },
  ],
  lyon1: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/IUFM_Croix_Rousse.JPG/1920px-IUFM_Croix_Rousse.JPG", artist: "Wikimedia Commons contributor", license: "CC BY-SA 3.0" },
  ],
  aixmarseille: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Faculte_de_Droit_by_JMC.jpg/1920px-Faculte_de_Droit_by_JMC.jpg", artist: "JM Campaner", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Hotel_Meynier_d%27Oppede_by_JMC.jpg/1920px-Hotel_Meynier_d%27Oppede_by_JMC.jpg", artist: "JM Campaner", license: "CC BY-SA 3.0" },
  ],
  ethz: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Z%C3%BCrich_ETH%2C_Federal_Institute_of_Technology_Building_%28Ank_Kumar%29_05.jpg/1920px-Z%C3%BCrich_ETH%2C_Federal_Institute_of_Technology_Building_%28Ank_Kumar%29_05.jpg", artist: "Ank Kumar", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/ETH_Z%C3%BCrich_am_Abend.jpg", artist: "ETH-Bibliothek", license: "CC BY-SA 4.0" },
  ],
  epfl: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/EPFL%E2%80%99s_Rolex_Learning_Center.jpg/1920px-EPFL%E2%80%99s_Rolex_Learning_Center.jpg", artist: "Bernard Vogel", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/EPFL_aerial.jpg/1920px-EPFL_aerial.jpg", artist: "Christoph Müller", license: "CC BY-SA 4.0" },
  ],
  uzh: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Hall_in_the_main_building_of_the_University_of_Z%C3%BCrich.jpg/1920px-Hall_in_the_main_building_of_the_University_of_Z%C3%BCrich.jpg", artist: "Ximeg", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Z%C3%BCrich_-_Universit%C3%A4t_Z%C3%BCrich_IMG_1204.JPG/1920px-Z%C3%BCrich_-_Universit%C3%A4t_Z%C3%BCrich_IMG_1204.JPG", artist: "Roland zh, upload on 10. Juli 2009", license: "CC BY-SA 3.0" },
  ],
  unige: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/University_of_Geneva_2015.jpg/1920px-University_of_Geneva_2015.jpg", artist: "Dmitry A. Mottl", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Concrete_%40_Universit%C3%A9_de_Gen%C3%A8ve_-_Uni_Dufour_%40_Plainpalais_%40_Gen%C3%A8ve_%2850686871572%29.jpg/1920px-Concrete_%40_Universit%C3%A9_de_Gen%C3%A8ve_-_Uni_Dufour_%40_Plainpalais_%40_Gen%C3%A8ve_%2850686871572%29.jpg", artist: "Guilhem Vellut from Annecy, France", license: "CC BY 2.0" },
  ],
  tartu: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Tartu_asv2022-04_img21_University_main_building.jpg/1920px-Tartu_asv2022-04_img21_University_main_building.jpg", artist: "A.Savin", license: "FAL" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Tartu_%C3%9Clikooli_Vana_Anatoomikum_%281805%29.jpg/1920px-Tartu_%C3%9Clikooli_Vana_Anatoomikum_%281805%29.jpg", artist: "Hei1972", license: "CC BY-SA 4.0" },
  ],
  taltech: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/7/72/Tallinn_University_of_Technology.jpg", artist: "Murileer", license: "CC BY-SA 3.0" },
  ],
  lund: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Lunds_universitets_huvudbyggnad_%28juli_2008%29.jpg/1920px-Lunds_universitets_huvudbyggnad_%28juli_2008%29.jpg", artist: "Magnus Bäck", license: "Public domain" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/64/AF-borgen_2002.jpg", artist: "Wikimedia Commons contributor", license: "CC BY-SA 2.5" },
  ],
  uppsala: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Uppsala_University_2023.jpg/1920px-Uppsala_University_2023.jpg", artist: "ScanianDragon", license: "CC0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Carolina_Rediviva_N%C3%A4rbild.jpg/1920px-Carolina_Rediviva_N%C3%A4rbild.jpg", artist: "Goombah", license: "CC BY 3.0" },
  ],
  kth: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Royal_Institute_of_Technology_-_Stockholm.jpg", artist: "User Stern on sv.wikipedia", license: "CC BY-SA 3.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/KTH_borgg_rd.jpg/1920px-KTH_borgg_rd.jpg", artist: "Original uploader was Denoir at en.wikipedia", license: "Public domain" },
  ],
  stockholmuni: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Stockholm_University_campus_building.jpg/1920px-Stockholm_University_campus_building.jpg", artist: "Astra Travasso", license: "CC BY 4.0" },
  ],
  kuleuven: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/AGORA_Leuven.jpg/1920px-AGORA_Leuven.jpg", artist: "Agora Leercentrum", license: "CC BY-SA 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Castle_Arenberg%2C_Katholieke_Universiteit_Leuven_adj.jpg/1920px-Castle_Arenberg%2C_Katholieke_Universiteit_Leuven_adj.jpg", artist: "Juhanson", license: "CC BY-SA 3.0" },
  ],
  ghent: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/2021_Boekentoren_-_University_Library_of_Ghent.jpg", artist: "Geert Roels", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Universiteitsforum_2010PM_0603_21H7975.JPG/1920px-Universiteitsforum_2010PM_0603_21H7975.JPG", artist: "Pieter Morlion", license: "CC BY 4.0" },
  ],
  ulb: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Universit%C3%A9_Libre_de_Bruxelles_Franklin_Rooseveltlaan_Brussel_02.jpg/1920px-Universit%C3%A9_Libre_de_Bruxelles_Franklin_Rooseveltlaan_Brussel_02.jpg", artist: "Sally V", license: "CC BY 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/4/46/B%C3%A2timent_d%27entr%C3%A9e_-_auditoire_Janson_-_cr%C3%A9dits_David_Attas.jpg", artist: "Dattas", license: "CC BY-SA 3.0" },
  ],
  vub: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/VUB_campus_Etterbeek.JPG", artist: "Big_Apple", license: "CC BY-SA 3.0" },
  ],
  copenhagen: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/KU_frue_plads.jpg", artist: "User:MrBprints", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/b/bb/University_Main_Building.jpg", artist: "Mik Hartwell", license: "CC BY-SA 2.0" },
  ],
  dtu: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Front_Door_of_the_School.jpg/1920px-Front_Door_of_the_School.jpg", artist: "Arthur Kho Caayon from Helsinki, Finland", license: "CC BY 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/DTU_03-05-06_06.jpg/1920px-DTU_03-05-06_06.jpg", artist: "Wikimedia Commons contributor", license: "CC BY 2.5 dk" },
  ],
  aarhus: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Aarhus_Universitets_hovedbygning_set_fra_parken.jpg/1920px-Aarhus_Universitets_hovedbygning_set_fra_parken.jpg", artist: "Villy Fink Isaksen", license: "CC BY-SA 4.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Aula_%28Aarhus_Universitet%29.jpg/1920px-Aula_%28Aarhus_Universitet%29.jpg", artist: "RhinoMind", license: "CC BY-SA 4.0" },
  ],
  cbs: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kilen%2C_frederiksberg.jpg/1920px-Kilen%2C_frederiksberg.jpg", artist: "seier+seier", license: "CC BY 2.0" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Solbjerg_cbs.jpg/1920px-Solbjerg_cbs.jpg", artist: "Joey1105", license: "CC BY-SA 4.0" },
  ],
});

Object.assign(universityLogos, {
  oxford: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Coat_of_arms_of_the_University_of_Oxford.svg/960px-Coat_of_arms_of_the_University_of_Oxford.svg.png", artist: "ChevronTango", license: "Public domain" },
  cambridge: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/960px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png", artist: "Wikimedia Commons contributor", license: "CC BY-SA 3.0" },
  imperial: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Imperial_College_London_new_logo.png/960px-Imperial_College_London_new_logo.png", artist: "Imperial College London", license: "Public domain" },
  lse: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/LSE_Logo.svg/960px-LSE_Logo.svg.png", artist: "London School of Economics and Political Science", license: "Public domain" },
  kcl: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/King%27s_College_London_logo.svg/960px-King%27s_College_London_logo.svg.png", artist: "King's College London", license: "Public domain" },
  uva: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Amsterdamuniversitylogo.svg/960px-Amsterdamuniversitylogo.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  vu: { url: "https://upload.wikimedia.org/wikipedia/commons/3/39/VU_logo.png", artist: "vrije universiteit Amsterdam", license: "CC BY-SA 4.0" },
  leiden: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/UniversiteitLeidenLogo.svg/960px-UniversiteitLeidenLogo.svg.png", artist: "Leiden University", license: "CC BY-SA 3.0" },
  erasmus: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Logo_Erasmus_Universiteit_Rotterdam.svg/960px-Logo_Erasmus_Universiteit_Rotterdam.svg.png", artist: "Erasmus University Rotterdam", license: "Copyrighted free use" },
  maastricht: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Maastricht_University_logo_%282017_new_version%29.svg/960px-Maastricht_University_logo_%282017_new_version%29.svg.png", artist: "Maastricht University", license: "Public domain" },
  tue: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Eindhoven_University_of_Technology_logo_new.svg/960px-Eindhoven_University_of_Technology_logo_new.svg.png", artist: "Eindhoven University of Technology", license: "Public domain" },
  sorbonne: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Logo_of_Sorbonne_University.svg/960px-Logo_of_Sorbonne_University.svg.png", artist: "Sorbonne Université", license: "Public domain" },
  psl: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/LOGO-PSL-juin-2026.svg/960px-LOGO-PSL-juin-2026.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  sciencespo: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Logo_Sciences_Po.svg/960px-Logo_Sciences_Po.svg.png", artist: "Paris Institute of Political Studies", license: "Public domain" },
  polytechnique: { url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Polytechnique_logo.png", artist: "Wikimedia Commons contributor", license: "Public domain" },
  hecparis: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/HEC_Paris.svg/960px-HEC_Paris.svg.png", artist: "École des hautes études commerciales de Paris", license: "Public domain" },
  parissaclay: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Logo_Universit%C3%A9_Paris-Saclay_%28ComUE%29.svg/960px-Logo_Universit%C3%A9_Paris-Saclay_%28ComUE%29.svg.png", artist: "Université Paris-Saclay", license: "Public domain" },
  lyon1: { url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/2026_LogoLyon1_Web_RVB_Plein_72dpi.png", artist: "Lyon 1 Université", license: "Public domain" },
  aixmarseille: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Aix_Marseille_Universit%C3%A9_logo_2024.png/960px-Aix_Marseille_Universit%C3%A9_logo_2024.png", artist: "Université d'Aix-Marseille", license: "Public domain" },
  ethz: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/ETH_Z%C3%BCrich_Logo_black.svg/960px-ETH_Z%C3%BCrich_Logo_black.svg.png", artist: "ETH Zürich", license: "Public domain" },
  epfl: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Logo_EPFL_2019.svg/960px-Logo_EPFL_2019.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  uzh: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Universit%C3%A4t_Z%C3%BCrich_logo.svg/960px-Universit%C3%A4t_Z%C3%BCrich_logo.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  unige: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Uni_GE_logo.svg/960px-Uni_GE_logo.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  tartu: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/University_of_Tartu_circular_logo_in_EST_and_ENG.svg/960px-University_of_Tartu_circular_logo_in_EST_and_ENG.svg.png", artist: "University of Tartu", license: "CC BY-SA 4.0" },
  lund: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Lund_vapen.svg/960px-Lund_vapen.svg.png", artist: "Jsdo1980", license: "CC BY-SA 3.0" },
  kuleuven: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/KU_Leuven_logo.svg/960px-KU_Leuven_logo.svg.png", artist: "KU Leuven", license: "Public domain" },
  ulb: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/ULB_logo3lp.svg/960px-ULB_logo3lp.svg.png", artist: "ULB", license: "CC BY-SA 4.0" },
  vub: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Vrije_Universiteit_Brussel_logo.svg/960px-Vrije_Universiteit_Brussel_logo.svg.png", artist: "Vrije Universiteit Brussel", license: "Public domain" },
  copenhagen: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/University_of_Copenhagen_Wordmark.svg/960px-University_of_Copenhagen_Wordmark.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  aarhus: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aarhus_University_logo.svg/960px-Aarhus_University_logo.svg.png", artist: "Aarhus University", license: "Public domain" },
  cbs: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Logo_CopenhagenBusinessSchool.svg/960px-Logo_CopenhagenBusinessSchool.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  ucl: { url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Ucl_logo.png", artist: "Samir assaad", license: "CC BY-SA 4.0" },
  manchester: { url: "https://upload.wikimedia.org/wikipedia/commons/d/de/Manchester_University_Logo.png", artist: "The University of Manchester", license: "Public domain" },
  utrecht: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Utrecht-univesrsity-logo.svg/960px-Utrecht-univesrsity-logo.svg.png", artist: "Utrechy University", license: "Public domain" },
  uppsala: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Uppsala_universitet_logo.jpg/960px-Uppsala_universitet_logo.jpg", artist: "Uppsala university", license: "Public domain" },
  kth: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/KTH_Logo.svg/960px-KTH_Logo.svg.png", artist: "Jmkim dot com", license: "Public domain" },
  ghent: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Universiteit_Gent_logo.svg/960px-Universiteit_Gent_logo.svg.png", artist: "Unknown authorUnknown author", license: "Public domain" },
  dtu: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Danmarks_Tekniske_Universitet_%28logo%29.svg/960px-Danmarks_Tekniske_Universitet_%28logo%29.svg.png", artist: "Technical University of Denmark", license: "Public domain" },
});
