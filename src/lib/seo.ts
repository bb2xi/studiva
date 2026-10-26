import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://studivadanismanlik.com";

/** `path` is locale-less, e.g. "" for home or "/universities/tum". */
export function localizedUrl(locale: string, path: string) {
  return `/${locale}${path}`;
}

export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
}: {
  locale: string;
  path: string;
  title: string;
  description?: string;
  noindex?: boolean;
}): Metadata {
  const url = localizedUrl(locale, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { title, description, url, locale: locale === "tr" ? "tr_TR" : "en_GB", siteName: "Studiva", type: "website" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
