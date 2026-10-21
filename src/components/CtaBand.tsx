import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import Container from "./Container";
import { Heading, Dek } from "./Typography";

export type CtaBandVariant = "home" | "services" | "programs" | "universitiesList" | "universityDetail" | "blog";

const DARK_VARIANTS: CtaBandVariant[] = ["home", "universitiesList", "universityDetail"];
const FOREST_VARIANTS: CtaBandVariant[] = ["services", "programs"];

const WRAP_CLASS: Record<CtaBandVariant, string> = {
  home: "bg-grain bg-gradient-to-br from-brand to-brand-dark",
  universitiesList: "bg-grain bg-gradient-to-br from-brand to-brand-dark",
  universityDetail: "bg-grain bg-gradient-to-br from-brand to-brand-dark",
  services: "bg-grain bg-forest",
  programs: "bg-grain bg-forest",
  blog: "border-t-2 border-accent bg-background-secondary",
};

export default function CtaBand({
  variant,
  title,
  subtitle,
  buttonLabel,
  buttonHref = "/contact",
}: {
  variant: CtaBandVariant;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref?: string;
}) {
  const isDark = DARK_VARIANTS.includes(variant) || FOREST_VARIANTS.includes(variant);
  return (
    <section className={`${WRAP_CLASS[variant]} ${isDark ? "text-white" : "text-foreground"}`}>
      <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-24">
        <Heading size="lg">{title}</Heading>
        <Dek className="max-w-xl">{subtitle}</Dek>
        <Button href={buttonHref} invert={isDark}>
          {buttonLabel}
          <ArrowRight size={16} />
        </Button>
      </Container>
    </section>
  );
}
