import Image from "next/image";
import Link from "next/link";
import { CategoryIcon, WhatsAppIcon } from "@/components/Icons";
import { quoteHref, type CatalogItem } from "@/lib/catalog";

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
        alt={`${item.sub.name} — representative photo for ${item.name}`}
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

export function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
      <Link href={item.href} className="relative block aspect-square overflow-hidden bg-zinc-100">
        <ProductMedia item={item} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        <span className="absolute left-2.5 top-2.5 rounded bg-white/95 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-zinc-700 shadow-sm">
          {item.sub.name}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        <h3 className="line-clamp-2 min-h-[2.6em] text-[0.88rem] font-semibold leading-[1.3] text-ink md:text-[0.95rem]">
          <Link href={item.href} className="hover:underline hover:underline-offset-2">
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.7rem] uppercase tracking-[0.12em] text-zinc-400">{item.group.name}</p>
        <a
          href={quoteHref(item.name)}
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
