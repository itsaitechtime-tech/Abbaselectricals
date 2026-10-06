import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { WhatsAppIcon } from "@/components/Icons";
import { BrandBadge } from "@/components/BrandBadge";
import { ProductCard, ProductMedia } from "@/components/ProductCard";
import { Breadcrumbs, Container } from "@/components/Section";
import { catalog, findItem, quoteHref, quoteName, specTable } from "@/lib/catalog";
import { brandOf } from "@/lib/products";
import { site } from "@/lib/site";

type Params = { group: string; sub: string; id: string };

export function generateStaticParams(): Params[] {
  return catalog.map((c) => ({ group: c.group.slug, sub: c.sub.slug, id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const item = findItem(id);
  if (!item) return {};
  return {
    title: quoteName(item),
    description: `${quoteName(item)} — ${item.use} Supplied and installed by Barq Lumi, Sharjah. Request a quote on WhatsApp.`,
    alternates: { canonical: item.href },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { group, sub, id } = await params;
  const item = findItem(id);
  if (!item || item.group.slug !== group || item.sub.slug !== sub) notFound();
  const { rows, features } = specTable(item);
  const brand = brandOf(item);
  const isBrand = brand !== "Barq Lumi";
  const variants = item.variants ?? [];
  const vcols = (["power", "lumens", "intensity", "beam", "size", "note"] as const).filter((k) =>
    variants.some((v) => v[k])
  );
  const vlabel = {
    power: "Power",
    lumens: "Lumens",
    intensity: "Intensity",
    beam: "Beam",
    size: "Size",
    note: "Version",
  } as const;
  const cutout = isBrand || !!item.photoNote;
  const multiLumen = variants.some((v) => (v.lumens ?? "").includes(" / "));
  const related = catalog.filter((c) => c.sub.slug === item.sub.slug && c.id !== item.id).slice(0, 4);
  const more =
    related.length < 4
      ? catalog.filter((c) => c.group.slug === item.group.slug && c.sub.slug !== item.sub.slug).slice(0, 4 - related.length)
      : [];

  return (
    <>
      <section className="bg-ink pb-8 pt-24 text-white md:pb-10 md:pt-28">
        <Container>
          <Breadcrumbs
            items={[
              { href: "/products/", label: "Products" },
              { href: `/products/${item.group.slug}/`, label: item.group.name },
              { href: `/products/${item.group.slug}/${item.sub.slug}/`, label: item.sub.name },
              { label: item.name },
            ]}
          />
        </Container>
      </section>

      <section className="bg-white py-10 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Gallery */}
            <div>
              {item.photo ? (
                <Gallery
                  images={[item.photo, ...item.gallery]}
                  alt={isBrand ? `${item.brandLabel ?? brand} ${item.name}` : item.name}
                  tag={item.sub.name}
                  contain={cutout}
                />
              ) : (
                <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  <ProductMedia item={item} sizes="(max-width: 1024px) 100vw, 50vw" iconClass="h-32 w-32" />
                  <span className="absolute left-4 top-4 rounded bg-white/95 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-zinc-700 shadow-sm">
                    {item.sub.name}
                  </span>
                </div>
              )}
              <p className="mt-3 text-xs text-zinc-400">
                {item.photoNote
                  ? `${item.representativeImage ? "Representative image. " : ""}${item.photoNote}`
                  : isBrand
                  ? `Official ${brand} product photo, as published by the UAE distributor En-Light. Datasheets on request.`
                  : item.photo
                    ? "Representative photo of the product type. Exact product photos and datasheets on request."
                    : "Product photos and datasheets on request."}
              </p>
            </div>

            {/* Details */}
            <div className="min-w-0">
              <p className="eyebrow mb-4">
                {item.group.name} · {item.sub.name}
              </p>
              {isBrand && (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <BrandBadge item={item} className="!text-[0.66rem] !px-2 !py-1" />
                  <span>
                    Brand: <span className="font-semibold text-ink">{item.brandLabel ?? brand}</span>
                    {item.model && (
                      <>
                        {" "}· Model: <span className="font-semibold text-ink">{item.model}</span>
                      </>
                    )}
                    {variants.length > 0 && <> · {variants.length} {variants.length === 1 ? "model" : "models"}</>}
                  </span>
                </div>
              )}
              <h1 className="h-display text-[2rem] text-ink md:text-[2.6rem]">{item.name}</h1>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 md:text-lg">{item.use}</p>

              {rows.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200">
                  <p className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Technical Specifications
                  </p>
                  <dl>
                    {rows.map((r) => (
                      <div key={r.label} className="grid grid-cols-[9rem_1fr] border-b border-zinc-100 px-5 py-3 text-sm last:border-0">
                        <dt className="text-zinc-500">{r.label}</dt>
                        <dd className="font-medium text-ink">{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {item.applications && item.applications.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Applications
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {item.applications.map((a) => (
                      <li key={a} className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {variants.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
                  <p className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Models &amp; Variants
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[28rem] text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[0.66rem] uppercase tracking-[0.12em] text-zinc-400">
                          <th className="px-5 py-2.5 font-semibold">Model</th>
                          {vcols.map((c) => (
                            <th key={c} className="px-3 py-2.5 font-semibold">
                              {vlabel[c]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v) => (
                          <tr key={v.model} className="border-b border-zinc-100 last:border-0">
                            <td className="whitespace-nowrap px-5 py-2.5 font-medium text-ink">{v.model}</td>
                            {vcols.map((c) => (
                              <td key={c} className="px-3 py-2.5 text-zinc-600">
                                {v[c] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {multiLumen && (
                    <p className="border-t border-zinc-100 px-5 py-2.5 text-[0.7rem] text-zinc-400">
                      Where several lumen values are listed, they follow the order of the CCT options above.
                    </p>
                  )}
                </div>
              )}

              {features.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {rows.length > 0 && !item.applications ? "Also" : "Key Features"}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {features.map((f) => (
                      <li key={f} className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a href={quoteHref(quoteName(item))} target="_blank" rel="noopener noreferrer" className="btn btn-dark h-12">
                  <WhatsAppIcon /> Request Quote
                </a>
                <a href={site.tel.href} className="btn btn-outline-dark h-12">
                  Call {site.tel.display}
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-zinc-400">
                No online pricing — quotes are prepared per project, including supply and installation where
                needed.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {related.length + more.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-14 md:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">You May Also Need</p>
                <h2 className="h-display text-2xl text-ink md:text-3xl">Related Products</h2>
              </div>
              <Link
                href={`/products/${item.group.slug}/${item.sub.slug}/`}
                className="hidden text-sm font-semibold text-ink underline underline-offset-4 md:inline"
              >
                View all {item.sub.name}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {[...related, ...more].map((r) => (
                <ProductCard key={r.id} item={r} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
