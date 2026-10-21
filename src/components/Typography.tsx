import type { ElementType, ReactNode } from "react";

type HeadingSize = "xl" | "lg" | "sm";

const HEADING_SIZE_CLASS: Record<HeadingSize, string> = {
  xl: "text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight",
  lg: "text-[clamp(1.875rem,3.5vw,2.75rem)] leading-[1.1] tracking-tight",
  sm: "text-xl leading-snug",
};

const HEADING_DEFAULT_TAG: Record<HeadingSize, ElementType> = {
  xl: "h1",
  lg: "h2",
  sm: "h3",
};

export function Heading({
  as,
  size = "lg",
  italic = false,
  className = "",
  children,
}: {
  as?: ElementType;
  size?: HeadingSize;
  italic?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as ?? HEADING_DEFAULT_TAG[size];
  return (
    <Tag
      className={`font-display font-medium ${italic ? "italic" : ""} ${HEADING_SIZE_CLASS[size]} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Dek({
  as: Tag = "p",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`font-serif italic text-lg leading-relaxed opacity-80 ${className}`}>{children}</Tag>
  );
}

export function Body({
  as: Tag = "p",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`font-serif text-base leading-relaxed opacity-90 sm:text-lg ${className}`}>{children}</Tag>
  );
}

export function Label({
  as: Tag = "span",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`font-sans text-xs font-semibold uppercase tracking-wide opacity-70 ${className}`}>
      {children}
    </Tag>
  );
}

export function Data({
  as: Tag = "span",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`font-data tabular-nums ${className}`}>{children}</Tag>;
}
