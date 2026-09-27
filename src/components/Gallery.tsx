"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt, tag }: { images: string[]; alt: string; tag: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt} — view ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 rounded bg-white/95 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-zinc-700 shadow-sm">
          {tag}
        </span>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show view ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-zinc-100 transition ${
                i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="12vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
