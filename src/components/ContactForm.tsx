"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

const fieldClass =
  "mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 ease-out focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
        <CheckCircle2 size={40} className="text-brand" />
        <p className="mt-4 text-base font-medium text-foreground">
          {t("submit")} ✓
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-8 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground">{t("title")}</h3>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-foreground-secondary">
            {t("name")}
          </label>
          <input required type="text" className={fieldClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground-secondary">
            {t("email")}
          </label>
          <input required type="email" className={fieldClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground-secondary">
            {t("phone")}
          </label>
          <input type="tel" className={fieldClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground-secondary">
            {t("country")}
          </label>
          <select defaultValue="" className={fieldClass}>
            <option value="" disabled>
              {t("countryPlaceholder")}
            </option>
            {(t.raw("countryOptions") as string[]).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm font-medium text-foreground-secondary">
          {t("message")}
        </label>
        <textarea
          rows={4}
          placeholder={t("messagePlaceholder")}
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 sm:w-auto"
      >
        {t("submit")}
      </button>

      <p className="mt-4 text-xs text-foreground-muted">{t("disclaimer")}</p>
    </form>
  );
}
