import Container from "@/components/Container";
import { Heading, Dek } from "@/components/Typography";

export default function DiscoveryHeader({
  title,
  subtitle,
  children,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** Tighter spacing for tool pages where the content should start near the top. */
  compact?: boolean;
}) {
  return (
    <section className={`border-b border-border bg-background ${compact ? "py-7 sm:py-9" : "py-12 sm:py-16"}`}>
      <Container>
        <div className="max-w-3xl">
          <Heading as="h1" size="lg">
            {title}
          </Heading>
          {subtitle && <Dek className={`${compact ? "mt-2" : "mt-4"} text-base`}>{subtitle}</Dek>}
          {children}
        </div>
      </Container>
    </section>
  );
}
