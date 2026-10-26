import Container from "@/components/Container";
import { Heading, Dek } from "@/components/Typography";

export default function DiscoveryHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl">
          <Heading as="h1" size="lg">
            {title}
          </Heading>
          {subtitle && <Dek className="mt-4 text-base">{subtitle}</Dek>}
          {children}
        </div>
      </Container>
    </section>
  );
}
