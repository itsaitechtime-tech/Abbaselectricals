import Image from "next/image";
import Link from "next/link";
import { BrandBadge } from "@/components/BrandBadge";
import { CategoryIcon, WhatsAppIcon } from "@/components/Icons";
import { quoteHref, quoteName, type CatalogItem } from "@/lib/catalog";
import { brandOf } from "@/lib/products";

export function photoAlt(item: CatalogItem) {
  const b = brandOf(item);
  return b === "Barq Lumi"
    ? `${item.sub.name} — representative photo for ${item.name}`
    : `${b} ${item.name} — product photo`;
}

export function ProductMedia({
  item,
  sizes,
  iconClass = "h-14 w-14",
  priority = false,
}: {
  item: CatalogItem;
  sizes: string;
  iconClass?: string;
  priority?: boolean;
}) {
  if (item.photo) {
    return (
      <Image
        src={item.photo}
        alt={photoAlt(item)}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition duration-500 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-400">
      <CategoryIcon icon={item.sub.icon} className={iconClass} />
    </div>
  );
}

/** Second line under the card title: model code / variant count for brand items, group otherwise. */
function cardMeta(item: CatalogItem) {
  if (brandOf(item) === "Barq Lumi") return item.group.name;
  if (item.model) return item.model;
  if (item.variants?.length) return `${item.variants.length} models`;
  return item.group.name;
}

export function ProductCard({ item }: { item: CatalogItem }) {
  const isBrand = brandOf(item) !== "Barq Lumi";
  const cutout = isBrand || !!item.photoNote;
  return (
    <article
      data-brand={brandOf(item)}
      className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
    >
      <Link
        href={item.href}
        className={`relative block aspect-square overflow-hidden ${cutout ? "bg-white" : "bg-zinc-100"}`}
      >
        <ProductMedia item={item} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        <span className={`absolute left-2.5 top-2.5 max-w-[calc(100%-5.5rem)] truncate rounded ${isBrand ? "hidden sm:block" : ""} bg-white/95 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-zinc-700 shadow-sm ring-1 ring-zinc-200/70`}>
          {item.sub.name}
        </span>
        <BrandBadge item={item} className="absolute right-2.5 top-2.5" />
      </Link>
      <div className={`flex flex-1 flex-col p-3.5 md:p-4 ${cutout ? "border-t border-zinc-100" : ""}`}>
        <h3 className="line-clamp-2 min-h-[2.6em] text-[0.88rem] font-semibold leading-[1.3] text-ink md:text-[0.95rem]">
          <Link href={item.href} className="hover:underline hover:underline-offset-2">
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[0.7rem] uppercase tracking-[0.12em] text-zinc-400">{cardMeta(item)}</p>
        <a
          href={quoteHref(quoteName(item))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-dark mt-3.5 w-full"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Request Quote
        </a>
      </div>
    </article>
  );
}
