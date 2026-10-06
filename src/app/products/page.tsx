import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/Icons";
import { HelpBand, SubTile } from "@/components/Catalog";
import { Container, PageBanner, SectionTitle } from "@/components/Section";
import { groupCount, groups, otherGroups, subCount, totalProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description: `Barq Lumi product catalogue — ${totalProducts} products across ${subCount} categories. Specified, supplied and installed in the UAE. Quotes on request.`,
  alternates: { canonical: "/products/" },
};

export default function ProductsPage() {
  return (
    <>
      <PageBanner
        image="/images/stock/banner-products.webp"
        alt="Curved interior corridor lit by concealed linear light at night"
        crumbs={[{ href: "/", label: "Home" }, { label: "Products" }]}
        eyebrow="The Collection"
        title={
          <>
            Architectural Lighting,
            <br />
            Curated for the UAE.
          </>
        }
        description="Indoor and outdoor luminaires, linear systems, LED strip and controls — specified for the project, supplied and installed by our team."
        meta={`${totalProducts} products · ${groups.length} groups · ${subCount} categories`}
        size="lg"
      />

      {groups.map((g, gi) => (
        <section
          key={g.slug}
          id={g.slug === otherGroups[0]?.slug ? "electrical-sanitary" : undefined}
          className={`${gi % 2 === 0 ? "bg-white" : "bg-zinc-50"} py-16 md:py-24 ${
            g.slug === otherGroups[0]?.slug ? "scroll-mt-20 border-t-4 border-zinc-200" : ""
          }`}
        >
          <Container>
            <SectionTitle
              eyebrow={g.eyebrow}
              title={g.name}
              description={`${g.blurb} ${groupCount(g)} ${groupCount(g) === 1 ? "product" : "products"}.`}
              action={
                <Link href={`/products/${g.slug}/`} className="btn btn-outline-dark self-start md:self-auto">
                  Explore {g.name} <ArrowIcon />
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {g.subs.map((s) => (
                <SubTile key={s.slug} groupSlug={g.slug} sub={s} />
              ))}
            </div>
          </Container>
        </section>
      ))}

      <HelpBand />
    </>
  );
}

