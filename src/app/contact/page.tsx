import type { Metadata } from "next";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { Container, PageBanner } from "@/components/Section";
import { site } from "@/lib/site";
import { mapHref } from "@/lib/site-extra";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Barq Lumi in Muweilah, Sharjah. Tel 055 341 8850, WhatsApp 052 850 0094, Info@abbaselectricals.com, Instagram @barqlumi.",
  alternates: { canonical: "/contact/" },
};

const channels = [
  { label: "Telephone", value: site.tel.display, href: site.tel.href, note: "Call during business hours" },
  { label: "WhatsApp", value: site.whatsapp.display, href: site.whatsapp.href, note: "Best for drawings, photos and site visits", external: true },
  { label: "Email", value: site.email.display, href: site.email.href, note: "Specifications and formal enquiries" },
  { label: "Instagram", value: site.instagram.display, href: site.instagram.href, note: "Recent work and updates", external: true },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner
        image="/images/stock/space-hospitality.webp"
        alt="Hotel lobby with warm architectural lighting"
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        eyebrow="Get in Touch"
        title={
          <>
            Let&apos;s Light
            <br />
            Your Project.
          </>
        }
        description="Share a location, drawings or a brief. We reply on WhatsApp, phone or email — no forms."
        size="md"
      />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="group rounded-lg border border-zinc-200 p-6 transition hover:border-ink"
              >
                <p className="eyebrow mb-4">{c.label}</p>
                <p className="h-display break-words text-xl text-ink">{c.value}</p>
                <p className="mt-2 text-sm text-zinc-500">{c.note}</p>
              </a>
            ))}
          </div>

          <div className="mt-12 grid gap-10 rounded-xl bg-ink p-8 text-white md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow mb-4">Visit Us</p>
              <h2 className="h-display text-[2rem] md:text-[2.4rem]">Muweilah, Sharjah</h2>
              <p className="mt-4 text-white/65">
                {site.address.display}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                  Open in Google Maps <ArrowIcon />
                </a>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
            </div>
            <dl className="space-y-5 text-sm md:border-l md:border-white/10 md:pl-10">
              <div>
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/45">Legal entity</dt>
                <dd className="mt-1.5 text-white/90">{site.legalName}</dd>
              </div>
              <div>
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/45">VAT TRN</dt>
                <dd className="mt-1.5 text-white/90">{site.vatTrn}</dd>
              </div>
              <div>
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/45">Licensed</dt>
                <dd className="mt-1.5 text-white/90">In the UAE since {site.established}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
