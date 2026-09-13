import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import trMessages from "@/messages/tr.json";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
};

export function generateStaticParams() {
  const slugs = (trMessages.blog.posts as BlogPost[]).map((p) => p.slug);
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function getPost(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = t.raw("posts") as BlogPost[];
  return posts.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) return {};
  return { title: `${post.title} | Studiva Blog`, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <>
      <section className="py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
              {t("hero.title")}
            </Link>

            <Reveal delay={80}>
              <span className="mt-6 inline-flex w-fit items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                {post.category}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {post.readTime}
                </span>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 space-y-5 border-t border-border pt-8">
                {post.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-foreground-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-brand">
        <Container className="flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("cta.title")}</h2>
          <p className="max-w-xl text-green-100">{t("cta.subtitle")}</p>
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
