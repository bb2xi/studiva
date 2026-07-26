import Container from "./Container";

export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-slate-100 bg-slate-950 py-20">
      <Container className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
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
