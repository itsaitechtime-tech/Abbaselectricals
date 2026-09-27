import { projects, site } from "@/lib/site";

export const mapHref =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Muweilah, Sharjah, United Arab Emirates");

/** Captions for secondary gallery photos — drawn from each project's own description. */
const galleryTitles: Record<string, string> = {
  "/projects/web/rgb-room-zigzag.webp": "RGB zigzag shelving",
  "/projects/web/rgb-room-desk.webp": "RGB lit desk run",
  "/projects/web/kitchen-linear.webp": "Kitchen linear & chandelier",
};

/** Every real install photo, flattened (cover + gallery), in display order. */
export const projectPhotos = projects.flatMap((p) =>
  p.image
    ? [
        { src: p.image, title: p.title, alt: p.alt ?? `${p.title} — completed ${site.name} install` },
        ...(p.gallery ?? []).map((g, i) => ({
          src: g,
          title: galleryTitles[g] ?? p.title,
          alt: `${p.title} — additional view ${i + 1}`,
        })),
      ]
    : []
);
