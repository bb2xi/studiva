"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Bookmark } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useFavorites } from "@/lib/discovery/store";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "./Button";
import { Label } from "./Typography";

function ShortlistLink({ label, onClick }: { label: string; onClick?: () => void }) {
  const count = useFavorites().length;
  return (
    <Link
      href="/shortlist"
      onClick={onClick}
      aria-label={count > 0 ? `${label} (${count})` : label}
      title={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-sm text-foreground-secondary transition-colors hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
    >
      <Bookmark size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  const shortlistLabel = useTranslations("discovery.nav")("shortlist");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/programs", label: t("programs") },
    { href: "/universities", label: t("universities") },
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  useEffect(() => {
    if (!open) return;
    firstMobileLinkRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-9 w-9" />
          <span className="font-display text-xl font-medium tracking-tight">Studiva</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 ${
                  active ? "text-forest" : "text-foreground-secondary hover:text-forest"
                }`}
              >
                <Label as="span" className="opacity-100">
                  {link.label}
                </Label>
                <span
                  aria-hidden
                  className={`absolute -bottom-1 left-0 h-[1.5px] w-full origin-left bg-accent transition-transform duration-200 ease-out ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ShortlistLink label={shortlistLabel} />
          <LanguageSwitcher />
          <Button href="/contact" variant="primary">
            {t("cta")}
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ShortlistLink label={shortlistLabel} />
        <button
          ref={toggleRef}
          type="button"
          className="flex items-center justify-center rounded-sm p-2.5 text-foreground-secondary transition-colors hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-surface px-4 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                ref={i === 0 ? firstMobileLinkRef : undefined}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2.5 font-sans text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <Button href="/contact" variant="primary" onClick={() => setOpen(false)}>
              {t("cta")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
