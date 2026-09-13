import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProjectCard } from "@/components/ProjectCard";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { featuredProducts } from "@/lib/products";
import { lightingBrands, projects, services, site, whoWeAre } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} · Lighting · Sharjah, UAE`,
  },
  description:
    "Barq Lumi specifies, supplies and installs lighting and electrical works for buildings that have to look finished at night. Façade, interior, emergency, and smart lighting from Muweilah, Sharjah. Licensed since 2006.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} · Lighting · Sharjah, UAE`,
    description:
      "Barq Lumi — façade, interior, emergency, and smart lighting. Specified, supplied and installed. From main supply to the last fitting.",
    url: site.url,
  },
};

const homeServices = services.filter((s) =>
  [
    "facade-architectural",
    "interior-villa",
    "emergency",
    "gaming-rgb-dmx",
    "electrical",
    "smart-home",
  ].includes(s.slug)
);

const homeProjects = projects.filter((project) => project.image).slice(0, 4);

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-glow -left-28 -top-20 h-[36rem] w-[36rem] bg-[radial-gradient(circle,rgba(212,175,106,0.22),transparent_68%)]" />
          <div className="hero-glow top-1/3 right-0 h-[28rem] w-[28rem] bg-[radial-gradient(circle,rgba(126,184,212,0.14),transparent_65%)]" />
          <div className="hero-glow bottom-0 left-1/3 h-[20rem] w-[20rem] bg-[radial-gradient(circle,rgba(212,175,106,0.08),transparent_70%)]" />
          <div className="absolute inset-0 opacity-25 grid-fade" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-32 lg:gap-20">
          <div>
            <p className="eyebrow">Sharjah · serving the UAE · since {site.established}</p>
            <h1 className="display mt-6 text-[2.65rem] text-cream sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
              Lighting and electrical works for buildings that have to look finished at night.
            </h1>
            <span className="gold-rule" aria-hidden />
            <p className="mt-7 max-w-xl text-base leading-relaxed text-paper-muted md:text-lg">
              Façade, interior, emergency, and smart lighting — supply and install. From main
              supply to the last fitting.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                WhatsApp
              </a>
              <a
                href={site.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Instagram {site.instagram.display}
              </a>
              <Link href="/contact/" className="btn btn-primary">
                Request a site visit
              </Link>
              <Link href="/products/" className="btn btn-ghost">
                View products
              </Link>
            </div>
          </div>

          <div className="panel-gold relative min-h-[20rem] overflow-hidden rounded-3xl md:min-h-[26rem]">
            <Image
              src="/projects/facade-linear-residential.jpeg"
              alt="Residential building façade with linear architectural lighting at dusk"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.88)] via-[rgba(10,10,10,0.35)] to-[rgba(10,10,10,0.12)]" />
            <div className="relative flex h-full min-h-[20rem] flex-col justify-between p-7 md:min-h-[26rem]">
              <p className="eyebrow">Night finish · completed install</p>
              <div>
                <p className="display text-3xl text-cream md:text-[2.6rem]">
                  From the façade line to the final circuit.
                </p>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper-muted md:text-base">
                  Supply-and-install lighting and electrical packages coordinated for buildings
                  that must read correctly after dark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="!py-14 border-b border-line bg-charcoal-elevated/50">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Who we are</p>
            <h2 className="display text-3xl text-cream md:text-4xl">
              Licensed in the UAE since {site.established}
            </h2>
            <span className="gold-rule" aria-hidden />
            <p className="mt-5 text-sm leading-relaxed text-paper-muted md:text-base">
              Barq Lumi specifies, supplies and installs lighting and electrical packages from
              Muweilah, Sharjah — quality first, clear responsibility, disciplined execution,
              accountable handover.
            </p>
          </div>
          <Link href="/about/" className="btn btn-ghost shrink-0">
            About Barq Lumi
          </Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {whoWeAre.map((item) => (
            <div key={item.title} className="panel-gold rounded-xl px-5 py-5">
              <p className="eyebrow">{item.title}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Catalog"
          title="Featured products"
          description="Aluminum profiles, LED strips and wall washers — specified, supplied and installed. Atmospheric panels only; enquire for project specification."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10">
          <Link href="/products/" className="btn btn-ghost">
            Browse full catalog
          </Link>
        </div>
      </Section>

      <Section className="border-y border-line bg-charcoal-elevated/40">
        <SectionHeading
          eyebrow="Expertise"
          title="Lighting-led electrical packages"
          description="Core capabilities for façades, interiors, emergency systems, and smart control — with sanitary available as a secondary line."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeServices.map((service, i) => (
            <ServiceCard
              key={service.slug}
              title={service.title}
              summary={service.summary}
              index={i + 1}
            />
          ))}
        </div>
        <div className="mt-10">
          <Link href="/services/" className="btn btn-ghost">
            View all expertise
          </Link>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Selected work"
          title="Recent projects"
          description="Completed Barq Lumi installs first. Older cards without photographs stay anonymised by type and location."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {homeProjects.map((project) => (
            <ProjectCard key={`${project.title}-${project.location}`} {...project} />
          ))}
        </div>
        <div className="mt-10">
          <Link href="/projects/" className="btn btn-ghost">
            View all projects
          </Link>
        </div>
      </Section>

      <Section className="border-t border-line bg-charcoal-elevated/30">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-3">About</p>
            <h2 className="display text-3xl text-cream md:text-4xl">
              Supply-and-install from Muweilah
            </h2>
            <span className="gold-rule" aria-hidden />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper-muted">
              Barq Lumi is the lighting brand of {site.legalName}. Specified, supplied and
              installed from Muweilah, Sharjah — serving projects across the UAE since{" "}
              {site.established}.
            </p>
            <p className="mt-2 text-xs text-paper-muted/70">
              Trading / domain: {site.tradingName} · www.abbaselectricals.com
            </p>
            <Link href="/about/" className="btn btn-ghost mt-8">
              Mission, vision & quality
            </Link>
          </div>
          <div className="panel-gold rounded-2xl p-7">
            <p className="eyebrow mb-4">Brands we specify, supply & install</p>
            <p className="text-sm leading-relaxed text-paper-muted">
              {lightingBrands.slice(0, 10).join(" · ")}
              <span className="text-paper-muted/50"> · and others</span>
            </p>
            <p className="mt-4 text-xs text-paper-muted/80">
              Brands listed as supplied fittings and gear — not claimed partnerships.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line !pt-12 !pb-16">
        <div className="panel-gold flex flex-col gap-6 rounded-2xl p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div>
            <p className="eyebrow mb-2">Contact</p>
            <p className="display text-2xl text-cream md:text-3xl">
              Speak with the team
            </p>
            <p className="mt-3 text-sm text-paper-muted">
              {site.tel.display} · WhatsApp {site.whatsapp.display} · {site.email.display} ·{" "}
              <a href={site.instagram.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-bright">
                {site.instagram.display}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
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
