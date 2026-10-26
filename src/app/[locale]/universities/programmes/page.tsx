import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import { Heading } from "@/components/Typography";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import ProgrammeSearch from "@/components/discovery/ProgrammeSearch";
import { getUniversitySummaries } from "@/lib/universities";
import { daadSearchUrl } from "@/lib/discovery/daad";
import { formatDate } from "@/lib/discovery/facts";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.programmes" });
  return pageMetadata({ locale, path: "/universities/programmes", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function ProgrammesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.programmes" });
  const universities = await getUniversitySummaries(locale);
  const collator = new Intl.Collator(locale);

  const listed = universities.filter((u) => u.facts?.daad);
  const institutions = listed.map((u) => ({ insId: u.facts!.daad!.insId, name: u.name })).sort((a, b) => collator.compare(a.name, b.name));
  const ranked = listed
    .filter((u) => u.facts!.daad!.englishProgrammes > 0)
    .sort((a, b) => b.facts!.daad!.englishProgrammes - a.facts!.daad!.englishProgrammes || collator.compare(a.name, b.name));
  const notListed = universities.filter((u) => !u.facts?.daad).map((u) => u.name);
  const fetchedAt = listed[0]?.facts?.daad?.fetchedAt;

  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="min-w-0 lg:col-span-3">
              <ProgrammeSearch institutions={institutions} />
            </div>
            <aside className="min-w-0 space-y-3 text-sm leading-relaxed text-foreground-secondary lg:col-span-2">
              <Heading as="h2" size="sm">
                {t("howTitle")}
              </Heading>
              <p>{t("howBody")}</p>
              <p>{t("whyLink")}</p>
            </aside>
          </div>

          <div className="mt-14">
            <Heading as="h2" size="sm">
              {t("listTitle")}
            </Heading>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground-secondary">{t("listIntro")}</p>
            {/* relative: keeps the absolutely positioned sr-only labels inside the scroll box on narrow screens */}
            <div className="relative mt-5 overflow-x-auto rounded-sm border border-border">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-background-secondary text-xs uppercase tracking-wide text-foreground-secondary">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t("colUniversity")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      {t("colEnglish")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t("colSplit")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      <span className="sr-only">DAAD</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ranked.map((u) => {
                    const daad = u.facts!.daad!;
                    return (
                      <tr key={u.slug} className="bg-surface">
                        <td className="px-4 py-3">
                          <Link href={`/universities/${u.slug}`} className="font-medium text-foreground hover:text-forest">
                            {u.name}
                          </Link>
                          <span className="block text-xs text-foreground-muted">{u.cityLabel}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">{daad.englishProgrammes}</td>
                        <td className="px-4 py-3 text-xs text-foreground-secondary">{t("split", { bachelor: daad.englishBachelor, master: daad.englishMaster })}</td>
                        <td className="px-4 py-3 text-right">
                          <a
                            href={daadSearchUrl({ insId: daad.insId, language: "english" })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-forest underline underline-offset-2 hover:text-brand"
                          >
                            {t("viewOnDaad")} <ExternalLink size={11} aria-hidden />
                            <span className="sr-only">— {u.name}</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-foreground-muted">
              {fetchedAt && t("fetched", { date: formatDate(fetchedAt, locale) })} {notListed.length > 0 && t("notListed", { names: notListed.join(", ") })}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
