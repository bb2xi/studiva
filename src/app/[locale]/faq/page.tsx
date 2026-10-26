import { pageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading } from "@/components/Typography";
import { heroPhotos } from "@/lib/heroPhotos";

type FaqItem = { question: string; answer: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return pageMetadata({ locale, path: "/faq", title: `${t("title")} | Studiva`, description: t("subtitle") });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "faq" });
  const home = await getTranslations({ locale, namespace: "home" });
  const items = t.raw("items") as FaqItem[];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} photo={heroPhotos.services} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-[42rem] divide-y divide-border">
            {items.map((item, i) => (
              <Reveal key={i} delay={(i % 8) * 40}>
                <details className="group py-6 first:pt-0 last:pb-0" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                    <Heading as="h2" size="sm">
                      {item.question}
                    </Heading>
                    <span className="mt-1 shrink-0 font-sans text-lg text-accent transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-foreground-secondary sm:text-base">
                    {item.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand variant="blog" title={home("cta.title")} subtitle={home("cta.subtitle")} buttonLabel={home("cta.button")} />
    </>
  );
}
