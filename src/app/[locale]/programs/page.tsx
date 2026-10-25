import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading, Data } from "@/components/Typography";
import { heroPhotos } from "@/lib/heroPhotos";

type ProgramItem = {
  name: string;
  icon: string;
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
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.programs} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((program, index) => (
              <Reveal key={program.name} delay={index * 100}>
                <Link
                  href={`/universities?level=${index === 0 ? "bachelor" : "master"}`}
                  className="group flex h-full flex-col rounded-sm border border-border-strong bg-surface p-8"
                >
                  <Data as="span" className="font-display text-3xl italic text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </Data>
                  <Heading as="h2" size="lg" className="mt-4 transition-colors group-hover:text-forest">
                    {program.name}
                  </Heading>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-foreground-secondary sm:text-base">
                    {program.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {program.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2 font-sans text-sm text-foreground-secondary">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wide text-forest">
                    {locale === "tr" ? "Üniversiteleri gör" : "See universities"}
                    <ArrowUpRight size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand variant="programs" title={t("cta.title")} subtitle={t("cta.subtitle")} buttonLabel={t("cta.button")} />
    </>
  );
}
