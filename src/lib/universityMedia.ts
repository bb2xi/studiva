export type UniversityImage = {
  url: string;
  artist: string;
  license: string;
};

export const universityMedia: Record<string, UniversityImage[]> = {
  tum: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/TU_M%C3%BCnchen_GO-2.jpg/1920px-TU_M%C3%BCnchen_GO-2.jpg",
      artist: "Gras-Ober",
      license: "CC BY-SA 3.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/M%C3%BCnchen_-_TU_M%C3%BCnchen_%28Luftbild%29.jpg/1920px-M%C3%BCnchen_-_TU_M%C3%BCnchen_%28Luftbild%29.jpg",
      artist: "Maximilian Dörrbecker (Chumwa)",
      license: "CC BY-SA 2.5",
    },
  ],
  lmu: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Entrance_to_LMU_Munich_main_building.jpg/1920px-Entrance_to_LMU_Munich_main_building.jpg",
      artist: "Seeott",
      license: "CC BY-SA 4.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/LMU_M%C3%BCnchen_-_Audimax2.JPG/1920px-LMU_M%C3%BCnchen_-_Audimax2.JPG",
      artist: "Church of emacs",
      license: "CC BY-SA 4.0",
    },
  ],
  huberlin: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg/1920px-Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg",
      artist: "Christian Wolf (www.c-w-design.de)",
      license: "CC BY-SA 3.0 DE",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Alexander_von_Humboldt_Denkmal_-_Humboldt_Universit%C3%A4t_zu_Berlin.jpg/1920px-Alexander_von_Humboldt_Denkmal_-_Humboldt_Universit%C3%A4t_zu_Berlin.jpg",
      artist: "Christian Wolf (www.c-w-design.de)",
      license: "CC BY-SA 3.0 DE",
    },
  ],
  rwth: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/SuperC_-_bei_Nacht.jpg/1920px-SuperC_-_bei_Nacht.jpg",
      artist: "Euku",
      license: "CC BY-SA 3.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/RWTH_Aachen_Hauptgeb%C3%A4ude.jpg/1920px-RWTH_Aachen_Hauptgeb%C3%A4ude.jpg",
      artist: "א (Aleph)",
      license: "CC BY-SA 2.5",
    },
  ],
  mannheim: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/SchlossMannheim-Pano-130616.jpg/1920px-SchlossMannheim-Pano-130616.jpg",
      artist: "Hubert Berberich (HubiB)",
      license: "CC BY 3.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Universit%C3%A4t_Mannheim_-_Geb%C3%A4ude_A5.jpg",
      artist: "WolfgangBo1975",
      license: "CC BY-SA 3.0",
    },
  ],
  hm: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Roter_W%C3%BCrfel.jpg/1920px-Roter_W%C3%BCrfel.jpg",
      artist: "Hochschule München",
      license: "CC BY-SA 4.0",
    },
  ],
  frankfurtuas: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/FH-FFM_Building_2_2012-08-01_%2801%29.jpg/1920px-FH-FFM_Building_2_2012-08-01_%2801%29.jpg",
      artist: "#Reaper",
      license: "CC BY-SA 3.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Fh-frankfurt-am-main-blaue-stundel.jpg",
      artist: "Fotoinfo",
      license: "CC BY 3.0",
    },
  ],
  dhbw: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Berufsakademie_Stuttgart_%28Kronenstra%C3%9Fe_53%29-2.jpg/1920px-Berufsakademie_Stuttgart_%28Kronenstra%C3%9Fe_53%29-2.jpg",
      artist: "Stefan-Xp",
      license: "CC BY-SA 3.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/BA_Roteb%C3%BChl.jpg",
      artist: "Stefan-Xp, reworked by C124",
      license: "CC BY-SA 3.0",
    },
  ],
  iu: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/IUBH_Erfurt%2C_Juri-Gagarin-Ring.JPG/1920px-IUBH_Erfurt%2C_Juri-Gagarin-Ring.JPG",
      artist: "Gmünder",
      license: "CC BY-SA 4.0",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/IU_Internationale_Hochschule_Cologne_3.jpg/1920px-IU_Internationale_Hochschule_Cologne_3.jpg",
      artist: "Czalex",
      license: "CC0",
    },
  ],
  fom: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/D%C3%BCsseldorf-Derendorf%3B_FOM_Hochschule_2016.jpg/1920px-D%C3%BCsseldorf-Derendorf%3B_FOM_Hochschule_2016.jpg",
      artist: "colling-architektur",
      license: "CC BY-SA 3.0",
    },
  ],
};
