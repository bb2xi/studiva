import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import UniversitiesBrowser from "@/components/UniversitiesBrowser";
import GermanyMap from "@/components/GermanyMap";
import Reveal from "@/components/Reveal";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  badges: string[];
  mapCity: string;
  description: string;
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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "universities" });
  const items = t.raw("items") as UniversityItem[];
  const filters = t.raw("filters") as Record<string, string>;
  const map = t.raw("map") as { title: string; subtitle: string; hint: string; emptyState: string; zoomOut: string };

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={map.title} subtitle={map.subtitle} />
          </Reveal>
          <div className="mt-10">
            <GermanyMap
              items={items}
              locale={locale}
              labels={{
                all: filters.all,
                tu9: filters.tu9,
                excellence: filters.excellence,
                hochschule: filters.hochschule,
                hint: map.hint,
                emptyState: map.emptyState,
                zoomOut: map.zoomOut,
              }}
            />
          </div>
        </Container>
      </section>

      <section className="bg-background-secondary py-20 sm:py-24">
        <Container>
          <UniversitiesBrowser
            items={items}
            locale={locale}
            labels={{
              all: filters.all,
              universitat: filters.universitat,
              hochschule: filters.hochschule,
              dual: filters.dual,
              tu9: filters.tu9,
              excellence: filters.excellence,
            }}
          />
        </Container>
      </section>

      <section className="bg-brand">
        <Container className="flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="max-w-xl text-green-100">{t("cta.subtitle")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-all duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            {t("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
