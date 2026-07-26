import { setRequestLocale, getTranslations } from "next-intl/server";
import { Compass, Users, ShieldCheck, Award } from "lucide-react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";

type ValueItem = { title: string; description: string };
type Stat = { value: string; label: string };

const valueIcons = [ShieldCheck, Compass, Award, Users];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: `${t("hero.title")} | Studiva` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const paragraphs = t.raw("story.paragraphs") as string[];
  const values = t.raw("values.items") as ValueItem[];
  const stats = t.raw("stats") as Stat[];

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {t("story.title")}
              </h2>
              <div className="mt-5 space-y-4">
                {paragraphs.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-slate-600">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-brand-light p-8">
              <h3 className="text-lg font-semibold text-slate-900">
                {t("mission.title")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {t("mission.description")}
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-y border-slate-100 py-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-brand">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHeading title={t("values.title")} />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
