"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Flag } from "lucide-react";

const FIELDS = ["tuition", "link", "programs", "other"] as const;
type Status = "idle" | "sending" | "sent" | "error";

export default function ReportForm({ slug }: { slug: string }) {
  const t = useTranslations("discovery.report");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/data-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, field: data.get("field"), message: data.get("message"), email: data.get("email"), page: window.location.pathname }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <details className="group rounded-sm border border-border bg-surface">
      <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold text-foreground-secondary marker:content-none hover:text-forest">
        <Flag size={15} />
        {t("title")} <span className="text-forest underline underline-offset-2">{t("open")}</span>
      </summary>
      {status === "sent" ? (
        <p role="status" className="px-4 pb-4 text-sm text-forest">
          {t("thanks")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 px-4 pb-4">
          <label className="block text-sm text-foreground-secondary">
            {t("field")}
            <select name="field" required className="mt-1 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground">
              {FIELDS.map((f) => (
                <option key={f} value={f}>
                  {t(`fieldOptions.${f}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-foreground-secondary">
            {t("message")}
            <textarea name="message" maxLength={1000} rows={3} className="mt-1 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="block text-sm text-foreground-secondary">
            {t("email")}
            <input name="email" type="email" maxLength={200} className="mt-1 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground" />
          </label>
          {status === "error" && (
            <p role="alert" className="text-sm text-clay-dark">
              {t("error")}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>
        </form>
      )}
    </details>
  );
}
