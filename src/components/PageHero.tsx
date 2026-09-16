import Container from "./Container";

export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-grain relative overflow-hidden border-b border-white/10 bg-slate-950 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #2563eb 0, transparent 45%), radial-gradient(circle at 85% 15%, #1e3a8a 0, transparent 40%)",
        }}
      />
      <Container className="relative text-center">
        <h1 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
