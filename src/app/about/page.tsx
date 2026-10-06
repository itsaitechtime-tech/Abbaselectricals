import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/Icons";
import { Container, PageBanner, SectionTitle } from "@/components/Section";
import { clientLogos, lightingBrands, qualityAssurance, sanitaryBrands, selectedClients, site, whoWeAre } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Barq Lumi — the lighting brand of ABBAS AHMED SANITARY & ELECTRIC WARE TR LLC. Licensed in the UAE since 2006. Muweilah, Sharjah.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        image="/projects/web/kitchen-recessed.webp"
        alt="Kitchen with recessed white linear lighting — a completed Barq Lumi install"
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        eyebrow="About Barq Lumi"
        title={
          <>
            Light, Done Once
            <br />
            and Done Right.
          </>
        }
        description={`The lighting brand of ${site.legalName} — licensed in the UAE since ${site.established}.`}
        size="md"
      />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow mb-4">Who We Are</p>
              <h2 className="h-display text-[2rem] text-ink md:text-[2.6rem]">
                From Muweilah,
                <br />
                for the whole UAE.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-zinc-600 md:text-lg">
              <p>
                Barq Lumi specifies, supplies and installs lighting and electrical packages for villas,
                commercial interiors and façades. One team carries the job from the first drawing to the
                final circuit.
              </p>
              <p className="text-sm text-zinc-500">
                Trading as {site.tradingName} · abbaselectricals.com · {site.address.display}
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            {whoWeAre.map((w) => (
              <div key={w.title} className="bg-white p-7">
                <h3 className="h-display text-lg text-ink">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{w.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-16 text-white md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-8 md:p-10">
              <p className="eyebrow mb-4">Mission</p>
              <p className="h-display text-2xl md:text-3xl">{site.mission}</p>
            </div>
            <div className="rounded-xl border border-white/10 p-8 md:p-10">
              <p className="eyebrow mb-4">Vision</p>
              <p className="h-display text-2xl md:text-3xl">{site.vision}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <SectionTitle
            eyebrow="Quality & Responsibility"
            title="How We Stand Behind the Work"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qualityAssurance.map((q) => (
              <div key={q.title} className="rounded-lg border border-zinc-200 p-6">
                <h3 className="font-semibold text-ink">{q.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{q.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-zinc-50 py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-4">Brands We Supply</p>
              <p className="mb-6 text-sm text-zinc-500">
                Product lines we specify, supply and install — not claimed partnerships or dealerships.
              </p>
              <ul className="flex flex-wrap gap-2">
                {[...lightingBrands, ...sanitaryBrands].map((b) => (
                  <li key={b} className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Organisations We Have Supplied</p>
              <p className="mb-6 text-sm text-zinc-500">From the company profile — listed for reference, not endorsements.</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {selectedClients.map((c) => {
                  const logo = clientLogos[c];
                  return (
                    <li key={c} className="flex min-h-[3.25rem] items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-ink">
                      {logo && (
                        <Image src={logo.src} alt={`${c} logo`} width={logo.width} height={logo.height} className="h-6 w-auto shrink-0" />
                      )}
                      <span>{c}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-[1fr_1.2fr]">
            <div className="relative min-h-[240px]">
              <Image src="/projects/web/rgb-room-feature.webp" alt="RGB entertainment room — a completed Barq Lumi install" fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            </div>
            <div className="p-8 md:p-12">
              <p className="eyebrow mb-4">Let&apos;s Talk</p>
              <h2 className="h-display text-2xl md:text-3xl">Start with a conversation.</h2>
              <p className="mt-3 text-white/60">Tel {site.tel.display} · WhatsApp {site.whatsapp.display} · {site.email.display}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                  <WhatsAppIcon /> WhatsApp
                </a>
                <Link href="/contact/" className="btn btn-outline-light">Contact</Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
