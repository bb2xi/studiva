import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DirectoryExplorer, { DirectoryView } from "@/components/discovery/DirectoryExplorer";
import { getDirectoryItems, FACTS_GENERATED_AT } from "@/lib/universities";
import { DEFAULT_STATE } from "@/lib/discovery/directory";
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
  const d = await getTranslations({ locale, namespace: "discovery.directory" });
  const items = await getDirectoryItems(locale);
  const props = { items, dataCheckedAt: FACTS_GENERATED_AT };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: d("title"),
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
      <a
        href="#results"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-20 focus-visible:z-[60] focus-visible:rounded-sm focus-visible:bg-brand focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white"
      >
        {d("skipToResults")}
      </a>
      <DiscoveryNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* The explorer reads its state from the URL, so it renders on the client; the prerendered
          HTML is the same directory in its default state, including the first results. */}
      <Suspense fallback={<DirectoryView {...props} state={DEFAULT_STATE} />}>
        <DirectoryExplorer {...props} />
      </Suspense>
      <CtaBand variant="universitiesList" title={t("cta.title")} subtitle={t("cta.subtitle")} buttonLabel={t("cta.button")} />
    </>
  );
}
