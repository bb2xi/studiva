import Container from "./Container";
import { Heading, Dek } from "./Typography";

export type PageHeroPhoto = { url: string; artist: string; license: string };

export default function PageHero({
  title,
  subtitle,
  photo,
}: {
  title: string;
  subtitle?: string;
  photo?: PageHeroPhoto;
}) {
  return (
    <section className="relative overflow-hidden border-b border-black/20 bg-[#15130f] py-24 text-white sm:py-28">
      {photo && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15130f] via-[#15130f]/70 to-[#15130f]/30" />
          <div className="absolute inset-0 bg-forest/25 mix-blend-multiply" />
        </>
      )}
      <div className="bg-grain absolute inset-0" />
      <Container className="relative text-center">
        <div className="mx-auto h-px w-16 bg-accent" />
        <Heading size="xl" className="mt-6">
          {title}
        </Heading>
        {subtitle && <Dek className="mx-auto mt-5 max-w-2xl">{subtitle}</Dek>}
      </Container>
      {photo && (
        <p className="absolute bottom-2 right-4 font-sans text-[10px] text-white/40">
          {photo.artist} · {photo.license}
        </p>
      )}
    </section>
  );
}
