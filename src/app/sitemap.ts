import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import trMessages from "@/messages/tr.json";
import universities from "@/data/universities.json";
import factsData from "@/data/university-facts.json";
import { STATES } from "@/data/states";
import { SITE_URL } from "@/lib/seo";

// Utility pages tied to a visitor's own browser state (shortlist, compare, planner) are noindex and left out.
const STATIC_PATHS = [
  "",
  "/services",
  "/programs",
  "/universities",
  "/universities/finder",
  "/germany",
  "/cost-calculator",
  "/scholarships",
  "/blog",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const factsDate = (factsData as { generatedAt: string | null }).generatedAt;
  const paths: { path: string; lastModified?: string }[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...universities.map((u) => ({ path: `/universities/${u.slug}`, lastModified: factsDate ?? undefined })),
    ...STATES.map((s) => ({ path: `/germany/${s.slug}` })),
    ...trMessages.blog.posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.date })),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map(({ path, lastModified }) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
          "x-default": `${SITE_URL}/${routing.defaultLocale}${path}`,
        },
      },
    }))
  );
}
