import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { universityMedia, universityLogos } from "@/lib/universityMedia";

type UniversityItem = {
  slug: string;
  name: string;
  city: string;
  type: string;
  description: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "universities" });
  return { title: `${t("hero.title")} | Studiva` };
}

export default async function UniversitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "universities" });
  const items = t.raw("items") as UniversityItem[];

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((uni) => {
              const logo = universityLogos[uni.slug];
              const fallbackCover = universityMedia[uni.slug]?.[0];
              return (
                <Link
                  key={uni.name}
                  href={`/universities/${uni.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {logo ? (
                    <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-slate-50 p-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.url}
                        alt={uni.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain grayscale opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand shadow-sm backdrop-blur">
                        {uni.type}
                      </span>
                    </div>
                  ) : fallbackCover ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fallbackCover.url}
                        alt={uni.name}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand shadow-sm backdrop-blur">
                        {uni.type}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand">
                      {uni.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={13} />
                      {uni.city}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                      {uni.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                      {locale === "tr" ? "Detayları Gör" : "View Details"}
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
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
