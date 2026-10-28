import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import { Heading } from "@/components/Typography";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import { FeeBadge } from "@/components/discovery/FeeBadge";
import { getUniversitySummaries, COMPASS } from "@/lib/universities";
import { hskSearchUrl } from "@/lib/discovery/daad";
import { formatDate } from "@/lib/discovery/facts";
import { SUBJECT_AREAS, type SubjectArea } from "@/lib/discovery/types";
import { pageMetadata, SITE_URL } from "@/lib/seo";

const isArea = (value: string): value is SubjectArea => (SUBJECT_AREAS as readonly string[]).includes(value);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => SUBJECT_AREAS.map((area) => ({ locale, area })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }) {
  const { locale, area } = await params;
  if (!isArea(area)) return {};
  const t = await getTranslations({ locale, namespace: "discovery" });
  const subject = t(`subjects.${area}`);
  return pageMetadata({
    locale,
    path: `/universities/subjects/${area}`,
    title: `${t("meta.subject.title", { subject })} | Studiva`,
    description: t("meta.subject.description", { subject }),
  });
}

export default async function SubjectPage({ params }: { params: Promise<{ locale: string; area: string }> }) {
  const { locale, area } = await params;
  if (!isArea(area)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.subjectsPage" });
  const d = await getTranslations({ locale, namespace: "discovery" });
  const subject = d(`subjects.${area}`);
  const number = new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB");
  const collator = new Intl.Collator(locale);
  const fields = COMPASS.areaFields[area];
  const total = number.format(COMPASS.areaTotals[area]);

  const universities = await getUniversitySummaries(locale);
  const offering = universities
    .filter((u) => (u.facts?.hsk?.areaCounts[area] ?? 0) > 0)
    .sort((a, b) => b.facts!.hsk!.areaCounts[area]! - a.facts!.hsk!.areaCounts[area]! || collator.compare(a.name, b.name));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: d("meta.subject.title", { subject }),
    numberOfItems: offering.length,
    itemListElement: offering.map((u, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/universities/${u.slug}`, name: u.name })),
  };
  const buttonClass = "inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

  return (
    <>
      <DiscoveryNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DiscoveryHeader title={t("areaTitle", { subject })} subtitle={t("areaSubtitle", { total, count: offering.length })}>
        <nav aria-label="Breadcrumb" className="mt-4 text-sm text-foreground-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/universities" className="hover:text-forest">
                {d("nav.directory")}
              </Link>
            </li>
            <ChevronRight size={14} aria-hidden />
            <li>
              <Link href="/universities/subjects" className="hover:text-forest">
                {t("breadcrumb")}
              </Link>
            </li>
            <ChevronRight size={14} aria-hidden />
            <li aria-current="page" className="text-foreground-secondary">
              {subject}
            </li>
          </ol>
        </nav>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={hskSearchUrl({ fields })} target="_blank" rel="noopener noreferrer" className={`${buttonClass} bg-brand-fill text-white hover:bg-brand-fill-hover`}>
            {t("allOnCompass", { total })} <ExternalLink size={14} aria-hidden />
          </a>
          <Link href={`/universities?subject=${area}`} className={`${buttonClass} border border-brand text-brand hover:bg-brand-light`}>
            {t("filterDirectory")}
          </Link>
        </div>
      </DiscoveryHeader>

      <section className="py-12 sm:py-16">
        <Container>
          {/* relative: keeps the absolutely positioned sr-only labels inside the scroll box on narrow screens */}
          <div className="relative overflow-x-auto rounded-sm border border-border">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-background-secondary text-xs uppercase tracking-wide text-foreground-secondary">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t("colUniversity")}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    {t("colProgrammes")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t("colTuition")}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    {t("colEnglish")}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    <span className="sr-only">{t("colLinks")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {offering.map((u) => {
                  const hsk = u.facts!.hsk!;
                  const daad = u.facts?.daad;
                  return (
                    <tr key={u.slug} className="bg-surface">
                      <td className="px-4 py-3">
                        <Link href={`/universities/${u.slug}`} className="font-medium text-foreground hover:text-forest">
                          {u.name}
                        </Link>
                        <span className="block text-xs text-foreground-muted">{u.cityLabel}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">{hsk.areaCounts[area]}</td>
                      <td className="px-4 py-3">
                        <FeeBadge facts={u.facts} />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-foreground">{daad && daad.englishProgrammes > 0 ? daad.englishProgrammes : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={hskSearchUrl({ institutionId: hsk.institutionId, fields })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-forest underline underline-offset-2 hover:text-brand"
                        >
                          {t("viewOnCompass")} <ExternalLink size={11} aria-hidden />
                          <span className="sr-only">— {u.name}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-foreground-muted">
            {t("note", { date: formatDate(COMPASS.fetchedAt, locale) })} {t("englishNote")}
          </p>

          <div className="mt-12">
            <Heading as="h2" size="sm">
              {t("otherSubjects")}
            </Heading>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SUBJECT_AREAS.filter((s) => s !== area).map((s) => (
                <li key={s}>
                  <Link href={`/universities/subjects/${s}`} className="inline-block rounded-sm border border-border-strong bg-surface px-3 py-1.5 text-sm text-foreground-secondary hover:border-forest hover:text-forest">
                    {d(`subjects.${s}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
