import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Heading, Data } from "@/components/Typography";
import { Tag } from "@/components/Tag";
import { heroPhotos } from "@/lib/heroPhotos";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
};

const FAQ_RELEVANT_SLUGS = ["aps-belgesi-nedir", "almanyada-yasam-maliyeti-ve-bloke-hesap", "almanya-ogrenci-vizesi-basvuru-sureci"];

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
  const featured = t.raw("featured") as { title: string; subtitle: string };
  const featuredPosts = FAQ_RELEVANT_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter(
    (p): p is BlogPost => Boolean(p)
  );

  return (
    <>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} photo={heroPhotos.blog} />

      {featuredPosts.length > 0 && (
        <section className="border-b border-border bg-background-secondary py-14">
          <Container>
            <SectionHeading title={featured.title} subtitle={featured.subtitle} center={false} />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-sm border border-border-strong bg-surface p-5"
                >
                  <Heading as="h3" size="sm" className="transition-colors group-hover:text-forest">
                    {post.title}
                  </Heading>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
                    {locale === "tr" ? "Oku" : "Read"}
                    <ArrowUpRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={(index % 6) * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-sm border border-border bg-surface p-6"
                >
                  <Tag variant="forest">{post.category}</Tag>
                  <Heading as="h3" size="sm" className="mt-4 transition-colors group-hover:text-forest">
                    {post.title}
                  </Heading>
                  <p className="mt-2 flex-1 font-serif text-sm leading-relaxed text-foreground-secondary">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-4 font-sans text-xs text-foreground-muted">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      <Data>{post.date}</Data>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
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

      <CtaBand variant="blog" title={t("cta.title")} subtitle={t("cta.subtitle")} buttonLabel={t("cta.button")} />
    </>
  );
}
