import type { HeroPhoto } from "@/components/HeroBackground";

// Curated picks from the existing licensed campus-photo library
// (src/lib/universityMedia.ts), reused as page-specific hero backgrounds so
// every page leads with real German university photography instead of
// abstract decoration — each page gets a different shot for variety.
export const heroPhotos: Record<string, HeroPhoto> = {
  home: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/M%C3%BCnchen_-_TU_M%C3%BCnchen_%28Luftbild%29.jpg/1920px-M%C3%BCnchen_-_TU_M%C3%BCnchen_%28Luftbild%29.jpg",
    artist: "Maximilian Dörrbecker (Chumwa)",
    license: "CC BY-SA 2.5",
  },
  universities: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/86/2005_uni-03.jpg",
    artist: "JimmeyTimmey at en.wikipedia",
    license: "CC BY-SA 3.0",
  },
  services: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/SuperC_-_bei_Nacht.jpg/1920px-SuperC_-_bei_Nacht.jpg",
    artist: "Euku",
    license: "CC BY-SA 3.0",
  },
  programs: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/SchlossMannheim-Pano-130616.jpg/1920px-SchlossMannheim-Pano-130616.jpg",
    artist: "Hubert Berberich (HubiB)",
    license: "CC BY 3.0",
  },
  about: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg/1920px-Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg",
    artist: "Christian Wolf (www.c-w-design.de)",
    license: "CC BY-SA 3.0 DE",
  },
  contact: {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Fh-frankfurt-am-main-blaue-stundel.jpg",
    artist: "Fotoinfo",
    license: "CC BY 3.0",
  },
  blog: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/TU_M%C3%BCnchen_GO-2.jpg/1920px-TU_M%C3%BCnchen_GO-2.jpg",
    artist: "Gras-Ober",
    license: "CC BY-SA 3.0",
  },
};
