"use client";

/**
 * A full-bleed hero photo. It lives in a client component on purpose: React
 * turns every eager <img> in a Server Component into a preload hint in the
 * RSC payload, and Next applies those hints when it prefetches a route — so
 * a header link to a page with a hero made every other page download that
 * page's photo. Rendered from here, the image is still in its own page's HTML
 * and loads eagerly there, while prefetches stay light.
 */
export default function HeroImage({ src, className }: { src: string; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="eager" className={className} />;
}
