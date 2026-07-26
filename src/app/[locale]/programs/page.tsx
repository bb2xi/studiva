import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

type ProgramItem = {
  name: string;
  flag: string;
  description: string;
  highlights: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "programs" });
  return { title: `${t("hero.title")} | Studiva` };
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "programs" });
  const items = t.raw("items") as ProgramItem[];

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((program) => (
              <div
                key={program.name}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{program.flag}</span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {program.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {program.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {program.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-brand" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
