import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays, CheckCircle2, AlertTriangle, ExternalLink, ChevronRight, ShieldCheck, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import UniversityGallery from "@/components/UniversityGallery";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading, Dek } from "@/components/Typography";
import { Tag } from "@/components/Tag";
import { FeeBadge } from "@/components/discovery/FeeBadge";
import { CompareButton, FavoriteButton } from "@/components/discovery/ToggleButtons";
import AddToPlannerButton from "@/components/discovery/AddToPlannerButton";
import ReportForm from "@/components/discovery/ReportForm";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import { universityMedia } from "@/lib/universityMedia";
import { getUniversityDetail, getUniversitySummaries, UNIVERSITY_SLUGS } from "@/lib/universities";
import { formatDate, formatEurRange, hostOf } from "@/lib/discovery/facts";
import { STATE_BY_CODE, cityName } from "@/data/states";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import type { UniversityDetail } from "@/lib/discovery/types";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => UNIVERSITY_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const university = await getUniversityDetail(locale, slug);
  if (!university) return {};
  const state = university.state ? STATE_BY_CODE[university.state].name[locale === "tr" ? "tr" : "en"] : null;
  const description = [university.description, state ? `${university.cityLabel}, ${state}.` : null].filter(Boolean).join(" ");
  return pageMetadata({ locale, path: `/universities/${slug}`, title: `${university.name} | Studiva`, description });
}

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-forest underline underline-offset-2 hover:text-brand">
      {label}: {hostOf(href)}
      <ExternalLink size={11} />
    </a>
  );
}

function ProvenanceTag({ kind, label }: { kind: "official" | "guidance"; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        kind === "official" ? "bg-forest-light text-forest" : "bg-accent-light text-accent-dark"
      }`}
    >
      {kind === "official" ? <ShieldCheck size={11} /> : <Info size={11} />}
      {label}
    </span>
  );
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const university = await getUniversityDetail(locale, slug);
  if (!university) notFound();

  const t = await getTranslations({ locale, namespace: "universities" });
  const d = await getTranslations({ locale, namespace: "discovery" });
  const images = universityMedia[slug] ?? [];
  const facts = university.facts;
  const lang = locale === "tr" ? "tr" : "en";
  const stateInfo = university.state ? STATE_BY_CODE[university.state] : null;
  const stateName = stateInfo?.name[lang] ?? null;

  const all = await getUniversitySummaries(locale);
  const related = all.filter((u) => u.slug !== slug && u.state && u.state === university.state).slice(0, 4);

  const tuition = facts?.nonEuTuition;
  const tuitionRange = tuition ? formatEurRange(tuition.minEur, tuition.maxEur, locale) : null;
  const tuitionNote = tuition ? (lang === "tr" ? tuition.noteTr : tuition.noteEn) : null;

  const competitionLabel = d(`compare.competition.${university.competitiveness}`);

  const breadcrumb = [
    { name: d("detail.breadcrumbHome"), url: `${SITE_URL}/${locale}` },
    { name: t("hero.title"), url: `${SITE_URL}/${locale}/universities` },
    { name: university.name, url: `${SITE_URL}/${locale}/universities/${slug}` },
  ];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: facts?.officialName ?? university.name,
      alternateName: university.name,
      ...(facts?.officialUrl ? { url: facts.officialUrl, sameAs: [facts.officialUrl] } : {}),
      foundingDate: university.founded,
      address: {
        "@type": "PostalAddress",
        ...(university.cities[0] ? { addressLocality: university.cities[0] } : {}),
        ...(stateInfo ? { addressRegion: stateInfo.name.de } : {}),
        addressCountry: "DE",
      },
      geo: { "@type": "GeoCoordinates", latitude: university.lat, longitude: university.lng },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: b.url })),
    },
  ];

  const missing = university.completeness.missing.map((f) => d(`detail.fields.${f}`)).join(", ");

  return (
    <>
      <DiscoveryNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="py-10 sm:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-forest">
                  {breadcrumb[0].name}
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden />
              <li>
                <Link href="/universities" className="hover:text-forest">
                  {breadcrumb[1].name}
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden />
              <li aria-current="page" className="text-foreground-secondary">
                {university.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="min-w-0 lg:col-span-3">
              <UniversityGallery images={images} name={university.name} />
            </Reveal>

            <Reveal delay={100} className="min-w-0 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag variant="neutral">{d(`types.${university.type}`)}</Tag>
                {university.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
                {university.badges.includes("excellence") && <Tag variant="brass">{lang === "tr" ? "Exzellenzuniversität" : "Excellence University"}</Tag>}
                <FeeBadge facts={facts} />
              </div>
              <Heading as="h1" size="lg" className="mt-3">
                {university.name}
              </Heading>
              {facts?.officialName && facts.officialName !== university.name && (
                <p className="mt-1 text-sm text-foreground-muted">{facts.officialName}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {university.cityLabel}
                  {stateInfo && (
                    <>
                      {" · "}
                      <Link href={`/germany/${stateInfo.slug}`} className="underline underline-offset-2 hover:text-forest">
                        {stateName}
                      </Link>
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {university.founded}
                </span>
              </div>
              <Dek className="mt-5 text-sm opacity-90">{university.description}</Dek>

              <div className="mt-5 flex flex-wrap gap-2">
                {facts?.officialUrl && (
                  <a
                    href={facts.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
                  >
                    {d("common.officialWebsite")}
                    <ExternalLink size={14} />
                    <span className="sr-only">{d("common.opensExternal")}</span>
                  </a>
                )}
                {facts?.internationalUrl && (
                  <a
                    href={facts.internationalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
                  >
                    {d("common.internationalPage")}
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <FavoriteButton slug={slug} name={university.name} withLabel />
                <CompareButton slug={slug} name={university.name} withLabel />
                <AddToPlannerButton slug={slug} name={university.name} label={d("detail.planner")} />
              </div>

              <dl className="mt-6 divide-y divide-border rounded-sm border border-border p-5">
                <div className="pb-3">
                  <dt className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
                    {d("fee.label")}
                    {tuition?.source ? <ProvenanceTag kind="official" label={d("common.official")} /> : null}
                  </dt>
                  <dd className="mt-1">
                    <span className="font-semibold text-foreground">
                      {d(`fee.${tuition?.status ?? "unknown"}`)}
                      {tuitionRange && ` · ${tuitionRange} ${d("common.perSemester")}`}
                    </span>
                    {tuitionNote && <p className="mt-1 text-xs leading-relaxed text-foreground-secondary">{tuitionNote}</p>}
                    {tuition?.source && (
                      <p className="mt-1">
                        <SourceLink href={tuition.source} label={d("common.source")} />
                      </p>
                    )}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{d("fee.contribution")}</dt>
                  <dd className="mt-1 text-sm text-foreground-secondary">
                    {facts?.semesterContribution.amountEur != null
                      ? `${formatEurRange(facts.semesterContribution.amountEur, null, locale)} (${facts.semesterContribution.term})`
                      : d("fee.contributionUnknown")}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{d("ownership.label")}</dt>
                  <dd className="text-right text-sm font-medium text-foreground">{facts?.ownership ? d(`ownership.${facts.ownership}`) : d("common.notVerified")}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">uni-assist</dt>
                  <dd className="text-right text-sm font-medium text-foreground">{facts?.uniAssistMember ? d("common.yes") : d("common.notVerified")}</dd>
                </div>
                {university.students && (
                  <div className="flex items-baseline justify-between gap-4 pt-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">{lang === "tr" ? "Öğrenci sayısı (yaklaşık)" : "Students (approx.)"}</dt>
                    <dd className="text-right text-sm font-medium text-foreground">{university.students}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="min-w-0 space-y-10 lg:col-span-2">
              <Section id="programs" title={d("detail.sections.programs")} kind="guidance" kindLabel={d("common.guidance")}>
                <p className="text-sm text-foreground-secondary">{d("detail.programsIntro")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {university.popularPrograms.map((p) => (
                    <Tag key={p} variant="neutral">
                      {p}
                    </Tag>
                  ))}
                </div>
                <p className="mt-4 text-sm text-foreground-secondary">
                  {d("detail.programsCatalog")}{" "}
                  <a href="https://www2.daad.de/deutschland/studienangebote/international-programmes/en/" target="_blank" rel="noopener noreferrer" className="font-semibold text-forest underline underline-offset-2 hover:text-brand">
                    {d("detail.daadDatabase")}
                  </a>
                  {facts?.officialUrl && (
                    <>
                      {" · "}
                      <a href={facts.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest underline underline-offset-2 hover:text-brand">
                        {hostOf(facts.officialUrl)}
                      </a>
                    </>
                  )}
                </p>
              </Section>

              <Section id="admission" title={d("detail.sections.admission")} kind="guidance" kindLabel={d("common.guidance")}>
                <p className="text-sm leading-relaxed text-foreground-secondary">{d(`detail.admissionGuidance.${university.type}`)}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{d("detail.languageGuidance")}</p>
                {university.languageSummary && (
                  <p className="mt-3 text-sm text-foreground-secondary">
                    <span className="font-semibold text-foreground">{d("detail.teachingLanguage")}:</span> {university.languageSummary}
                  </p>
                )}
                <p className="mt-3 text-xs text-foreground-muted">{d("common.guidanceNote")}</p>
              </Section>

              <Section id="fees" title={d("detail.sections.fees")}>
                <ul className="space-y-2 text-sm leading-relaxed text-foreground-secondary">
                  <li>{d("fee.explainTuition")}</li>
                  <li>{d("fee.explainContribution")}</li>
                  <li>{d("fee.explainLiving")}</li>
                </ul>
                <Link href="/cost-calculator" className="mt-3 inline-block text-sm font-semibold text-forest underline underline-offset-2 hover:text-brand">
                  {d("costs.title")} →
                </Link>
              </Section>

              <Section id="apply" title={d("detail.sections.application")}>
                <p className="text-sm leading-relaxed text-foreground-secondary">
                  {facts?.uniAssistMember ? d("detail.uniAssistMember") : d("detail.uniAssistUnknown")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{d("detail.applyChecklist")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AddToPlannerButton slug={slug} name={university.name} label={d("detail.planner")} />
                  {facts?.uniAssistMember && facts.uniAssistSource && <SourceLink href={facts.uniAssistSource} label={d("common.source")} />}
                </div>
              </Section>

              <Section id="scholarships" title={d("detail.sections.scholarships")}>
                <p className="text-sm leading-relaxed text-foreground-secondary">{d("detail.scholarshipsBody")}</p>
                <Link href="/scholarships" className="mt-2 inline-block text-sm font-semibold text-forest underline underline-offset-2 hover:text-brand">
                  {d("detail.scholarshipsLink")} →
                </Link>
              </Section>

              <div className="rounded-sm border border-border bg-background-secondary p-5">
                <div className="flex items-center justify-between gap-2">
                  <Heading as="h2" size="sm">
                    {lang === "tr" ? "Öne Çıkanlar" : "Highlights"}
                  </Heading>
                  <ProvenanceTag kind="guidance" label={d("common.guidance")} />
                </div>
                <ul className="mt-3 space-y-2">
                  {university.highlights.map((point) => (
                    <li key={point} className="font-sans text-sm leading-relaxed text-foreground-secondary">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="h-full rounded-sm border border-forest/30 bg-forest-light p-6">
                  <Heading as="h2" size="sm" className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-forest" />
                    {lang === "tr" ? "Artıları" : "Pros"}
                  </Heading>
                  <ul className="mt-4 space-y-3">
                    {university.pros.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-foreground-secondary">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-full rounded-sm border border-clay/30 bg-clay-light p-6">
                  <Heading as="h2" size="sm" className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-clay" />
                    {lang === "tr" ? "Dikkat Edilmesi Gerekenler" : "Things to Consider"}
                  </Heading>
                  <ul className="mt-4 space-y-3">
                    {university.cons.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-foreground-secondary">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-clay" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-xs text-foreground-muted">
                {d("compare.rows.competition")}: {competitionLabel} — {d("common.guidanceNote")}
              </p>
            </div>

            <aside className="min-w-0 space-y-8">
              <Section id="location" title={d("detail.sections.location")}>
                <p className="text-sm text-foreground-secondary">
                  {d("detail.locationBody", { city: university.cities.map((c) => cityName(c, locale)).join(", ") || university.cityLabel, state: stateName ?? "—" })}
                </p>
                {university.multiCampus && <p className="mt-1 text-xs text-foreground-muted">{d("common.multiCampus")}</p>}
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  {university.cities[0] && (
                    <Link href={`/universities?city=${encodeURIComponent(university.cities[0])}`} className="font-semibold text-forest underline underline-offset-2 hover:text-brand">
                      {d("detail.showOnMap")}
                    </Link>
                  )}
                  {stateInfo && (
                    <Link href={`/germany/${stateInfo.slug}`} className="font-semibold text-forest underline underline-offset-2 hover:text-brand">
                      {d("detail.explorState", { state: stateName! })}
                    </Link>
                  )}
                </div>
              </Section>

              <Section id="links" title={d("detail.sections.links")}>
                {facts?.officialUrl ? (
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href={facts.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-forest hover:text-brand">
                        {d("common.officialWebsite")} <ExternalLink size={12} />
                      </a>
                      <span className="block text-xs text-foreground-muted">{hostOf(facts.officialUrl)}</span>
                    </li>
                    {facts.internationalUrl && (
                      <li>
                        <a href={facts.internationalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-forest hover:text-brand">
                          {d("common.internationalPage")} <ExternalLink size={12} />
                        </a>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-foreground-muted">{d("detail.noOfficialUrl")}</p>
                )}
              </Section>

              {related.length > 0 && stateName && (
                <Section id="related" title={d("detail.relatedSameState", { state: stateName })}>
                  <ul className="space-y-2">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/universities/${r.slug}`} className="text-sm font-medium text-foreground-secondary hover:text-forest">
                          {r.name}
                        </Link>
                        <span className="block text-xs text-foreground-muted">{r.cityLabel}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <DataFreshness university={university} missing={missing} d={d} locale={locale} />
              <ReportForm slug={slug} />
            </aside>
          </div>
          <p className="mt-10 text-xs text-foreground-muted">{d("detail.factsVsGuidance")} {d("common.verifyNotice")}</p>
        </Container>
      </section>

      <CtaBand
        variant="universityDetail"
        title={t("ctaDetail.title", { name: university.name })}
        subtitle={t("ctaDetail.subtitle")}
        buttonLabel={t("cta.button")}
      />

      <section className="py-14">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <details className="group rounded-sm border border-border">
              <summary className="cursor-pointer list-none p-5 font-sans text-sm font-semibold uppercase tracking-wide text-foreground-secondary marker:content-none">
                <span className="inline-flex items-center gap-2">
                  {lang === "tr" ? "Kurum Hakkında — Tarihçe" : "About the Institution — History"}
                  <span className="transition-transform duration-200 group-open:rotate-180">⌄</span>
                </span>
              </summary>
              <div className="space-y-4 px-5 pb-5">
                {university.history.map((paragraph, i) => (
                  <p key={i} className="font-sans text-sm leading-relaxed text-foreground-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function Section({
  id,
  title,
  kind,
  kindLabel,
  children,
}: {
  id: string;
  title: string;
  kind?: "official" | "guidance";
  kindLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <Heading as="h2" size="sm" className="!text-lg">
          <span id={`${id}-title`}>{title}</span>
        </Heading>
        {kind && kindLabel && <ProvenanceTag kind={kind} label={kindLabel} />}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DataFreshness({
  university,
  missing,
  d,
  locale,
}: {
  university: UniversityDetail;
  missing: string;
  d: Awaited<ReturnType<typeof getTranslations>>;
  locale: string;
}) {
  const facts = university.facts;
  const { filled, total } = university.completeness;
  const sources = facts
    ? (
        [
          [d("common.officialWebsite"), facts.officialUrl],
          [d("fee.label"), facts.nonEuTuition.source],
          ["uni-assist", facts.uniAssistSource],
          [d("common.internationalPage"), facts.internationalUrl],
        ] as const
      ).filter((entry): entry is readonly [string, string] => Boolean(entry[1]))
    : [];
  return (
    <Section id="data" title={d("detail.sections.data")}>
      {facts && (
        <p className="text-sm text-foreground-secondary">
          {d("detail.lastChecked")}: <span className="font-semibold text-foreground">{formatDate(facts.checkedAt, locale)}</span>
        </p>
      )}
      <div className="mt-2" aria-hidden>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-secondary">
          <div className="h-full bg-forest" style={{ width: `${(filled / total) * 100}%` }} />
        </div>
      </div>
      <p className="mt-1 text-xs text-foreground-secondary">{d("detail.completeness", { filled, total })}</p>
      {missing && <p className="mt-1 text-xs text-foreground-muted">{d("detail.missingFields", { fields: missing })}</p>}
      {sources.length > 0 && (
        <ul className="mt-3 space-y-1">
          {sources.map(([label, url]) => (
            <li key={label}>
              <SourceLink href={url} label={label} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
