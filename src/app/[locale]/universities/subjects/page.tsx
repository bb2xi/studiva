import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import { getUniversitySummaries, COMPASS } from "@/lib/universities";
import { formatDate } from "@/lib/discovery/facts";
import { SUBJECT_AREAS } from "@/lib/discovery/types";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.subjects" });
  return pageMetadata({ locale, path: "/universities/subjects", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function SubjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.subjectsPage" });
  const d = await getTranslations({ locale, namespace: "discovery" });
  const universities = await getUniversitySummaries(locale);
  const number = new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB");

  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-12 sm:py-16">
        <Container>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECT_AREAS.map((area) => {
              const offering = universities.filter((u) => u.facts?.subjectAreas?.includes(area)).length;
              return (
                <li key={area}>
                  <Link
                    href={`/universities/subjects/${area}`}
                    className="group flex h-full flex-col rounded-sm border border-border bg-surface p-5 transition-colors hover:border-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-lg font-medium text-foreground group-hover:text-forest">{d(`subjects.${area}`)}</span>
                      <ArrowUpRight size={16} className="mt-1 shrink-0 text-foreground-muted group-hover:text-forest" aria-hidden />
                    </span>
                    <span className="mt-3 text-sm text-foreground-secondary">{t("universities", { count: offering })}</span>
                    <span className="mt-0.5 text-xs text-foreground-muted">{t("programmes", { count: number.format(COMPASS.areaTotals[area]) })}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-foreground-muted">{t("note", { date: formatDate(COMPASS.fetchedAt, locale) })}</p>
        </Container>
      </section>
    </>
  );
}
