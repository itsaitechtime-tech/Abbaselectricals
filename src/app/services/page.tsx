import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Barq Lumi expertise: façade and architectural lighting, interior and villa schemes, emergency lighting, RGB/DMX, garden and outdoor, LED supply, main electrical distribution, smart home (Tuya Wi-Fi & Zigbee), and secondary sanitary ware — Sharjah, UAE.",
  alternates: { canonical: "/services/" },
  openGraph: {
    title: `Services · ${site.name}`,
    description:
      "Lighting, electrical, smart home, and sanitary expertise: façade, interior, emergency, RGB-DMX, garden, LED supply, and Tuya Wi-Fi / Zigbee.",
    url: `${site.url}/services/`,
  },
};

export default function ServicesPage() {
  const primary = services.filter((s) => s.slug !== "sanitary");
  const secondary = services.filter((s) => s.slug === "sanitary");

  return (
    <>
      <Section className="!pb-8">
        <p className="eyebrow mb-3">Expertise</p>
        <h1 className="display max-w-3xl text-4xl text-cream md:text-5xl lg:text-[3.4rem]">
          Lighting, electrical, smart home & sanitary
        </h1>
        <span className="gold-rule" aria-hidden />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
          Barq Lumi specifies, supplies and installs from Muweilah, Sharjah. Expertise covers
          façade and architectural lighting, interiors, emergency systems, RGB-DMX, garden and
          outdoor, LED supply, main electrical distribution, and smart home (Tuya Wi-Fi / Zigbee).
          Sanitary ware is available as a secondary line.
        </p>
      </Section>

      <Section className="!pt-2 !pb-10 border-b border-line bg-charcoal-elevated/40">
        <SectionHeading
          eyebrow="Product families"
          title="Profiles, strips & wall washers"
          description="Three core lighting families we specify, supply and install on UAE projects — plus drivers, accessories and the electrical package."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <article className="panel-gold rounded-2xl p-6">
            <p className="eyebrow mb-3">01</p>
            <h3 className="display text-xl text-cream md:text-2xl">Aluminum profiles</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper-muted">
              AL6063-T5 architectural extrusions — recessed trimless, surface, pendant, in-ground
              IP67, hermetic façade and custom RAL finishes, with opal/frosted/clear/lensed
              diffusers.
            </p>
          </article>
          <article className="panel-gold rounded-2xl p-6">
            <p className="eyebrow mb-3">02</p>
            <h3 className="display text-xl text-cream md:text-2xl">LED strip lights</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper-muted">
              24V COB and SMD systems (IP20–IP68), tunable CCT, RGB/RGBW, neon-flex and
              long-run 48V façade tape — CRI 90+ for retail and villa interiors.
            </p>
          </article>
          <article className="panel-gold rounded-2xl p-6">
            <p className="eyebrow mb-3">03</p>
            <h3 className="display text-xl text-cream md:text-2xl">Wall washers</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper-muted">
              Linear and asymmetric wash for façades, columns and water features — die-cast
              aluminium, SS coastal hardware, DMX512 and 0–10V control.
            </p>
          </article>
        </div>
        <div className="mt-8">
          <Link href="/products/" className="btn btn-ghost">
            Browse products catalog
          </Link>
        </div>
      </Section>

      <Section className="!pt-12">
        <SectionHeading
          eyebrow="Lighting & electrical"
          title="Primary expertise"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primary.map((service, i) => (
            <ServiceCard
              key={service.slug}
              title={service.title}
              summary={service.summary}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      <Section className="border-t border-line bg-charcoal-elevated/50">
        <SectionHeading
          eyebrow="Secondary"
          title="Sanitary ware"
          description="Available alongside electrical packages where a project benefits from a single coordinated vendor. Not the lead offering."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {secondary.map((service) => (
            <ServiceCard key={service.slug} title={service.title} summary={service.summary} />
          ))}
          <article className="panel rounded-2xl p-6">
            <h3 className="display text-xl text-cream">How we scope</h3>
            <span className="gold-rule" aria-hidden />
            <p className="mt-3 text-sm leading-relaxed text-paper-muted">
              Site visit, specification review, supply schedule, and install coordination. WhatsApp
              or email with drawings or a brief and we will confirm the next step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp !py-2 text-sm"
              >
                WhatsApp
              </a>
              <Link href="/contact/" className="btn btn-ghost !py-2 text-sm">
                Request a site visit
              </Link>
            </div>
          </article>
        </div>
      </Section>
    </>
  );
}
