import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type ButtonVariant = "primary" | "secondary" | "ghost";

const BASE =
  "inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

function variantClass(variant: ButtonVariant, invert: boolean) {
  if (variant === "ghost") {
    return invert
      ? "text-white/90 decoration-white/40 underline underline-offset-4 hover:decoration-white focus-visible:ring-white/60"
      : "text-forest decoration-forest/30 underline underline-offset-4 hover:decoration-forest focus-visible:ring-forest/50";
  }
  if (variant === "secondary") {
    return invert
      ? "rounded-sm border border-white/40 px-6 py-3 text-white hover:bg-white/10 active:scale-[0.97] focus-visible:ring-white/60"
      : "rounded-sm border border-forest px-6 py-3 text-forest hover:bg-forest-fill hover:text-white active:scale-[0.97] focus-visible:ring-forest/50";
  }
  return invert
    ? "rounded-sm bg-white px-6 py-3 text-brand shadow-soft hover:shadow-elevated active:scale-[0.97] focus-visible:ring-white/60"
    : "rounded-sm bg-brand-fill px-6 py-3 text-white shadow-soft hover:bg-brand-fill-hover hover:shadow-glow active:scale-[0.97] focus-visible:ring-brand/50";
}

type SharedProps = {
  variant?: ButtonVariant;
  invert?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  invert = false,
  className = "",
  children,
  ...rest
}: SharedProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={`${BASE} ${variantClass(variant, invert)} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

export function ButtonExternal({
  href,
  variant = "primary",
  invert = false,
  className = "",
  children,
  ...rest
}: SharedProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={`${BASE} ${variantClass(variant, invert)} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}

export function ButtonAction({
  variant = "primary",
  invert = false,
  className = "",
  children,
  ...rest
}: SharedProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button className={`${BASE} ${variantClass(variant, invert)} ${className}`} {...rest}>
      {children}
    </button>
  );
}
