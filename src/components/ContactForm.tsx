"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Heading } from "./Typography";
import { ButtonAction } from "./Button";

const fieldClass =
  "mt-2 w-full rounded-sm border border-border-strong bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 ease-out focus:border-brand focus:ring-2 focus:ring-brand/20";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [consentTouched, setConsentTouched] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConsentTouched(true);
    if (!consent) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          country: data.get("country"),
          message: data.get("message"),
          consent,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center rounded-sm border border-border bg-surface p-10 text-center"
      >
        <CheckCircle2 size={40} className="text-forest" />
        <p className="mt-4 font-sans text-base text-foreground">{t("submit")} ✓</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-surface p-8" noValidate>
      <Heading as="h3" size="sm">
        {t("title")}
      </Heading>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="text-sm font-medium text-foreground-secondary">
            {t("name")}
          </label>
          <input id={`${formId}-name`} name="name" required type="text" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-medium text-foreground-secondary">
            {t("email")}
          </label>
          <input id={`${formId}-email`} name="email" required type="email" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-foreground-secondary">
            {t("phone")}
          </label>
          <input id={`${formId}-phone`} name="phone" type="tel" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${formId}-country`} className="text-sm font-medium text-foreground-secondary">
            {t("country")}
          </label>
          <select id={`${formId}-country`} name="country" defaultValue="" className={fieldClass}>
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
        <label htmlFor={`${formId}-message`} className="text-sm font-medium text-foreground-secondary">
          {t("message")}
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          placeholder={t("messagePlaceholder")}
          className={fieldClass}
        />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id={`${formId}-consent`}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-border-strong text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        />
        <label htmlFor={`${formId}-consent`} className="text-sm leading-relaxed text-foreground-secondary">
          {t("consentPrefix")}
          <Link href="/privacy" className="text-brand underline underline-offset-2 hover:text-brand-dark">
            {t("consentLinkText")}
          </Link>
          {t("consentSuffix")}
        </label>
      </div>
      {consentTouched && !consent && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-clay">
          <AlertCircle size={13} />
          {t("consentRequired")}
        </p>
      )}

      <ButtonAction type="submit" className="mt-6 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "…" : t("submit")}
      </ButtonAction>

      {status === "error" && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-xs text-clay">
          <AlertCircle size={13} />
          {t("errorNote")}
        </p>
      )}

      <p className="mt-4 text-xs text-foreground-muted">{t("disclaimer")}</p>
    </form>
  );
}
