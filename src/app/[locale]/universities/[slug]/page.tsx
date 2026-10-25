import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CalendarDays, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import UniversityGallery from "@/components/UniversityGallery";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading, Dek } from "@/components/Typography";
import { Tag } from "@/components/Tag";
import { FactLedger } from "@/components/FactLedger";
import { universityMedia } from "@/lib/universityMedia";

type QuickFacts = { students: string; language: string; tuition: string };

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  founded: string;
  description: string;
  history: string[];
  highlights: string[];
  pros: string[];
  cons: string[];
  badges: string[];
  quickFacts: QuickFacts;
  popularPrograms: string[];
  tuitionFree: boolean;
  competitiveness: "low" | "medium" | "high";
  level: "bachelor" | "master" | "both";
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(universityMedia).map((slug) => ({ locale, slug }))
  );
}

async function getUniversity(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "universities" });
  const items = t.raw("items") as UniversityItem[];
  return items.find((item) => item.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const university = await getUniversity(locale, slug);
  if (!university) return {};
  return { title: `${university.name} | Studiva` };
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const university = await getUniversity(locale, slug);
  if (!university) notFound();

  const t = await getTranslations({ locale, namespace: "universities" });
  const images = universityMedia[slug] ?? [];

  const competitivenessLabel = {
    low: locale === "tr" ? "Standart Rekabet" : "Standard Competition",
    medium: locale === "tr" ? "Orta Rekabet" : "Medium Competition",
    high: locale === "tr" ? "Yüksek Rekabet" : "High Competition",
  }[university.competitiveness];
  const competitivenessVariant = university.competitiveness === "high" ? "clay" : "brass";

  const ledgerRows = [
    { label: locale === "tr" ? "Öğrenci Sayısı" : "Students", value: university.quickFacts.students },
    { label: locale === "tr" ? "Öğretim Dili" : "Teaching Language", value: university.quickFacts.language },
    { label: locale === "tr" ? "Ücret" : "Tuition", value: university.quickFacts.tuition },
    {
      label: locale === "tr" ? "Okul Ücreti (AB Dışı)" : "Tuition (Non-EU)",
      value: university.tuitionFree
        ? locale === "tr"
          ? "Yok"
          : "None"
        : locale === "tr"
          ? "Uygulanabilir"
          : "May Apply",
      highlight: university.tuitionFree,
    },
  ];

  return (
    <>
      <section className="py-10 sm:py-14">
        <Container>
          <Link
            href="/universities"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-brand"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
            {t("hero.title")}
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <UniversityGallery images={images} name={university.name} />
            </Reveal>

            <Reveal delay={100} className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag variant="neutral">{university.type}</Tag>
                {university.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
                {university.badges.includes("excellence") && (
                  <Tag variant="brass">{locale === "tr" ? "Exzellenzuniversität" : "Excellence University"}</Tag>
                )}
                <Tag variant={competitivenessVariant}>{competitivenessLabel}</Tag>
              </div>
              <Heading as="h1" size="lg" className="mt-3">
                {university.name}
              </Heading>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {university.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {university.founded}
                </span>
              </div>
              <Dek className="mt-5 text-sm opacity-90">{university.description}</Dek>

              <div className="mt-6 rounded-sm border border-border p-5">
                <FactLedger rows={ledgerRows} />
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="mt-10">
              <Heading as="h2" size="sm">
                {locale === "tr" ? "Popüler Bölümler" : "Popular Programs"}
              </Heading>
              <div className="mt-3 flex flex-wrap gap-2">
                {university.popularPrograms.map((program) => (
                  <Tag key={program} variant="neutral">
                    {program}
                  </Tag>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-6 rounded-sm border border-border bg-background-secondary p-5">
              <Heading as="h2" size="sm">
                {locale === "tr" ? "Öne Çıkanlar" : "Highlights"}
              </Heading>
              <ul className="mt-3 space-y-2">
                {university.highlights.map((point) => (
                  <li key={point} className="font-sans text-sm leading-relaxed text-foreground-secondary">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-sm border border-forest/30 bg-forest-light p-6">
                <Heading as="h2" size="sm" className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-forest" />
                  {locale === "tr" ? "Artıları" : "Pros"}
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
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full rounded-sm border border-clay/30 bg-clay-light p-6">
                <Heading as="h2" size="sm" className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-clay" />
                  {locale === "tr" ? "Dikkat Edilmesi Gerekenler" : "Things to Consider"}
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
            </Reveal>
          </div>
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
                  {locale === "tr" ? "Kurum Hakkında — Tarihçe" : "About the Institution — History"}
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
