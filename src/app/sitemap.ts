import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import trMessages from "@/messages/tr.json";

const BASE_URL = "https://studivadanismanlik.com";

const STATIC_PATHS = ["", "/services", "/programs", "/universities", "/blog", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const universitySlugs = trMessages.universities.items.map((u) => u.slug);
  const blogSlugs = trMessages.blog.posts.map((p) => p.slug);

  const paths = [
    ...STATIC_PATHS,
    ...universitySlugs.map((slug) => `/universities/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );
}
