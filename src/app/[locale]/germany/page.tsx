import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import DiscoveryNav from "@/components/discovery/DiscoveryNav";
import DiscoveryHeader from "@/components/discovery/DiscoveryHeader";
import { Tag } from "@/components/Tag";
import { STATES, cityName } from "@/data/states";
import { STATE_CONTENT } from "@/data/stateContent";
import { getUniversitySummaries } from "@/lib/universities";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discovery.meta.states" });
  return pageMetadata({ locale, path: "/germany", title: `${t("title")} | Studiva`, description: t("description") });
}

export default async function GermanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "discovery.states" });
  const lang = locale === "tr" ? "tr" : "en";
  const items = await getUniversitySummaries(locale);

  return (
    <>
      <DiscoveryNav />
      <DiscoveryHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-12 sm:py-16">
        <Container>
          <h2 className="sr-only">{t("listLabel")}</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STATES.map((s) => {
              const unis = items.filter((u) => u.state === s.code);
              const cities = [...new Set(unis.flatMap((u) => u.cities))];
              const policy = STATE_CONTENT[s.code].policy.status;
              return (
                <li key={s.code}>
                  <Link
                    href={`/germany/${s.slug}`}
                    className="group flex h-full flex-col rounded-sm border border-border bg-surface p-5 transition-colors hover:border-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-medium text-foreground group-hover:text-forest">{s.name[lang]}</h3>
                        {s.name[lang] !== s.name.de && <p className="text-xs text-foreground-muted">{s.name.de}</p>}
                      </div>
                      <ArrowUpRight size={16} className="mt-1 shrink-0 text-foreground-muted group-hover:text-forest" />
                    </div>
                    <p className="mt-2 text-xs text-foreground-muted">{t("capital", { capital: cityName(s.capital, locale) })}</p>
                    <div className="mt-3">
                      <Tag variant={policy === "none" ? "forest" : policy === "statewide" ? "clay" : "brass"}>{t(`policyStatus.${policy}`)}</Tag>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{t("universities", { count: unis.length })}</p>
                    {cities.length > 0 && <p className="mt-1 line-clamp-2 text-xs text-foreground-secondary">{cities.map((c) => cityName(c, locale)).join(" · ")}</p>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
