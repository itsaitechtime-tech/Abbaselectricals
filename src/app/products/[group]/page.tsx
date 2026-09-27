import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpBand, SubTile } from "@/components/Catalog";
import { ProductCard } from "@/components/ProductCard";
import { Container, PageBanner } from "@/components/Section";
import { catalog, findGroup, groupCount, groups } from "@/lib/catalog";

type Params = { group: string };

export function generateStaticParams(): Params[] {
  return groups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { group } = await params;
  const g = findGroup(group);
  if (!g) return {};
  return {
    title: `${g.name} Lighting`,
    description: `${g.blurb} ${groupCount(g)} products from Barq Lumi, Sharjah — quotes on request.`,
    alternates: { canonical: `/products/${g.slug}/` },
  };
}

export default async function GroupPage({ params }: { params: Promise<Params> }) {
  const { group } = await params;
  const g = findGroup(group);
  if (!g) notFound();
  const items = catalog.filter((c) => c.group.slug === g.slug);

  return (
    <>
      <PageBanner
        image={g.banner}
        alt={`${g.name} lighting`}
        crumbs={[{ href: "/", label: "Home" }, { href: "/products/", label: "Products" }, { label: g.name }]}
        eyebrow={g.eyebrow}
        title={g.name}
        description={g.blurb}
        meta={`${groupCount(g)} ${groupCount(g) === 1 ? "product" : "products"} · ${g.subs.length} ${g.subs.length === 1 ? "category" : "categories"}`}
        size="lg"
      />

      <section className="sticky top-16 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur md:top-[4.5rem]">
        <Container>
          <div className="no-scrollbar flex gap-2 overflow-x-auto py-3">
            {groups.map((x) => (
              <Link
                key={x.slug}
                href={`/products/${x.slug}/`}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  x.slug === g.slug
                    ? "border-ink bg-ink text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {x.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="mb-8">
            <h2 className="h-display text-2xl text-ink md:text-3xl">Browse {g.name}</h2>
            <p className="mt-2 text-sm text-zinc-500">Choose a category to see its products.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {g.subs.map((s) => (
              <SubTile key={s.slug} groupSlug={g.slug} sub={s} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-zinc-50 py-14 md:py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">All {g.name}</p>
              <h2 className="h-display text-2xl text-ink md:text-3xl">{items.length} Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <HelpBand />
    </>
  );
}
