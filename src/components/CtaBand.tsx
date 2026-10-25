import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import Container from "./Container";
import { Heading, Dek, Data } from "./Typography";

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
  steps,
}: {
  variant: CtaBandVariant;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref?: string;
  /** Optional "what happens after you click" sequence, rendered between the
   * subtitle and the button — e.g. ["Free 15-minute call", "Written price &
   * plan", "Guidance begins"]. Turns an unknown commitment into a known,
   * low-stakes first step. Omitted entirely for variants that don't pass it. */
  steps?: string[];
}) {
  const isDark = DARK_VARIANTS.includes(variant) || FOREST_VARIANTS.includes(variant);
  return (
    <section className={`${WRAP_CLASS[variant]} ${isDark ? "text-white" : "text-foreground"}`}>
      <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-24">
        <Heading size="lg">{title}</Heading>
        <Dek className="max-w-xl">{subtitle}</Dek>
        {steps && steps.length > 0 && (
          <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-sm ${isDark ? "text-white/80" : "text-foreground-secondary"}`}>
            {steps.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className={isDark ? "text-white/40" : "text-foreground-muted"}>→</span>}
                <span className="flex items-center gap-2">
                  <Data kind="number" as="span" className={`font-semibold ${isDark ? "text-white" : "text-foreground"}`}>
                    {i + 1}
                  </Data>
                  {step}
                </span>
              </span>
            ))}
          </div>
        )}
        <Button href={buttonHref} invert={isDark}>
          {buttonLabel}
          <ArrowRight size={16} />
        </Button>
      </Container>
    </section>
  );
}
