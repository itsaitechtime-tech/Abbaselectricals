import Image from "next/image";
import type { Project } from "@/lib/site";

const toneClass: Record<Project["tone"], string> = {
  cool: "atmosphere-cool",
  warm: "atmosphere-warm",
  amber: "atmosphere-amber",
  blue: "atmosphere-blue",
  green: "atmosphere-green",
  soft: "atmosphere-soft",
};

export function ProjectCard({
  title,
  location,
  description,
  tone,
  image,
  gallery,
  alt,
}: Project) {
  const coverAlt = alt ?? `${title} — completed Barq Lumi lighting install`;

  return (
    <article
      className={`panel flex flex-col overflow-hidden rounded-2xl ${
        image ? "" : `atmosphere ${toneClass[tone]}`
      }`}
    >
      <div className="relative h-52 md:h-64">
        {image ? (
          <>
            <Image
              src={image}
              alt={coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.9)] via-[rgba(10,10,10,0.22)] to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-40 grid-fade" />
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="eyebrow text-paper/80">{location}</p>
          <h3 className="display mt-1 text-2xl text-cream">{title}</h3>
        </div>
      </div>
      {gallery && gallery.length > 0 && (
        <div
          className={`grid gap-px bg-line ${
            gallery.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {gallery.map((src, i) => (
            <div key={src} className="relative h-28 md:h-36">
              <Image
                src={src}
                alt={`${title} — additional install view ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-line px-5 py-5">
        <p className="text-sm leading-relaxed text-paper-muted">{description}</p>
      </div>
    </article>
  );
}
