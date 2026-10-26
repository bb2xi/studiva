import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import CostCalculator from "@/components/discovery/CostCalculator";
import { getUniversitySummaries } from "@/lib/universities";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.costs" });
  return pageMetadata({ locale, path: "/cost-calculator", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function CostCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.costs" });
  const universities = await getUniversitySummaries(locale);
  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")}>
        <p className="mt-4 max-w-2xl rounded-sm border-l-2 border-accent bg-accent-light px-4 py-3 text-sm text-foreground-secondary">{t("disclaimer")}</p>
      </DiscoveryHeader>
      <section className="py-12 sm:py-16">
        <Container>
          <CostCalculator universities={universities} />
        </Container>
      </section>
    </>
  );
}
