import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const services = useTranslations("home.services");

  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: nav("home") },
    { href: "/services", label: nav("services") },
    { href: "/programs", label: nav("programs") },
    { href: "/universities", label: nav("universities") },
    { href: "/blog", label: nav("blog") },
    { href: "/about", label: nav("about") },
    { href: "/contact", label: nav("contact") },
  ];

  const serviceItems = services.raw("items") as { title: string }[];

  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-9 w-9" />
            <span className="text-lg tracking-tight">Studiva</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t("description")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("servicesTitle")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {serviceItems.slice(0, 5).map((item) => (
              <li key={item.title} className="text-slate-400">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
