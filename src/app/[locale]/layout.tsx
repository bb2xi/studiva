import type { Metadata } from "next";
import { Geist, Fraunces, Newsreader, Space_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://studivadanismanlik.com"),
    title: `${t("siteName")} | ${t("tagline")}`,
    description: t("tagline"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const footer = await getTranslations({ locale, namespace: "footer" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  const common = await getTranslations({ locale, namespace: "common" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: meta("siteName"),
    description: footer("description"),
    url: "https://studivadanismanlik.com",
    logo: "https://studivadanismanlik.com/logo-full.png",
    email: footer("email"),
    telephone: footer("phone"),
    address: {
      "@type": "PostalAddress",
      streetAddress: footer("address"),
      addressCountry: "TR",
    },
  };

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${fraunces.variable} ${newsreader.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton message={common("whatsappMessage")} label={common("whatsappAriaLabel")} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
