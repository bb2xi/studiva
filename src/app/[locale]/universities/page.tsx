import { setRequestLocale, getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero";
import UniversitiesExplorer from "@/components/UniversitiesExplorer";
import CtaBand from "@/components/CtaBand";
import { heroPhotos } from "@/lib/heroPhotos";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  lat: number;
  lng: number;
  description: string;
  popularPrograms: string[];
  tuitionFree: boolean;
  competitiveness: "low" | "medium" | "high";
  level: "bachelor" | "master" | "both";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "universities" });
  return { title: `${t("hero.title")} | Studiva` };
}

export default async function UniversitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const { locale } = await params;
  const { level } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "universities" });
  const items = t.raw("items") as UniversityItem[];
  const filters = t.raw("filters") as Record<string, string>;
  const levelFilters = t.raw("levelFilters") as Record<string, string>;
  const map = t.raw("map") as { title: string; subtitle: string; hint: string; zoomHint: string };
  const search = t.raw("search") as { placeholder: string; noResults: string };

  const initialLevel = level === "bachelor" || level === "master" ? level : "all";

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.universities} />

      <UniversitiesExplorer
        items={items}
        locale={locale}
        mapTitle={map.title}
        mapSubtitle={map.subtitle}
        mapHint={map.hint}
        mapZoomHint={map.zoomHint}
        filterLabels={{
          all: filters.all,
          universitat: filters.universitat,
          hochschule: filters.hochschule,
          dual: filters.dual,
          tu9: filters.tu9,
          excellence: filters.excellence,
        }}
        levelLabels={{
          all: levelFilters.all,
          bachelor: levelFilters.bachelor,
          master: levelFilters.master,
        }}
        searchPlaceholder={search.placeholder}
        searchNoResults={search.noResults}
        initialLevel={initialLevel}
      />

      <CtaBand
        variant="universitiesList"
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        buttonLabel={t("cta.button")}
      />
    </>
  );
}
