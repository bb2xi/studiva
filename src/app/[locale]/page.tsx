import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, MapPin, GraduationCap, CalendarDays, FileCheck, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import HeroBackground from "@/components/HeroBackground";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { Heading, Dek, Label, Data } from "@/components/Typography";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import { MentorCardComingSoon } from "@/components/MentorCard";
import { universityMedia, universityLogos } from "@/lib/universityMedia";
import { heroPhotos } from "@/lib/heroPhotos";
import { getUniversitySummaries } from "@/lib/universities";
import { pageMetadata } from "@/lib/seo";
import type { UniversitySummary } from "@/lib/discovery/types";

type ServiceItem = { icon: string; title: string; description: string };
type ProcessStep = { title: string; description: string };
type ProcessFact = { label: string; text: string; slug?: string };
type ProgramItem = { name: string; icon: string; description: string; homeNote: string };
type Stat = { value: string; label: string; highlight?: boolean; kind?: "number" | "text" };
type TrustItem = { title: string; text: string };
type FaqItem = { question: string; answer: string };
type BlogPost = { slug: string; title: string; excerpt: string; category: string };

const FILTER_KEYS = ["universitat", "hochschule", "dual", "tu9", "excellence"] as const;

// A curated spread across Exzellenzuniversität, TU9 and Hochschule institutions for the homepage teaser.
const UNIVERSITY_PREVIEW_SLUGS = ["tum", "heidelberg", "rwth", "tuebingen", "tudresden", "htwberlin"];
// Real campus photos for the showcase band, same diverse spread.
const SHOWCASE_SLUGS = ["tum", "heidelberg", "tuebingen", "bonn", "freiburg", "tudresden"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta" });
  const home = await getTranslations({ locale, namespace: "home" });
  return pageMetadata({ locale, path: "", title: `${meta("siteName")} | ${meta("tagline")}`, description: home("hero.subtitle") });
}

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
  const aboutT = await getTranslations({ locale, namespace: "about" });
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const blogT = await getTranslations({ locale, namespace: "blog" });

  const stats = home.raw("hero.stats") as Stat[];
  const trustItems = home.raw("hero.trust.items") as TrustItem[];
  const services = home.raw("services.items") as ServiceItem[];
  const steps = home.raw("process.steps") as ProcessStep[];
  const facts = home.raw("process.facts") as ProcessFact[];
  const guideSlugs = home.raw("whyUs.guideSlugs") as string[];
  const faqIndices = home.raw("faqTeaser.indices") as number[];
  const programItems = programsT.raw("items") as ProgramItem[];
  const allUniversityItems = await getUniversitySummaries(locale);
  const universityFilters = universitiesT.raw("filters") as Record<string, string>;
  const universityItems = UNIVERSITY_PREVIEW_SLUGS.map((slug) =>
    allUniversityItems.find((u) => u.slug === slug)
  ).filter((u): u is UniversitySummary => Boolean(u));
  const showcasePhotos = SHOWCASE_SLUGS.map((slug) => ({
    slug,
    name: allUniversityItems.find((u) => u.slug === slug)?.name ?? slug,
    image: universityMedia[slug]?.[0],
  })).filter((p) => Boolean(p.image));
  const faqItems = (faqT.raw("items") as FaqItem[]) ?? [];
  const featuredFaqItems = faqIndices.map((i) => faqItems[i]).filter((i): i is FaqItem => Boolean(i));
  const allBlogPosts = blogT.raw("posts") as BlogPost[];
  const guidePosts = guideSlugs.map((slug) => allBlogPosts.find((p) => p.slug === slug)).filter((p): p is BlogPost => Boolean(p));
  const expertiseNote = (aboutT.raw("values.items") as { title: string; description: string }[])[2]?.description;
  const FILTER_TYPE_MATCH: Record<string, (u: UniversitySummary) => boolean> = {
    universitat: (u) => u.type === "Universität",
    hochschule: (u) => u.type === "Fachhochschule",
    dual: (u) => u.type === "Duale Hochschule",
    tu9: (u) => u.badges.includes("tu9"),
    excellence: (u) => u.badges.includes("excellence"),
  };
  const filterChips = FILTER_KEYS.map((key) => ({
    key,
    label: universityFilters[key],
    count: allUniversityItems.filter(FILTER_TYPE_MATCH[key]).length,
  }));

  return (
    <>
      {/* Masthead hero */}
      <section className="bg-grain relative overflow-hidden bg-[#15130f]">
        <HeroBackground photo={heroPhotos.home} />
        <Container className="relative py-28 sm:py-32">
          <div className="max-w-2xl text-white">
            <Label as="span" className="text-accent opacity-100">
              {home("hero.badge")}
            </Label>
            <Heading as="h1" size="xl" className="mt-4">
              {home("hero.title")}
            </Heading>
            <Dek className="mt-6 max-w-xl">{home("hero.subtitle")}</Dek>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button href="/contact">
                {home("hero.ctaPrimary")}
                <ArrowRight size={16} />
              </Button>
              <Button href="/programs" variant="secondary" invert>
                {home("hero.ctaSecondary")}
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 divide-x divide-white/15 border-y border-white/15 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-5 text-center first:pl-0 last:pr-0">
                <Data
                  as="div"
                  kind={stat.kind}
                  className={`text-2xl font-bold sm:text-3xl ${stat.highlight ? "text-accent" : "text-white"}`}
                >
                  {stat.value}
                </Data>
                <div className="mt-1.5 font-sans text-xs uppercase tracking-wide text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Condenses the 3 highest-friction pre-click questions (guarantee
              conditions, real cost, geographic scope) straight from the FAQ,
              so a hesitant visitor never has to leave the hero to find them. */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.title} className="text-center sm:text-left">
                <div className="font-sans text-xs font-semibold uppercase tracking-wide text-accent">{item.title}</div>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {home("hero.trust.linkText")}
            </Link>
          </div>
        </Container>
      </section>

      {/* Campus showcase — leads with the real differentiator, directly under the hero */}
      {showcasePhotos.length > 0 && (
        <section className="relative overflow-hidden bg-[#15130f] py-4">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
            {showcasePhotos.map((photo) => (
              <div key={photo.slug} className="group relative aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image!.url}
                  alt={photo.name}
                  loading="lazy"
                  className="h-full w-full scale-105 object-cover transition-transform duration-500 ease-out group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15130f]/85 via-[#15130f]/10 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 truncate font-sans text-xs font-medium text-white/90">
                  {photo.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services as a contents list */}
      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Studiva" title={home("services.title")} subtitle={home("services.subtitle")} />
          </Reveal>
          <div className="mx-auto mt-14 max-w-3xl divide-y divide-border">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 50}>
                <div className="flex gap-5 py-6 first:pt-0 last:pb-0 sm:gap-8">
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
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-brand"
            >
              {home("services.linkText")}
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Programs — Bachelor vs Master, wired straight into the Universities level filter */}
      <section className="border-y border-border bg-background-secondary py-24">
        <Container>
          <Reveal>
            <SectionHeading title={home("programs.title")} subtitle={home("programs.subtitle")} />
          </Reveal>
          <Reveal delay={100}>
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
              {programItems.map((program, index) => (
                <Link
                  key={program.name}
                  href={`/universities?level=${index === 0 ? "bachelor" : "master"}`}
                  className="group rounded-sm border border-border-strong bg-surface p-6"
                >
                  <GraduationCap size={22} className="text-forest" />
                  <Heading as="h3" size="sm" className="mt-3 transition-colors group-hover:text-forest">
                    {program.name}
                  </Heading>
                  <p className="mt-1 font-sans text-xs font-medium text-accent-dark">{program.homeNote}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-foreground-secondary">
                    {program.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest">
                    {locale === "tr" ? "Üniversiteleri gör" : "See universities"}
                    <ArrowUpRight size={13} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Universities feature spread */}
      <section className="py-24 sm:py-28">
        <Container bleed>
          <Reveal>
            <SectionHeading title={home("universities.title")} subtitle={home("universities.subtitle")} />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroPhotos.universities.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 font-sans text-[11px] text-foreground-muted">
                {heroPhotos.universities.artist} · {heroPhotos.universities.license}
              </p>
              <Link
                href="/universities"
                className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest transition-colors hover:text-brand"
              >
                {locale === "tr"
                  ? "82 gerçek üniversiteden biri — aranabilir haritayı keşfedin"
                  : "One of 82 real universities — explore the searchable map"}
                <ArrowUpRight size={13} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-3">
              <div className="divide-y divide-border">
                {universityItems.map((uni) => {
                  const logo = universityLogos[uni.slug];
                  return (
                    <Link
                      key={uni.slug}
                      href={`/universities/${uni.slug}`}
                      className="group flex items-center gap-4 py-4 first:pt-0"
                    >
                      {logo && (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-surface p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.url} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <Heading as="h3" size="sm" className="truncate transition-colors group-hover:text-forest">
                          {uni.name}
                        </Heading>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                          <MapPin size={12} />
                          {uni.cityLabel}
                        </div>
                      </div>
                      <div className="hidden shrink-0 gap-1.5 sm:flex">
                        {uni.badges.includes("excellence") && <Tag variant="brass">Exzellenz</Tag>}
                        {uni.badges.includes("tu9") && <Tag variant="institutional">TU9</Tag>}
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-foreground-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest"
                      />
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {filterChips.map((chip) => (
                  <Link
                    key={chip.key}
                    href={`/universities?${chip.key === "tu9" || chip.key === "excellence" ? "badge" : "type"}=${chip.key}`}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-border-strong px-3.5 py-1.5 text-xs font-semibold text-foreground-secondary transition-colors hover:border-forest hover:text-forest"
                  >
                    {chip.label}
                    <span className="text-foreground-muted">({chip.count})</span>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/universities"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-brand"
                >
                  {home("universities.linkText")}
                  <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process as an annotated timeline */}
      <section className="bg-background-secondary py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading title={home("process.title")} subtitle={home("process.subtitle")} />
          </Reveal>
          <div className="mx-auto mt-14 max-w-2xl">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 70}>
                <div className="relative border-l-2 border-accent/30 py-1 pb-10 pl-10 last:pb-0">
                  <Data
                    as="span"
                    kind="number"
                    className="absolute left-0 top-0 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-accent bg-background text-sm font-bold text-accent-dark"
                  >
                    {index + 1}
                  </Data>
                  <Heading as="h3" size="sm">
                    {step.title}
                  </Heading>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-foreground-secondary">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Concrete, checkable facts (not marketing language) behind the
              "Application & Visa Process" step — gives the otherwise-orphaned
              APS/Sperrkonto guides their first homepage entry point. */}
          <Reveal delay={140}>
            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {facts.map((fact, i) => {
                const Icon = [CalendarDays, FileCheck, Wallet][i] ?? CalendarDays;
                const content = (
                  <>
                    <Icon size={18} className="text-forest" />
                    <div className="mt-2 font-sans text-xs font-semibold uppercase tracking-wide text-foreground">
                      {fact.label}
                    </div>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-foreground-secondary">{fact.text}</p>
                  </>
                );
                return fact.slug ? (
                  <Link
                    key={fact.label}
                    href={`/blog/${fact.slug}`}
                    className="group rounded-sm border border-border bg-surface p-4 transition-colors hover:border-forest"
                  >
                    {content}
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest">
                      {locale === "tr" ? "Oku" : "Read"}
                      <ArrowUpRight size={12} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                ) : (
                  <div key={fact.label} className="rounded-sm border border-border bg-surface p-4">
                    {content}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* What You Should Know — real published guides, not a restated manifesto.
          Pairs naturally with the team-placeholder card: "here's the expertise
          behind the guidance" instead of a dead-end "no team yet" card alone. */}
      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading title={home("whyUs.title")} subtitle={home("whyUs.subtitle")} />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {guidePosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-sm border border-border bg-surface p-5"
                  >
                    <Tag variant="forest">{post.category}</Tag>
                    <Heading as="h3" size="sm" className="mt-3 transition-colors group-hover:text-forest">
                      {post.title}
                    </Heading>
                    <p className="mt-2 flex-1 font-sans text-xs leading-relaxed text-foreground-secondary">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
                      {locale === "tr" ? "Oku" : "Read"}
                      <ArrowUpRight size={13} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-brand"
                >
                  {home("whyUs.guidesLinkText")}
                  <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-2">
              {expertiseNote && (
                <p className="mb-4 font-sans text-sm leading-relaxed text-foreground-secondary">{expertiseNote}</p>
              )}
              <MentorCardComingSoon label={aboutT("team.comingSoonLabel")} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ teaser — the last objections resolved right before the final ask,
          curated to avoid repeating the hero's guarantee/cost/scope strip. */}
      {featuredFaqItems.length > 0 && (
        <section className="border-t border-border bg-background-secondary py-20 sm:py-24">
          <Container>
            <Reveal>
              <SectionHeading title={home("faqTeaser.title")} subtitle={home("faqTeaser.subtitle")} />
            </Reveal>
            <div className="mx-auto mt-10 max-w-[42rem] divide-y divide-border">
              {featuredFaqItems.map((item, i) => (
                <Reveal key={item.question} delay={i * 50}>
                  <details className="group py-5 first:pt-0 last:pb-0">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                      <Heading as="h3" size="sm">
                        {item.question}
                      </Heading>
                      <span className="mt-1 shrink-0 font-sans text-lg text-accent transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-foreground-secondary">{item.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-brand"
              >
                {home("faqTeaser.linkText")}
                <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            </div>
          </Container>
        </section>
      )}

      <CtaBand
        variant="home"
        title={home("cta.title")}
        subtitle={home("cta.subtitle")}
        buttonLabel={home("cta.button")}
        steps={home.raw("cta.steps") as string[]}
      />
    </>
  );
}
