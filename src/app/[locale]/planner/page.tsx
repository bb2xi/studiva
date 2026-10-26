import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import PlannerView from "@/components/discovery/PlannerView";
import { getUniversitySummaries } from "@/lib/universities";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.planner" });
  return pageMetadata({ locale, path: "/planner", title: `${t("title")} | Studiva`, description: t("description"), noindex: true });
}

export default async function PlannerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.planner" });
  const items = await getUniversitySummaries(locale);
  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-12 sm:py-16">
        <Container>
          <PlannerView items={items} />
        </Container>
      </section>
    </>
  );
}
