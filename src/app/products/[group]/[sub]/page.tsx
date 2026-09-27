import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpBand } from "@/components/Catalog";
import { ProductCard } from "@/components/ProductCard";
import { Container, PageBanner } from "@/components/Section";
import { findGroup, findSub, groups, itemsIn } from "@/lib/catalog";

type Params = { group: string; sub: string };

export function generateStaticParams(): Params[] {
  return groups.flatMap((g) => g.subs.map((s) => ({ group: g.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { group, sub } = await params;
  const s = findSub(group, sub);
  if (!s) return {};
  return {
    title: s.name,
    description: `${s.blurb} ${s.productIds.length} products — Barq Lumi, Sharjah. Request a quote on WhatsApp.`,
    alternates: { canonical: `/products/${group}/${sub}/` },
  };
}

export default async function SubCategoryPage({ params }: { params: Promise<Params> }) {
  const { group, sub } = await params;
  const g = findGroup(group);
  const s = findSub(group, sub);
  if (!g || !s) notFound();
  const items = itemsIn(s);

  return (
    <>
      <PageBanner
        image={s.image ?? g.banner}
        alt={`${s.name} — ${g.name} lighting`}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/products/", label: "Products" },
          { href: `/products/${g.slug}/`, label: g.name },
          { label: s.name },
        ]}
        eyebrow={g.name}
        title={s.name}
        description={s.blurb}
        meta={`${items.length} ${items.length === 1 ? "product" : "products"}`}
        size="sm"
      />

      <section className="bg-white pb-16 pt-8 md:pb-24 md:pt-10">
        <Container>
          <div className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-zinc-500">
              <span className="font-semibold text-ink">{items.length}</span>{" "}
              {items.length === 1 ? "product" : "products"} in {s.name}
            </p>
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
              {g.subs.map((x) => (
                <Link
                  key={x.slug}
                  href={`/products/${g.slug}/${x.slug}/`}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ${
                    x.slug === s.slug
                      ? "border-ink bg-ink text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  {x.name} <span className="opacity-60">{x.productIds.length}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-16 border-t border-zinc-200 pt-10">
            <p className="eyebrow eyebrow-muted mb-5">Other Categories</p>
            <div className="flex flex-wrap gap-2">
              {groups.flatMap((x) =>
                x.subs
                  .filter((y) => y.slug !== s.slug)
                  .map((y) => (
                    <Link
                      key={`${x.slug}-${y.slug}`}
                      href={`/products/${x.slug}/${y.slug}/`}
                      className={`rounded-md border px-3 py-2 text-sm ${
                        x.slug === g.slug ? "border-zinc-300 text-ink" : "border-zinc-200 text-zinc-500"
                      } hover:border-ink hover:text-ink`}
                    >
                      {y.name}
                    </Link>
                  ))
              )}
            </div>
          </div>
        </Container>
      </section>

      <HelpBand />
    </>
  );
}
