import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DirectoryExplorer from "@/components/discovery/DirectoryExplorer";
import { heroPhotos } from "@/lib/heroPhotos";
import { getUniversitySummaries, FACTS_GENERATED_AT } from "@/lib/universities";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.directory" });
  return pageMetadata({ locale, path: "/universities", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function UniversitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "universities" });
  const items = await getUniversitySummaries(locale);
  const map = t.raw("map") as { title: string; subtitle: string; hint: string; zoomHint: string };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("hero.title"),
    numberOfItems: items.length,
    itemListElement: items.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/${locale}/universities/${u.slug}`,
      name: u.name,
    })),
  };

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.universities} />
      <DiscoveryNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title={map.title} subtitle={map.subtitle} />
          <div className="mt-8">
            <Suspense fallback={<div className="mx-auto h-12 max-w-2xl animate-pulse rounded-sm bg-background-secondary" />}>
              <DirectoryExplorer items={items} mapHint={map.hint} mapZoomHint={map.zoomHint} dataCheckedAt={FACTS_GENERATED_AT} />
            </Suspense>
          </div>
        </Container>
      </section>

      <CtaBand variant="universitiesList" title={t("cta.title")} subtitle={t("cta.subtitle")} buttonLabel={t("cta.button")} />
    </>
  );
}
