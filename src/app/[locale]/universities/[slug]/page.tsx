import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import UniversityGallery from "@/components/UniversityGallery";
import { universityMedia } from "@/lib/universityMedia";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  founded: string;
  description: string;
  history: string[];
  highlights: string[];
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

  return (
    <>
      <section className="py-10 sm:py-14">
        <Container>
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <ArrowLeft size={16} />
            {t("hero.title")}
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <UniversityGallery images={images} name={university.name} />
            </div>

            <div className="lg:col-span-2">
              <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                {university.type}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {university.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {university.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {university.founded}
                </span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                {university.description}
              </p>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles size={16} className="text-brand" />
                  {locale === "tr" ? "Öne Çıkanlar" : "Highlights"}
                </h2>
                <ul className="mt-3 space-y-2">
                  {university.highlights.map((point) => (
                    <li
                      key={point}
                      className="text-sm leading-relaxed text-slate-700"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900">
              {locale === "tr" ? "Tarihçe" : "History"}
            </h2>
            <div className="mt-4 space-y-4">
              {university.history.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-transform hover:scale-105"
          >
            {t("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
