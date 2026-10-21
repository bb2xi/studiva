import { setRequestLocale, getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { Heading } from "@/components/Typography";
import { heroPhotos } from "@/lib/heroPhotos";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: `${t("hero.title")} | Studiva` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const common = await getTranslations({ locale, namespace: "common" });

  const infoRows = [
    { icon: MapPin, label: t("info.addressLabel"), value: t("info.address") },
    { icon: Phone, label: t("info.phoneLabel"), value: t("info.phone") },
    { icon: Mail, label: t("info.emailLabel"), value: t("info.email") },
    { icon: Clock, label: t("info.hoursLabel"), value: t("info.hours") },
  ];

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(common("whatsappMessage"))}`;

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.contact} />

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl rounded-sm border border-clay/30 bg-clay-light p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-clay text-white">
              <MessageCircle size={20} />
            </div>
            <Heading as="h2" size="sm" className="mt-3">
              {t("scheduling.title")}
            </Heading>
            <p className="mt-2 font-serif text-sm leading-relaxed opacity-80">{t("scheduling.description")}</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-clay px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-clay-dark active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2"
            >
              <MessageCircle size={16} />
              {t("scheduling.button")}
            </a>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <Heading as="h3" size="sm">
                {t("info.title")}
              </Heading>
              <div className="mt-6 space-y-6">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border-strong text-forest">
                      <row.icon size={18} />
                    </span>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                        {row.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-3">
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
