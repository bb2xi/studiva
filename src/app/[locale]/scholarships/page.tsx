import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import ScholarshipList from "@/components/discovery/ScholarshipList";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.scholarships" });
  return pageMetadata({ locale, path: "/scholarships", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function ScholarshipsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.scholarships" });
  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-12 sm:py-16">
        <Container>
          <ScholarshipList />
        </Container>
      </section>
    </>
  );
}
