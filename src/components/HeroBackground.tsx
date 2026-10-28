import HeroImage from "./HeroImage";

export type HeroPhoto = { url: string; artist: string; license: string };

/**
 * Photo-led hero background: a real, licensed campus photograph behind an
 * ink/forest scrim, with a slow transform-only Ken Burns pan (defined in
 * globals.css) instead of the old animated gradient blobs — grounds the
 * first viewport in Studiva's actual differentiated asset (real German
 * universities) rather than abstract decoration. `prefers-reduced-motion`
 * is handled by both the `motion-reduce:` variant and the global CSS rule.
 */
export default function HeroBackground({ photo }: { photo?: HeroPhoto }) {
  if (!photo) {
    return <div aria-hidden className="bg-grain pointer-events-none absolute inset-0" />;
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <HeroImage
        src={photo.url}
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 [animation:ken-burns_18s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#15130f] via-[#15130f]/75 to-[#15130f]/35" />
      <div className="absolute inset-0 bg-forest/20 mix-blend-multiply" />
      <div className="bg-grain absolute inset-0" />
      <p className="absolute bottom-2 right-4 font-sans text-[10px] text-white/40">
        {photo.artist} · {photo.license}
      </p>
    </div>
  );
}
