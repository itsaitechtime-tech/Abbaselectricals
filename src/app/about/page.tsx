import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import {
  lightingBrands,
  qualityAssurance,
  sanitaryBrands,
  selectedClients,
  site,
  whoWeAre,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Barq Lumi — lighting brand of ABBAS AHMED SANITARY & ELECTRIC WARE TR LLC. Licensed in the UAE since 2006. Quality first, clear responsibility, disciplined execution, and accountable handover. From Muweilah, Sharjah.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: `About · ${site.name}`,
    description:
      "Who we are, mission and vision, quality assurance, brands we specify, supply and install, and selected clients across the UAE.",
    url: `${site.url}/about/`,
  },
};

export default function AboutPage() {
  return (
    <>
      <Section className="!pb-8">
        <p className="eyebrow mb-3">About</p>
        <h1 className="display max-w-3xl text-4xl text-cream md:text-5xl">
          Barq Lumi
        </h1>
        <span className="gold-rule" aria-hidden />
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
          Barq Lumi is the lighting brand of {site.legalName} (Muweilah). We specify,
          supply and install lighting and electrical packages for buildings that must
          look finished at night — continuous trade since {site.established}.
        </p>
        <p className="mt-3 text-xs tracking-wide text-paper-muted/75">
          Trading / domain name: {site.tradingName} · www.abbaselectricals.com
        </p>
        <p className="mt-3 text-sm text-accent">
          Licensed in the UAE since {site.established} · {site.address.display}
        </p>
        <p className="mt-4">
          <a
            href={site.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-[0.12em] text-accent hover:text-accent-bright"
          >
            Instagram {site.instagram.display}
          </a>
        </p>
      </Section>

      <Section className="!pt-4 border-t border-line">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whoWeAre.map((item) => (
            <article key={item.title} className="panel-gold rounded-2xl p-6">
              <p className="eyebrow mb-3">{item.title}</p>
              <p className="text-sm leading-relaxed text-paper">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-y border-line bg-charcoal-elevated/60">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="panel rounded-2xl p-6 md:p-8">
            <p className="eyebrow mb-3">Mission</p>
            <h2 className="display text-2xl text-cream md:text-3xl">
              {site.mission}
            </h2>
            <span className="gold-rule" aria-hidden />
          </article>
          <article className="panel rounded-2xl p-6 md:p-8">
            <p className="eyebrow mb-3">Vision</p>
            <h2 className="display text-2xl text-cream md:text-3xl">
              {site.vision}
            </h2>
            <span className="gold-rule" aria-hidden />
          </article>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Quality assurance & responsibility"
          title="How we stand behind the work"
          description="Named accountability, specified materials, inspection, site quality, and records that stay with the building."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qualityAssurance.map((item) => (
            <article key={item.title} className="panel rounded-2xl p-6">
              <p className="eyebrow mb-3">{item.title}</p>
              <p className="text-sm leading-relaxed text-paper">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <SectionHeading
          eyebrow="Brands"
          title="We specify, supply and install"
          description="Product lines we work with on projects — not claimed partnerships or exclusive dealerships. University of Sharjah appears under clients, not brands."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel rounded-2xl p-6">
            <p className="eyebrow mb-4">Lighting & electrical</p>
            <ul className="flex flex-wrap gap-2">
              {lightingBrands.map((brand) => (
                <li
                  key={brand}
                  className="rounded-full border border-line px-3 py-1.5 text-xs tracking-wide text-paper-muted"
                >
                  {brand}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel rounded-2xl p-6">
            <p className="eyebrow mb-4">Sanitary (secondary)</p>
            <ul className="flex flex-wrap gap-2">
              {sanitaryBrands.map((brand) => (
                <li
                  key={brand}
                  className="rounded-full border border-line px-3 py-1.5 text-xs tracking-wide text-paper-muted"
                >
                  {brand}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line bg-charcoal-elevated/50">
        <SectionHeading
          eyebrow="Selected clients"
          title="Organisations we have supplied"
          description="Names drawn from the company profile. Presented as text — no fabricated endorsements."
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedClients.map((client) => (
            <li key={client} className="panel rounded-xl px-5 py-4 text-sm text-paper">
              {client}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="panel flex flex-col gap-6 rounded-2xl p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="eyebrow mb-2">Contact</p>
            <h2 className="display text-2xl text-cream">Start a conversation</h2>
            <span className="gold-rule" aria-hidden />
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
