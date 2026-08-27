"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <CheckCircle2 size={40} className="text-brand" />
        <p className="mt-4 text-base font-medium text-slate-900">
          {t("submit")} ✓
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-900">{t("title")}</h3>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            {t("name")}
          </label>
          <input
            required
            type="text"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            {t("email")}
          </label>
          <input
            required
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            {t("phone")}
          </label>
          <input
            type="tel"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            {t("country")}
          </label>
          <select
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
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
        <label className="text-sm font-medium text-slate-700">
          {t("message")}
        </label>
        <textarea
          rows={4}
          placeholder={t("messagePlaceholder")}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto"
      >
        {t("submit")}
      </button>

      <p className="mt-4 text-xs text-slate-400">{t("disclaimer")}</p>
    </form>
  );
}
