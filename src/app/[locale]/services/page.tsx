import { pageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading, Dek, Data } from "@/components/Typography";
import { FactLedger } from "@/components/FactLedger";
import { heroPhotos } from "@/lib/heroPhotos";

type ServiceItem = {
  icon: string;
  title: string;
  description: string;
  points: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return pageMetadata({ locale, path: "/services", title: `${t("hero.title")} | Studiva`, description: t("hero.subtitle") });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });
  const items = t.raw("items") as ServiceItem[];
  const pricing = t.raw("pricing") as { title: string; subtitle: string; note: string };

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.services} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl divide-y divide-border">
            {items.map((service, index) => (
              <Reveal key={service.title} delay={(index % 6) * 60}>
                <div className="flex gap-5 py-8 first:pt-0 last:pb-0 sm:gap-8">
                  <Data as="span" className="shrink-0 font-display text-2xl italic text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </Data>
                  <div>
                    <Heading as="h3" size="sm">
                      {service.title}
                    </Heading>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-foreground-secondary sm:text-base">
                      {service.description}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 font-sans text-sm text-foreground-secondary">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-background-secondary py-20 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl rounded-sm border border-border bg-surface p-8">
            <Heading as="h2" size="sm">
              {pricing.title}
            </Heading>
            <Dek className="mt-2">{pricing.subtitle}</Dek>
            <FactLedger
              className="mt-6"
              rows={[
                {
                  label: locale === "tr" ? "İlk Ön Görüşme" : "First Consultation",
                  value: locale === "tr" ? "Ücretsiz" : "Free",
                  highlight: true,
                },
              ]}
            />
            <p className="mt-5 font-sans text-sm leading-relaxed text-foreground-secondary">{pricing.note}</p>
          </Reveal>
        </Container>
      </section>

      <CtaBand variant="services" title={t("cta.title")} subtitle={t("cta.subtitle")} buttonLabel={t("cta.button")} />
    </>
  );
}
