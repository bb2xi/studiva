import type { Metadata } from "next";
import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Toaster from "@/components/discovery/Toaster";
import CompareTray from "@/components/discovery/CompareTray";
import { getUniversitySummaries } from "@/lib/universities";
import "../globals.css";

// Display face — headings and the editorial "dek" lead-paragraph/pull-quote
// italic. Adobe-designed for exactly this span (display down to text sizes)
// via its opsz axis, so headings and their own italic share one set of
// proportions instead of pairing two unrelated serif families.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Body copy and UI chrome (nav, buttons, labels, tags, stat figures) — Adobe's
// matched sibling to Source Serif 4, sharing its proportions and numeral
// design, so prose and interface controls read as one coherent system.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
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
  const universityNames = Object.fromEntries((await getUniversitySummaries(locale)).map((u) => [u.slug, u.name]));
  // Client components only read these namespaces; everything else (page
  // metadata, detail and state pages, long profiles) is translated on the
  // server and stays out of the messages serialized into every page.
  const messages = await getMessages();
  const serverOnly = new Set(["meta", "detail", "states", "subjectsPage"]);
  const clientMessages = {
    nav: messages.nav,
    contact: { form: messages.contact.form },
    discovery: Object.fromEntries(Object.entries(messages.discovery).filter(([key]) => !serverOnly.has(key))),
  };

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
      className={`${sourceSerif.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={clientMessages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <aside aria-label={common("quickContact")}>
            <WhatsAppButton message={common("whatsappMessage")} label={common("whatsappAriaLabel")} />
          </aside>
          <CompareTray names={universityNames} />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
