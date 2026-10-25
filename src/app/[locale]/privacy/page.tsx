import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Heading } from "@/components/Typography";

type PrivacySection = { heading: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: `${t("title")} | Studiva` };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacy" });
  const sections = t.raw("sections") as PrivacySection[];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-[42rem]">
            <p className="font-sans text-xs uppercase tracking-wide text-foreground-muted">{t("updated")}</p>
            <div className="mt-8 space-y-10">
              {sections.map((section, i) => (
                <Reveal key={i} delay={(i % 6) * 50}>
                  <Heading as="h2" size="sm">
                    {section.heading}
                  </Heading>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-foreground-secondary sm:text-base">
                    {section.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
