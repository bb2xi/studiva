import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, CalendarDays, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import UniversityGallery from "@/components/UniversityGallery";
import Reveal from "@/components/Reveal";
import { universityMedia } from "@/lib/universityMedia";

type UniversityItem = {
  slug: string;
  country: string;
  name: string;
  city: string;
  type: string;
  founded: string;
  description: string;
  history: string[];
  highlights: string[];
  pros: string[];
  cons: string[];
};

type CountryMeta = { name: string; flag: string };

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
  const countries = t.raw("countries") as Record<string, CountryMeta>;
  const countryMeta = countries[university.country];

  return (
    <>
      <section className="py-10 sm:py-14">
        <Container>
          <Link
            href="/universities"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
            {t("hero.title")}
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <UniversityGallery images={images} name={university.name} />
            </Reveal>

            <Reveal delay={100} className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                  {university.type}
                </span>
                {countryMeta && (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-background-secondary px-3 py-1 text-xs font-semibold text-foreground-secondary">
                    <span>{countryMeta.flag}</span>
                    {countryMeta.name}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                {university.name}
              </h1>
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
              <p className="mt-5 text-sm leading-relaxed text-foreground-secondary">
                {university.description}
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-background-secondary p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles size={16} className="text-brand" />
                  {locale === "tr" ? "Öne Çıkanlar" : "Highlights"}
                </h2>
                <ul className="mt-3 space-y-2">
                  {university.highlights.map((point) => (
                    <li
                      key={point}
                      className="text-sm leading-relaxed text-foreground-secondary"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  {locale === "tr" ? "Artıları" : "Pros"}
                </h2>
                <ul className="mt-4 space-y-3">
                  {university.pros.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground-secondary">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 dark:border-amber-500/20 dark:bg-amber-500/5">
                <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <AlertTriangle size={18} className="text-amber-600" />
                  {locale === "tr" ? "Dikkat Edilmesi Gerekenler" : "Things to Consider"}
                </h2>
                <ul className="mt-4 space-y-3">
                  {university.cons.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground-secondary">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-14 max-w-3xl">
            <h2 className="text-xl font-bold text-foreground">
              {locale === "tr" ? "Tarihçe" : "History"}
            </h2>
            <div className="mt-4 space-y-4">
              {university.history.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-foreground-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-brand">
        <Container className="flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="max-w-xl text-blue-100">{t("cta.subtitle")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-all duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            {t("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
