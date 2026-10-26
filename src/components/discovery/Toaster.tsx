"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";

type Toast = { id: number; message: string; tone: "success" | "info" };

let nextId = 1;
const listeners = new Set<(toast: Toast) => void>();

/** Show a short, polite status message (favorites, compare list, planner). */
export function toast(message: string, tone: Toast["tone"] = "success") {
  const t = { id: nextId++, message, tone };
  listeners.forEach((listener) => listener(t));
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (t: Toast) => {
      setToasts((current) => [...current.slice(-2), t]);
      window.setTimeout(() => setToasts((current) => current.filter((x) => x.id !== t.id)), 3500);
    };
    listeners.add(onToast);
    return () => {
      listeners.delete(onToast);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-40 z-[70] flex flex-col items-center gap-2 sm:bottom-28"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex max-w-sm items-center gap-2 rounded-sm bg-foreground px-4 py-2.5 font-sans text-sm text-background shadow-elevated motion-safe:animate-[toast-in_180ms_ease-out]"
        >
          {t.tone === "success" ? <CheckCircle2 size={16} className="shrink-0" /> : <Info size={16} className="shrink-0" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
