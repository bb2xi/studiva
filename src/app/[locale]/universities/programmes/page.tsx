import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import { Heading } from "@/components/Typography";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import ProgrammeSearch from "@/components/discovery/ProgrammeSearch";
import { getUniversitySummaries } from "@/lib/universities";
import { daadSearchUrl, hskSearchUrl } from "@/lib/discovery/daad";
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

  const institutions = universities
    .map((u) => ({ slug: u.slug, name: u.name, daadId: u.facts?.daad?.insId ?? null, hskId: u.facts?.hsk?.institutionId ?? null }))
    .sort((a, b) => collator.compare(a.name, b.name));
  const ranked = universities
    .filter((u) => u.facts?.hsk)
    .sort((a, b) => b.facts!.hsk!.programmes - a.facts!.hsk!.programmes || collator.compare(a.name, b.name));
  const notListed = universities.filter((u) => !u.facts?.hsk).map((u) => u.name);
  const hskDate = ranked[0]?.facts?.hsk?.fetchedAt;
  const daadDate = universities.find((u) => u.facts?.daad)?.facts?.daad?.fetchedAt;
  const linkClass = "inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-forest underline underline-offset-2 hover:text-brand";

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
              <p>{t("howAll")}</p>
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
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead className="bg-background-secondary text-xs uppercase tracking-wide text-foreground-secondary">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t("colUniversity")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      {t("colAll")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t("colLevels")}
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
                  {ranked.map((u) => {
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
                        <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">{hsk.programmes}</td>
                        <td className="px-4 py-3 text-xs text-foreground-secondary">{t("levelSplit", { undergraduate: hsk.undergraduate, graduate: hsk.graduate })}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{daad && daad.englishProgrammes > 0 ? daad.englishProgrammes : "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="flex justify-end gap-3">
                            <a href={hskSearchUrl({ institutionId: hsk.institutionId })} target="_blank" rel="noopener noreferrer" className={linkClass}>
                              {t("viewAll")} <ExternalLink size={11} aria-hidden />
                              <span className="sr-only">— {u.name}</span>
                            </a>
                            {daad && daad.englishProgrammes > 0 && (
                              <a href={daadSearchUrl({ insId: daad.insId, language: "english" })} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                {t("viewOnDaad")} <ExternalLink size={11} aria-hidden />
                                <span className="sr-only">— {u.name}</span>
                              </a>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-foreground-muted">
              {hskDate && daadDate && t("fetched", { hskDate: formatDate(hskDate, locale), daadDate: formatDate(daadDate, locale) })}{" "}
              {notListed.length > 0 && t("notListed", { names: notListed.join(", ") })}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
