"use client";

import { useState } from "react";
import type { UniversityImage } from "@/lib/universityMedia";

export default function UniversityGallery({
  images,
  name,
}: {
  images: UniversityImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-background-secondary shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.url}
          src={current.url}
          alt={`${name} kampüs fotoğrafı`}
          className="h-full w-full object-cover transition-opacity duration-300"
          loading="eager"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, index) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Fotoğraf ${index + 1}`}
              className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-2 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-brand ${
                index === active
                  ? "ring-brand"
                  : "opacity-70 ring-transparent hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-foreground-muted">
        Fotoğraf: {current.artist} · Wikimedia Commons ({current.license})
      </p>
    </div>
  );
}
