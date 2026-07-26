"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, GraduationCap } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/programs", label: t("programs") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <GraduationCap size={20} />
          </span>
          <span className="text-lg tracking-tight">Studiva</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-brand" : "text-slate-600 hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("cta")}
          </Link>
        </div>

        <button
          className="flex items-center justify-center rounded-md p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
