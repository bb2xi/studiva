import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, ShieldCheck, Sparkles, HeartHandshake, Target, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { serviceIcons } from "@/lib/icons";

type ServiceItem = { icon: string; title: string; description: string };
type ProcessStep = { title: string; description: string };
type WhyUsItem = { title: string; description: string };
type ProgramItem = { name: string; flag: string };
type UniversityItem = { name: string; city: string; type: string };
type Stat = { value: string; label: string };

const whyUsIcons = [Target, ShieldCheck, Sparkles, HeartHandshake];
const UNIVERSITY_PREVIEW_COUNT = 6;

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
  const universityItems = (
    universitiesT.raw("items") as UniversityItem[]
  ).slice(0, UNIVERSITY_PREVIEW_COUNT);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #1d4ed8 0, transparent 45%), radial-gradient(circle at 80% 0%, #1e3a8a 0, transparent 40%)",
          }}
        />
        <Container className="relative py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-200">
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
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                {home("hero.ctaPrimary")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {home("hero.ctaSecondary")}
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-blue-200">
              <ShieldCheck size={16} className="shrink-0" />
              {home("hero.guaranteeNote")}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services preview */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Studiva"
            title={home("services.title")}
            subtitle={home("services.subtitle")}
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Check;
              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              {home("services.linkText")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Programs strip */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <Container>
          <SectionHeading
            title={home("programs.title")}
            subtitle={home("programs.subtitle")}
          />
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {programItems.map((program) => (
              <div
                key={program.name}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm"
              >
                <span className="text-2xl">{program.flag}</span>
                <span className="text-sm font-medium text-slate-700">
                  {program.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              {home("programs.linkText")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Universities preview */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={home("universities.title")}
            subtitle={home("universities.subtitle")}
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universityItems.map((uni) => (
              <div
                key={uni.name}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                  {uni.type}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {uni.name}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={13} />
                  {uni.city}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              {home("universities.linkText")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={home("process.title")}
            subtitle={home("process.subtitle")}
          />
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHeading title={home("whyUs.title")} />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUsItems.map((item, index) => {
              const Icon = whyUsIcons[index % whyUsIcons.length];
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
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
          <p className="max-w-xl text-blue-100">{home("cta.subtitle")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-transform hover:scale-105"
          >
            {home("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
