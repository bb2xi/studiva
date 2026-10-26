import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import FinderWizard from "@/components/discovery/FinderWizard";
import { getUniversitySummaries } from "@/lib/universities";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.finder" });
  return pageMetadata({ locale, path: "/universities/finder", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function FinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.finder" });
  const items = await getUniversitySummaries(locale);
  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")}>
        <details className="mt-5 max-w-2xl rounded-sm border border-border bg-surface p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-foreground-secondary">{t("how")}</summary>
          <p className="mt-2 leading-relaxed text-foreground-secondary">{t("howBody")}</p>
        </details>
      </DiscoveryHeader>
      <section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={<div className="mx-auto h-72 max-w-2xl animate-pulse rounded-sm bg-background-secondary" />}>
            <FinderWizard items={items} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
