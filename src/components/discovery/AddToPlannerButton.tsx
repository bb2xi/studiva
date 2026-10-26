"use client";

import { useTranslations } from "next-intl";
import { CalendarPlus } from "lucide-react";
import { addToPlanner } from "@/lib/discovery/planner";
import { toast } from "./Toaster";

export default function AddToPlannerButton({ slug, name, label, className = "" }: { slug: string; name: string; label?: string; className?: string }) {
  const t = useTranslations("discovery.planner");
  return (
    <button
      type="button"
      onClick={() => {
        const added = addToPlanner(slug);
        toast(added ? t("added", { name }) : t("alreadyAdded", { name }), added ? "success" : "info");
      }}
      className={`inline-flex items-center gap-1.5 rounded-sm border border-border-strong bg-surface px-3 py-2 text-xs font-semibold text-foreground-secondary transition-colors hover:border-forest hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${className}`}
    >
      <CalendarPlus size={16} />
      {label ?? t("add")}
    </button>
  );
}
