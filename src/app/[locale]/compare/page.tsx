import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import CompareView from "@/components/discovery/CompareView";
import { getUniversitySummaries } from "@/lib/universities";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.compare" });
  // Arbitrary ?ids= combinations are user-specific views, not pages worth indexing.
  return pageMetadata({ locale, path: "/compare", title: `${t("title")} | Studiva`, description: t("description"), noindex: true });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.compare" });
  const items = await getUniversitySummaries(locale);
  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-sm bg-background-secondary" />}>
            <CompareView items={items} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
