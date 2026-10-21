import type { ReactNode } from "react";

export type TagVariant = "institutional" | "forest" | "brass" | "clay" | "neutral";

const VARIANT_CLASS: Record<TagVariant, string> = {
  institutional: "border-brand/35 text-brand",
  forest: "border-forest/35 text-forest",
  brass: "border-accent/35 text-accent-dark",
  clay: "border-clay/35 text-clay-dark",
  neutral: "border-border-strong text-foreground-secondary",
};

export function Tag({
  variant = "neutral",
  className = "",
  children,
}: {
  variant?: TagVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
