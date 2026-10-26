import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const services = useTranslations("home.services");
  const tools = useTranslations("discovery.nav");

  const year = new Date().getFullYear();

  const serviceItems = services.raw("items") as { title: string }[];

  const legalLinks = [
    { href: "/faq", label: t("faq") },
    { href: "/privacy", label: t("privacy") },
    { href: "/contact", label: t("contactLink") },
  ];

  const toolLinks = [
    { href: "/universities", label: tools("directory") },
    { href: "/universities/finder", label: tools("finder") },
    { href: "/universities/programmes", label: tools("programmes") },
    { href: "/universities/subjects", label: tools("subjects") },
    { href: "/germany", label: tools("states") },
    { href: "/cost-calculator", label: tools("costs") },
    { href: "/scholarships", label: tools("scholarships") },
  ];

  return (
    // Always-dark footer regardless of site theme (matching the editorial
    // "ink paper" family from dark mode), so it reads as a fixed colophon
    // band rather than flipping light when the page itself is in dark mode.
    <footer className="border-t border-black/20 bg-[#1a160f] text-[#f3ede1]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-9 w-9" />
            <span className="font-display text-xl font-medium tracking-tight">Studiva</span>
          </div>
          <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed opacity-70">{t("description")}</p>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wide opacity-60">
            {t("servicesTitle")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {serviceItems.slice(0, 5).map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wide opacity-60">{tools("label")}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {toolLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="opacity-80 transition-colors duration-200 hover:text-accent hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wide opacity-60">
            {t("companyTitle")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="opacity-80 transition-colors duration-200 hover:text-accent hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm opacity-70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {year} Studiva. {t("rights")}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <MapPin size={14} /> {t("address")}
            </span>
            <span className="flex items-center gap-2">
              <Phone size={14} /> {t("phone")}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={14} /> {t("email")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
