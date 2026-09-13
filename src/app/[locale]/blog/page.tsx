import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: `${t("hero.title")} | Studiva` };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = t.raw("posts") as BlogPost[];

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={(index % 6) * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                    {post.category}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground transition-colors group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    {locale === "tr" ? "Devamını Oku" : "Read More"}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand">
        <Container className="flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("cta.title")}</h2>
          <p className="max-w-xl text-blue-100">{t("cta.subtitle")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-all duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            {t("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </>
  );
}
