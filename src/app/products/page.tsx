import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Section } from "@/components/Section";
import { productCount } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Barq Lumi specifies, supplies and installs aluminum architectural profiles, LED strip lights, wall washers, drivers, accessories and luminaires — Sharjah, UAE. No prices listed; enquire for project specification.",
  alternates: { canonical: "/products/" },
  openGraph: {
    title: `Products · ${site.name}`,
    description:
      "Barq Lumi — aluminum profiles, LED strips, wall washers and electrical package items. Specified, supplied and installed across the UAE.",
    url: `${site.url}/products/`,
  },
};

export default function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-glow -left-32 -top-16 h-[32rem] w-[32rem] bg-[radial-gradient(circle,rgba(212,175,106,0.2),transparent_68%)]" />
          <div className="hero-glow bottom-0 right-0 h-[26rem] w-[26rem] bg-[radial-gradient(circle,rgba(126,184,212,0.12),transparent_65%)]" />
          <div className="absolute inset-0 opacity-25 grid-fade" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow mb-4">Catalog · {productCount}+ lines</p>
          <h1 className="display max-w-3xl text-4xl text-cream sm:text-5xl lg:text-[3.5rem]">
            Specified, supplied and installed
          </h1>
          <span className="gold-rule" aria-hidden />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
            Barq Lumi specifies, supplies and installs architectural aluminum profiles (AL6063-T5),
            LED strip systems, wall washers and the supporting electrical package for UAE projects.
            Catalog plates illustrate product type; enquire for specification and availability.
            Not exclusive brands; not our manufactured SKUs.
          </p>
        </div>
      </section>

      <Section className="!pt-10">
        <ProductCatalog />
      </Section>

      <Section className="border-t border-line !pt-12 !pb-16">
        <div className="panel-gold flex flex-col gap-6 rounded-2xl p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="eyebrow mb-2">Project enquiry</p>
            <p className="display text-2xl text-cream md:text-3xl">
              Share drawings or a brief
            </p>
            <p className="mt-3 text-sm text-paper-muted">
              We confirm specification, lead times and install coordination — no public pricing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp
            </a>
            <Link href="/contact/" className="btn btn-primary">
              Request a site visit
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
