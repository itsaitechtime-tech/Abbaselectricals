import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Barq Lumi in Muweilah, Sharjah. Telephone 055 341 8850, WhatsApp 052 850 0094, email Info@abbaselectricals.com, Instagram @barqlumi.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: `Contact · ${site.name}`,
    description:
      "Request a site visit or send drawings. Tel, WhatsApp, email, and Instagram @barqlumi for Barq Lumi, Sharjah.",
    url: `${site.url}/contact/`,
  },
};

const channels = [
  {
    label: "Telephone",
    value: site.tel.display,
    href: site.tel.href,
    note: "Call during business hours",
  },
  {
    label: "WhatsApp",
    value: site.whatsapp.display,
    href: site.whatsapp.href,
    note: "Preferred for site visits and drawings",
    external: true,
  },
  {
    label: "Email",
    value: site.email.display,
    href: site.email.href,
    note: "Specifications and formal enquiries",
  },
  {
    label: "Instagram",
    value: site.instagram.display,
    href: site.instagram.href,
    note: "Lighting work and updates",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <Section className="!pb-8">
        <p className="eyebrow mb-3">Contact</p>
        <h1 className="display max-w-3xl text-4xl text-cream md:text-5xl">
          Request a site visit
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
          Share a location, drawings, or a brief with Barq Lumi. We respond on WhatsApp,
          telephone, email, or Instagram {site.instagram.display}. No web form in this release —
          direct channels only.
        </p>
      </Section>

      <Section className="!pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="panel group rounded-2xl p-6 transition hover:border-line-strong"
            >
              <p className="eyebrow">{channel.label}</p>
              <p className="display mt-3 text-2xl text-cream group-hover:text-paper">
                {channel.value}
              </p>
              <p className="mt-2 text-sm text-paper-muted">{channel.note}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line bg-charcoal-elevated/50">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow mb-3">Address</p>
            <h2 className="display text-3xl text-cream">Muweilah, Sharjah</h2>
            <p className="mt-4 text-base text-paper-muted">{site.address.display}</p>
            <p className="mt-6 text-sm leading-relaxed text-paper-muted">
              Legal entity: {site.legalName}
            </p>
            <p className="mt-2 text-sm text-paper-muted">VAT TRN {site.vatTrn}</p>
          </div>
          <div className="panel atmosphere atmosphere-cool rounded-2xl p-6 md:p-8">
            <p className="eyebrow mb-3">Quick start</p>
            <p className="display text-2xl text-cream">
              Message on WhatsApp with your project location and a short brief.
            </p>
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp mt-8"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
