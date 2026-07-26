"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  tr: "TR",
  en: "EN",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors cursor-pointer ${
            locale === loc
              ? "bg-brand text-white"
              : "text-slate-500 hover:text-brand"
          }`}
          aria-current={locale === loc}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
