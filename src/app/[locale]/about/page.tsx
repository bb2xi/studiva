import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Heading, Data } from "@/components/Typography";
import { MentorCardComingSoon } from "@/components/MentorCard";
import { heroPhotos } from "@/lib/heroPhotos";

type ValueItem = { title: string; description: string };
type Stat = { value: string; label: string; highlight?: boolean };

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
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.about} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <Heading as="h2" size="lg">
                {t("story.title")}
              </Heading>
              <div className="mt-5 space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif text-sm leading-relaxed text-foreground-secondary sm:text-base">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-sm border border-forest/25 bg-forest-light p-8">
                <Heading as="h3" size="sm">
                  {t("mission.title")}
                </Heading>
                <p className="mt-3 font-serif text-sm leading-relaxed text-foreground-secondary">
                  {t("mission.description")}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="mt-16 grid grid-cols-2 gap-px divide-border border-y border-border sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-6 text-center">
                  <Data as="div" className={`text-2xl font-bold sm:text-3xl ${stat.highlight ? "text-accent-dark" : "text-forest"}`}>
                    {stat.value}
                  </Data>
                  <div className="mt-1.5 font-sans text-xs uppercase tracking-wide text-foreground-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background-secondary py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={t("values.title")} />
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <Data as="span" className="font-display text-xl italic text-accent">
                  {String(index + 1).padStart(2, "0")}
                </Data>
                <Heading as="h3" size="sm" className="mt-2">
                  {value.title}
                </Heading>
                <p className="mt-2 font-serif text-sm leading-relaxed text-foreground-secondary">{value.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={t("team.title")} />
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-10 max-w-xl">
            <MentorCardComingSoon label={t("team.comingSoonLabel")} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
