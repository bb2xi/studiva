import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ExternalLink, ChevronRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import { Heading, Dek } from "@/components/Typography";
import { Tag } from "@/components/Tag";
import { FeeBadge } from "@/components/discovery/FeeBadge";
import { STATES, STATE_BY_SLUG, cityName, citySlug } from "@/data/states";
import { STATE_CONTENT, STATE_POLICY_CHECKED_AT } from "@/data/stateContent";
import { COST_REFERENCE } from "@/data/references";
import { getUniversitySummaries } from "@/lib/universities";
import { formatDate, formatEur, hostOf } from "@/lib/discovery/facts";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => STATES.map((s) => ({ locale, state: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; state: string }> }) {
  const { locale, state } = await params;
  const info = STATE_BY_SLUG[state];
  if (!info) return {};
  const t = await getTranslations({ locale, namespace: "discovery.meta.state" });
  const name = info.name[locale === "tr" ? "tr" : "en"];
  return pageMetadata({ locale, path: `/germany/${state}`, title: `${t("title", { state: name })} | Studiva`, description: t("description", { state: name }) });
}

export default async function StatePage({ params }: { params: Promise<{ locale: string; state: string }> }) {
  const { locale, state } = await params;
  setRequestLocale(locale);
  const info = STATE_BY_SLUG[state];
  if (!info) notFound();

  const t = await getTranslations({ locale, namespace: "discovery" });
  const lang = locale === "tr" ? "tr" : "en";
  const name = info.name[lang];
  const content = STATE_CONTENT[info.code];
  const unis = (await getUniversitySummaries(locale)).filter((u) => u.state === info.code);
  const cities = [...new Set(unis.flatMap((u) => u.cities))].sort((a, b) => a.localeCompare(b, "de"));
  const multiCampus = unis.filter((u) => u.cities.length === 0);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("detail.breadcrumbHome"), item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: t("nav.states"), item: `${SITE_URL}/${locale}/germany` },
        { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/${locale}/germany/${state}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t("meta.state.title", { state: name }),
      itemListElement: unis.map((u, i) => ({ "@type": "ListItem", position: i + 1, name: u.name, url: `${SITE_URL}/${locale}/universities/${u.slug}` })),
    },
  ];

  const policyVariant = content.policy.status === "none" ? "forest" : content.policy.status === "statewide" ? "clay" : "brass";

  return (
    <>
      <DiscoveryNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-border py-12 sm:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/germany" className="hover:text-forest">
                  {t("nav.states")}
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden />
              <li aria-current="page" className="text-foreground-secondary">
                {name}
              </li>
            </ol>
          </nav>
          <Heading as="h1" size="lg" className="mt-4">
            {t("meta.state.title", { state: name })}
          </Heading>
          {name !== info.name.de && <p className="mt-1 text-sm text-foreground-muted">{info.name.de}</p>}
          <Dek className="mt-4 max-w-3xl text-base">{content.intro[lang]}</Dek>
          <p className="mt-3 text-sm text-foreground-muted">{t("states.capital", { capital: cityName(info.capital, locale) })}</p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-sm border border-border bg-surface p-6 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-medium text-foreground">{t("states.policy")}</h2>
                <Tag variant={policyVariant}>{t(`states.policyStatus.${content.policy.status}`)}</Tag>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{content.policy.text[lang]}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
                <a href={content.policy.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-forest underline underline-offset-2">
                  {t("common.source")}: {hostOf(content.policy.source)} <ExternalLink size={10} />
                </a>
                <span>{t("common.checkedOn", { date: formatDate(STATE_POLICY_CHECKED_AT, locale) })}</span>
              </p>
            </div>
            <div className="rounded-sm border border-border bg-background-secondary p-6">
              <h2 className="font-display text-xl font-medium text-foreground">{t("states.costsTitle")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                {t("states.costsBody", { total: formatEur(COST_REFERENCE.monthlyTotal, locale), rent: formatEur(COST_REFERENCE.monthly.rent, locale) })}
              </p>
              <Link href="/cost-calculator" className="mt-3 inline-block text-sm font-semibold text-forest underline underline-offset-2 hover:text-brand">
                {t("states.openCalculator")} →
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl font-medium text-foreground">{t("states.cities")}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{t("states.coverage", { count: unis.length })}</p>
            {cities.length > 0 && (
              <nav aria-label={t("states.cities")} className="mt-4 flex flex-wrap gap-2">
                {cities.map((c) => (
                  <a key={c} href={`#${citySlug(c)}`} className="rounded-full border border-border-strong px-3 py-1 text-xs text-foreground-secondary hover:border-forest hover:text-forest">
                    {cityName(c, locale)}
                  </a>
                ))}
              </nav>
            )}

            <div className="mt-8 space-y-10">
              {cities.map((c) => {
                const inCity = unis.filter((u) => u.cities.includes(c));
                return (
                  <section key={c} id={citySlug(c)} aria-labelledby={`${citySlug(c)}-h`} className="scroll-mt-28">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
                      <h3 id={`${citySlug(c)}-h`} className="flex items-center gap-2 font-display text-xl font-medium text-foreground">
                        <MapPin size={18} className="text-forest" />
                        {cityName(c, locale)}
                        <span className="text-sm font-normal text-foreground-muted">{t("states.cityUniversities", { count: inCity.length })}</span>
                      </h3>
                      <Link href={`/universities?city=${encodeURIComponent(c)}`} className="text-sm font-semibold text-forest underline underline-offset-2 hover:text-brand">
                        {t("states.seeInDirectory")}
                      </Link>
                    </div>
                    <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {inCity.map((u) => (
                        <UniversityRow key={u.slug} u={u} t={t} />
                      ))}
                    </ul>
                  </section>
                );
              })}
              {multiCampus.length > 0 && (
                <section aria-label={t("common.multiCampus")}>
                  <h3 className="border-b border-border pb-2 font-display text-xl font-medium text-foreground">{t("common.multiCampus")}</h3>
                  <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {multiCampus.map((u) => (
                      <UniversityRow key={u.slug} u={u} t={t} note={t("states.multiCampusNote")} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          <div className="mt-14 border-t border-border pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{t("states.otherStates")}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {STATES.filter((s) => s.code !== info.code).map((s) => (
                <li key={s.code}>
                  <Link href={`/germany/${s.slug}`} className="rounded-full border border-border-strong px-3 py-1 text-xs text-foreground-secondary hover:border-forest hover:text-forest">
                    {s.name[lang]}
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

function UniversityRow({
  u,
  t,
  note,
}: {
  u: Awaited<ReturnType<typeof getUniversitySummaries>>[number];
  t: Awaited<ReturnType<typeof getTranslations>>;
  note?: string;
}) {
  return (
    <li className="rounded-sm border border-border bg-surface p-4">
      <Link href={`/universities/${u.slug}`} className="font-display text-lg font-medium text-foreground hover:text-forest">
        {u.name}
      </Link>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Tag variant="neutral">{t(`types.${u.type}`)}</Tag>
        {u.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
        <FeeBadge facts={u.facts} />
      </div>
      {note && <p className="mt-2 text-xs text-foreground-muted">{note}</p>}
      <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">{u.description}</p>
    </li>
  );
}
