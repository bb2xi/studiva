import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Sparkles, HeartHandshake, Target, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import HeroBackground from "@/components/HeroBackground";
import Reveal from "@/components/Reveal";
import { serviceIcons } from "@/lib/icons";
import { universityMedia, universityLogos } from "@/lib/universityMedia";

type ServiceItem = { icon: string; title: string; description: string };
type ProcessStep = { title: string; description: string };
type WhyUsItem = { title: string; description: string };
type ProgramItem = { name: string; icon: string };
type UniversityItem = { slug: string; name: string; city: string; type: string; badges: string[] };
type Stat = { value: string; label: string };

const whyUsIcons = [Target, ShieldCheck, Sparkles, HeartHandshake];
// A curated spread across Exzellenzuniversität, TU9 and Hochschule institutions for the homepage teaser.
const UNIVERSITY_PREVIEW_SLUGS = ["tum", "heidelberg", "rwth", "tuebingen", "tudresden", "htwberlin"];
// Real campus photos for the showcase band, same diverse spread.
const SHOWCASE_SLUGS = ["tum", "heidelberg", "tuebingen", "bonn", "freiburg", "tudresden"];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const home = await getTranslations({ locale, namespace: "home" });
  const programsT = await getTranslations({ locale, namespace: "programs" });
  const universitiesT = await getTranslations({ locale, namespace: "universities" });

  const stats = home.raw("hero.stats") as Stat[];
  const services = home.raw("services.items") as ServiceItem[];
  const steps = home.raw("process.steps") as ProcessStep[];
  const whyUsItems = home.raw("whyUs.items") as WhyUsItem[];
  const programItems = programsT.raw("items") as ProgramItem[];
  const allUniversityItems = universitiesT.raw("items") as UniversityItem[];
  const universityItems = UNIVERSITY_PREVIEW_SLUGS.map((slug) =>
    allUniversityItems.find((u) => u.slug === slug)
  ).filter((u): u is UniversityItem => Boolean(u));
  const showcasePhotos = SHOWCASE_SLUGS.map((slug) => ({
    slug,
    name: allUniversityItems.find((u) => u.slug === slug)?.name ?? slug,
    image: universityMedia[slug]?.[0],
  })).filter((p) => Boolean(p.image));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <HeroBackground />
        <Container className="relative py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-emerald-200 backdrop-blur-sm">
              {home("hero.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {home("hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              {home("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {home("hero.ctaPrimary")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {home("hero.ctaSecondary")}
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-accent">
              <ShieldCheck size={16} className="shrink-0" />
              {home("hero.guaranteeNote")}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl font-bold ${index === 0 ? "text-accent" : "text-white"}`}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services preview */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Studiva"
              title={home("services.title")}
              subtitle={home("services.subtitle")}
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon] ?? Check;
              return (
                <Reveal key={service.title} delay={index * 60}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-lg">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                      {service.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {home("services.linkText")}
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Programs strip */}
      <section className="border-y border-border bg-background-secondary py-20">
        <Container>
          <Reveal>
            <SectionHeading
              title={home("programs.title")}
              subtitle={home("programs.subtitle")}
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {programItems.map((program) => {
                const Icon = serviceIcons[program.icon] ?? Check;
                return (
                  <div
                    key={program.name}
                    className="flex items-center gap-3 rounded-full border border-border-strong bg-surface px-5 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-brand">
                      <Icon size={15} />
                    </span>
                    <span className="text-sm font-medium text-foreground-secondary">
                      {program.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <div className="mt-10 text-center">
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {home("programs.linkText")}
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Universities preview */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              title={home("universities.title")}
              subtitle={home("universities.subtitle")}
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universityItems.map((uni, index) => {
              const logo = universityLogos[uni.slug];
              const fallbackCover = universityMedia[uni.slug]?.[0];
              return (
                <Reveal key={uni.name} delay={index * 60}>
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                  >
                    {logo ? (
                      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-background-secondary p-8">
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
                        {uni.badges.includes("excellence") && (
                          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            {locale === "tr" ? "Exzellenz" : "Excellence"}
                          </span>
                        )}
                      </div>
                    ) : fallbackCover ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-background-secondary">
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
                        {uni.badges.includes("excellence") && (
                          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            {locale === "tr" ? "Exzellenz" : "Excellence"}
                          </span>
                        )}
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-brand">
                        {uni.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                        <MapPin size={13} />
                        {uni.city}
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                        {locale === "tr" ? "Detayları Gör" : "View Details"}
                        <ArrowUpRight
                          size={13}
                          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/universities"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {home("universities.linkText")}
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Campus showcase — real, licensed campus photography, unified with a brand-green duotone treatment */}
      {showcasePhotos.length > 0 && (
        <section className="relative overflow-hidden bg-slate-950 py-4">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
            {showcasePhotos.map((photo) => (
              <div key={photo.slug} className="group relative aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image!.url}
                  alt={photo.name}
                  loading="lazy"
                  className="h-full w-full scale-105 object-cover opacity-70 saturate-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 truncate text-xs font-medium text-white/90">
                  {photo.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Process */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              title={home("process.title")}
              subtitle={home("process.subtitle")}
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="bg-background-secondary py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={home("whyUs.title")} />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUsItems.map((item, index) => {
              const Icon = whyUsIcons[index % whyUsIcons.length];
              const isGuarantee = index === 1;
              return (
                <Reveal key={item.title} delay={index * 70}>
                  <div
                    className={`h-full rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${
                      isGuarantee ? "border-accent/30 bg-accent-light" : "border-border bg-surface"
                    }`}
                  >
                    <span
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${
                        isGuarantee ? "bg-accent/15 text-accent-dark" : "bg-brand-light text-brand"
                      }`}
                    >
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-brand">
        <Container className="flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {home("cta.title")}
          </h2>
          <p className="max-w-xl text-green-100">{home("cta.subtitle")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-all duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            {home("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
