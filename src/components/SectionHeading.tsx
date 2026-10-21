import { Heading, Dek, Label } from "./Typography";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Label className="text-brand opacity-100">{eyebrow}</Label>}
      <Heading size="lg" className="mt-2">
        {title}
      </Heading>
      {subtitle && <Dek className="mt-4">{subtitle}</Dek>}
    </div>
  );
}
