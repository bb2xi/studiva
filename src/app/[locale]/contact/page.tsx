import { setRequestLocale, getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

const WHATSAPP_NUMBER = "905325550101";

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

  const infoRows = [
    { icon: MapPin, label: t("info.addressLabel"), value: t("info.address") },
    { icon: Phone, label: t("info.phoneLabel"), value: t("info.phone") },
    { icon: Mail, label: t("info.emailLabel"), value: t("info.email") },
    { icon: Clock, label: t("info.hoursLabel"), value: t("info.hours") },
  ];

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t("info.title")}
              </h3>
              <div className="mt-6 space-y-6">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                      <row.icon size={18} />
                    </span>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                        {row.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-light p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                    <MessageCircle size={18} />
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {t("scheduling.title")}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                  {t("scheduling.description")}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
                >
                  <MessageCircle size={16} />
                  {t("scheduling.button")}
                </a>
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
