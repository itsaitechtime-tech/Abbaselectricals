import Image from "next/image";
import Link from "next/link";
import { CategoryIcon, WhatsAppIcon } from "@/components/Icons";
import { Container } from "@/components/Section";
import type { SubCategory } from "@/lib/catalog";
import { site } from "@/lib/site";

export function SubTile({
  groupSlug,
  sub,
}: {
  groupSlug: string;
  sub: SubCategory;
}) {
  return (
    <Link
      href={`/products/${groupSlug}/${sub.slug}/`}
      className="group relative isolate block aspect-[4/3] overflow-hidden rounded-lg bg-ink-2"
    >
      {sub.image ? (
        <Image
          src={sub.image}
          alt={`${sub.name}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="-z-10 object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center text-white/15">
          <CategoryIcon icon={sub.icon} className="h-24 w-24" />
        </div>
      )}
      <div className="tile-shade absolute inset-0 -z-10" />
      <span className="absolute right-3 top-3 rounded bg-black/55 px-2 py-1 text-[0.62rem] font-semibold tabular-nums text-white">
        {sub.productIds.length}
      </span>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-3.5 md:p-4">
        <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-white sm:inline-flex">
          <CategoryIcon icon={sub.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white md:text-base">{sub.name}</h3>
          <p className="hidden truncate text-[0.7rem] text-white/60 md:block">{sub.blurb}</p>
        </div>
      </div>
    </Link>
  );
}

export function HelpBand() {
  return (
    <section className="bg-white py-14 md:py-20">
      <Container>
        <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-zinc-50 p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="eyebrow mb-3">Need a Hand?</p>
            <h2 className="h-display text-2xl text-ink md:text-3xl">Not sure which fitting fits the brief?</h2>
            <p className="mt-2 max-w-xl text-zinc-500">
              Share a drawing or a photo of the space. We&apos;ll recommend the right products — no
              public pricing, quotes by project.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              <WhatsAppIcon /> Ask on WhatsApp
            </a>
            <a href={site.tel.href} className="btn btn-outline-dark">
              Call {site.tel.display}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
