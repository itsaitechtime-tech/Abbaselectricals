import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { Container, PageBanner, SectionTitle } from "@/components/Section";
import { services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Façade, interior, emergency, RGB/DMX, garden and smart-home lighting plus electrical works from main supply to DB — specified, supplied and installed by Barq Lumi across the UAE.",
  alternates: { canonical: "/services/" },
};

const primary = services.filter((s) => s.slug !== "sanitary");
const secondary = services.filter((s) => s.slug === "sanitary");

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        image="/images/stock/cat-aluminum-profiles.webp"
        alt="Linear light lines crossing a dark wall and ceiling"
        crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
        eyebrow="What We Do"
        title={
          <>
            Designed, Supplied,
            <br />
            Installed.
          </>
        }
        description="Lighting-led electrical packages — one team from specification to handover."
        size="md"
      />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <SectionTitle
            eyebrow="Lighting & Electrical"
            title="Our Expertise"
            description="Core capabilities for façades, interiors, emergency systems and smart control."
          />
          <div className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            {primary.map((s, i) => (
              <article key={s.slug} className="bg-white p-7">
                <p className="font-display text-sm font-semibold text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="h-display mt-4 text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{s.summary}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-zinc-50 py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-4">How We Scope</p>
              <h2 className="h-display text-[2rem] text-ink md:text-[2.6rem]">From site visit to handover</h2>
              <ol className="mt-8 space-y-5">
                {[
                  ["Site visit", "We see the space, the ceiling voids and the power in person."],
                  ["Specification", "Fittings, optics, CCT and control matched to the brief and drawings."],
                  ["Supply schedule", "Specified materials only — no substitution without written agreement."],
                  ["Install & handover", "Installed against the approved schedule, with records that stay with the building."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-5 border-b border-zinc-200 pb-5">
                    <span className="font-display text-sm font-semibold text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-semibold text-ink">{t}</p>
                      <p className="mt-1 text-sm text-zinc-500">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col justify-between gap-8 rounded-xl bg-ink p-8 text-white md:p-10">
              <div>
                <p className="eyebrow mb-4">Also Available</p>
                {secondary.map((s) => (
                  <div key={s.slug}>
                    <h3 className="h-display text-2xl">{s.title.replace(" (secondary)", "")}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{s.summary}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                  <WhatsAppIcon /> WhatsApp
                </a>
                <Link href="/products/" className="btn btn-outline-light">
                  Products <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
