import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading, Data } from "@/components/Typography";
import { Tag } from "@/components/Tag";
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
          <div className="mx-auto max-w-[42rem]">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-brand"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
              {t("hero.title")}
            </Link>

            <Reveal delay={80}>
              <Tag variant="forest" className="mt-6">
                {post.category}
              </Tag>
              <Heading as="h1" size="xl" className="mt-3">
                {post.title}
              </Heading>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  <Data kind="number">{post.date}</Data>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {post.readTime}
                </span>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 space-y-5 border-t border-border pt-8">
                {post.body.map((paragraph, i) => (
                  <p key={i} className="font-sans text-base leading-relaxed text-foreground-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
                <Link
                  href="/faq"
                  className="group inline-flex items-center gap-1.5 rounded-sm border border-border-strong px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:border-forest hover:text-forest"
                >
                  {locale === "tr" ? "Sık Sorulan Sorular" : "FAQ"}
                  <ArrowUpRight size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-1.5 rounded-sm border border-border-strong px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:border-forest hover:text-forest"
                >
                  {locale === "tr" ? "Hizmetlerimiz" : "Our Services"}
                  <ArrowUpRight size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand variant="blog" title={t("cta.title")} subtitle={t("cta.subtitle")} buttonLabel={t("cta.button")} />
    </>
  );
}
