import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionTitle } from "@/components/Section";
import { catalog, groupBanner, groupCount, groups, lightingGroups, otherGroups, spaces, subCount, totalProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import { mapHref, projectPhotos } from "@/lib/site-extra";

export const metadata: Metadata = {
  title: `${site.name} · Architectural Lighting · Sharjah, UAE`,
  description:
    "Barq Lumi specifies, supplies and installs architectural lighting and electrical works across the UAE — downlights, linear profiles, LED strip, wall washers and controls. Muweilah, Sharjah. Licensed since 2006.",
  alternates: { canonical: "/" },
};

const featuredIds = [
  "al-recessed-trimless",
  "led-cob-ip20",
  "lum-downlight",
  "lum-track-spot",
  "al-pendant",
  "ww-500-mono-3000",
  "led-rgb",
  "drv-24v-const",
];
const featured = featuredIds.map((id) => catalog.find((c) => c.id === id)!).filter(Boolean);

const homeProjects = [
  "/projects/web/rgb-room-feature.webp",
  "/projects/web/living-cove-floor.webp",
  "/projects/web/kitchen-recessed.webp",
  "/projects/web/facade-linear-residential.webp",
  "/projects/web/gaming-desk-rgb.webp",
  "/projects/web/kitchen-linear.webp",
  "/projects/web/gaming-venue-rgb.webp",
  "/projects/web/rgb-room-zigzag.webp",
  "/projects/web/mirror-rgb-cube.webp",
].map((src) => projectPhotos.find((p) => p.src === src)!);

const stats = [
  { value: String(site.established), label: "Licensed in the UAE since" },
  { value: "Sharjah", label: "Based in Muweilah, serving the UAE" },
  { value: String(subCount), label: "Product categories" },
  { value: String(totalProducts), label: "Products in the catalogue" },
];

const steps = [
  {
    k: "01",
    title: "Specify",
    text: "We read the drawings, walk the site and match fittings, optics and colour temperature to the brief.",
  },
  {
    k: "02",
    title: "Supply",
    text: "Specified materials only — goods checked against the schedule before they leave for site.",
  },
  {
    k: "03",
    title: "Install",
    text: "Our team installs and commissions, from the main supply to the last fitting, then hands over with records.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-ink text-white md:min-h-[100svh] md:max-h-[980px]">
        <Image
          src="/images/stock/hero-living-cove.webp"
          alt="Living room at dusk with warm cove lighting and floor-to-ceiling windows"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="hero-shade absolute inset-0 -z-10" />
        <Container className="pb-16 pt-32 md:pb-24">
          <p className="eyebrow mb-5">Architectural lighting · Sharjah, UAE</p>
          <h1 className="h-display text-[2.15rem] font-extrabold min-[400px]:text-[2.35rem] sm:text-6xl md:text-[5.2rem] md:leading-[0.98]">
            Light That Defines
            <br />
            <span className="text-white/80">Every Space.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Lighting and electrical works — specified, supplied and installed by one team, across the
            UAE since {site.established}.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products/" className="btn btn-gold">
              Explore Products <ArrowIcon />
            </Link>
            <Link href="/contact/" className="btn btn-outline-light">
              Request a Site Visit
            </Link>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section className="border-b border-zinc-200 bg-white">
        <Container className="py-12 md:py-16">
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-zinc-600 md:text-lg">
            Barq Lumi is the lighting brand of {site.tradingName} — one accountable partner from the
            first drawing to the final circuit.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-zinc-200">
            {stats.map((s) => (
              <div key={s.label} className="px-2 text-center md:px-6">
                <dt className="sr-only">{s.label}</dt>
                <dd className="h-display text-3xl text-ink md:text-[2.6rem]">{s.value}</dd>
                <dd className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* LIGHTING BY SPACE */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <SectionTitle
            align="center"
            eyebrow="Applications"
            title="Lighting by Space"
            description="Every room asks for something different. Start with the space — we'll build the scheme around it."
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {spaces.map((s, i) => (
              <Link
                key={s.name}
                href={s.href}
                className={`group relative isolate overflow-hidden rounded-lg bg-ink ${
                  i < 2
                    ? "col-span-2 aspect-[16/10] md:col-span-3 md:aspect-[16/9]"
                    : i === 4
                      ? "col-span-2 aspect-[16/10] md:col-span-2 md:aspect-[4/5]"
                      : "aspect-[4/5] md:col-span-2"
                }`}
              >
                <Image
                  src={s.image}
                  alt={`${s.name} lighting`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="-z-10 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="tile-shade absolute inset-0 -z-10" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <h3 className="h-display text-lg text-white md:text-2xl">{s.name}</h3>
                  <p className="mt-1 text-xs text-white/70 md:text-sm">{s.note}</p>
                </div>
                <span className="absolute right-4 top-4 hidden h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:bg-white group-hover:text-ink md:inline-flex">
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <Container>
          <SectionTitle
            eyebrow="The Collection"
            title={
              <>
                Browse by
                <br />
                Category
              </>
            }
            description={`${totalProducts} products across ${subCount} categories — from recessed profiles to façade wash.`}
            action={
              <Link href="/products/" className="btn btn-outline-dark self-start md:self-auto">
                View All Products <ArrowIcon />
              </Link>
            }
          />
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {lightingGroups.map((g, i) => (
              <Link
                key={g.slug}
                href={`/products/${g.slug}/`}
                className={`group relative isolate overflow-hidden rounded-lg bg-ink ${
                  i === 0
                    ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto"
                    : i === lightingGroups.length - 1 && lightingGroups.length % 3 === 2
                      ? "aspect-[16/10] md:col-span-2 md:aspect-auto"
                      : "aspect-[16/10] md:aspect-[4/3]"
                }`}
              >
                <Image
                  src={groupBanner(g)}
                  alt={`${g.name} lighting`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="-z-10 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="tile-shade absolute inset-0 -z-10" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                  <div>
                    <p className="eyebrow mb-2">{g.eyebrow}</p>
                    <h3 className={`h-display text-white ${i === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>{g.name}</h3>
                    <p className="mt-1.5 text-xs text-white/65">
                      {groupCount(g)} {groupCount(g) === 1 ? "product" : "products"} · {g.subs.length} {g.subs.length === 1 ? "category" : "categories"}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:bg-white group-hover:text-ink">
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {otherGroups.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow eyebrow-muted mb-4">
                Also from our{" "}
                {[
                  otherGroups.some((g) => g.brandGroup === "electrical") && "electrical",
                  otherGroups.some((g) => g.brandGroup === "sanitary") && "sanitary",
                ]
                  .filter(Boolean)
                  .join(" & ")}{" "}
                {otherGroups.length > 1 ? "divisions" : "division"}
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {otherGroups.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/products/${g.slug}/`}
                    className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-lg bg-ink p-4 sm:aspect-[16/7]"
                  >
                    <Image
                      src={groupBanner(g)}
                      alt={g.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="-z-10 object-cover opacity-80 transition duration-700 group-hover:scale-105"
                    />
                    <div className="tile-shade absolute inset-0 -z-10" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-white sm:text-lg">{g.name}</h3>
                      <p className="text-xs text-white/65">
                        {groupCount(g)} {groupCount(g) === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 grid gap-x-8 border-t border-zinc-200 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {groups.flatMap((g) =>
              g.subs.map((s) => (
                <Link
                  key={`${g.slug}-${s.slug}`}
                  href={`/products/${g.slug}/${s.slug}/`}
                  className="group flex items-center justify-between border-b border-zinc-200 py-3 text-sm"
                >
                  <span className="font-medium text-ink group-hover:underline group-hover:underline-offset-2">
                    {s.name}
                  </span>
                  <span className="text-xs tabular-nums text-zinc-400">{s.productIds.length}</span>
                </Link>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <SectionTitle
            align="center"
            eyebrow="Selected Range"
            title="Signature Products"
            description="A cross-section of what we specify most — ask for the full specification on any line."
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {featured.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/products/" className="btn btn-dark">
              See the Full Catalogue <ArrowIcon />
            </Link>
          </div>
        </Container>
      </section>

      {/* PROJECTS */}
      <section className="bg-ink py-20 text-white md:py-28">
        <Container>
          <SectionTitle
            dark
            eyebrow="Our Work"
            title={
              <>
                Recent
                <br />
                Installations
              </>
            }
            description="Photographed on site after handover — completed Barq Lumi installs across the UAE."
            action={
              <Link href="/projects/" className="btn btn-outline-light self-start md:self-auto">
                All Projects <ArrowIcon />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
            {homeProjects.map((p, i) => (
              <Link
                key={p.src}
                href="/projects/"
                className={`group relative isolate aspect-square overflow-hidden rounded-lg bg-ink-3 ${
                  i === 8 ? "hidden md:block" : ""
                }`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="-z-10 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="tile-shade absolute inset-0 -z-10 opacity-90" />
                <p className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold text-white md:p-5 md:text-base">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW WE WORK */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <SectionTitle
            eyebrow="How We Work"
            title={
              <>
                One Team,
                <br />
                Start to Handover
              </>
            }
            action={
              <Link href="/services/" className="btn btn-outline-dark self-start md:self-auto">
                Our Services <ArrowIcon />
              </Link>
            }
          />
          <div className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.k} className="bg-white p-7 md:p-10">
                <p className="font-display text-sm font-semibold text-gold">{s.k}</p>
                <h3 className="h-display mt-5 text-2xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* VISIT */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <Container>
          <div className="grid overflow-hidden rounded-xl bg-ink text-white lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-[480px]">
              <Image
                src="/projects/web/facade-linear-residential.webp"
                alt="Residential façade with linear lighting at dusk — a completed Barq Lumi install"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
              <p className="eyebrow mb-4">Visit Us</p>
              <h2 className="h-display text-[2rem] md:text-[2.6rem]">
                Muweilah,
                <br />
                Sharjah
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                Bring your drawings or a brief and talk it through with the team. Call or WhatsApp
                ahead so the right person is there.
              </p>
              <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/45">Address</dt>
                  <dd className="mt-1.5 text-white/90">
                    Muweilah, Sharjah, UAE
                    <br />
                    P.O. Box {site.address.postalCode}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/45">Contact</dt>
                  <dd className="mt-1.5 space-y-1 text-white/90">
                    <a href={site.tel.href} className="block hover:text-white">Tel {site.tel.display}</a>
                    <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
                      WhatsApp {site.whatsapp.display}
                    </a>
                    <a href={site.email.href} className="block hover:text-white">{site.email.display}</a>
                  </dd>
                </div>
              </dl>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                  Open in Google Maps <ArrowIcon />
                </a>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="flex flex-col items-start gap-6 border-y border-zinc-200 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow mb-3">Start a Project</p>
              <h2 className="h-display text-2xl text-ink md:text-[2.2rem]">Planning a lighting scheme?</h2>
              <p className="mt-2 text-zinc-500">
                Send drawings or a short brief — we&apos;ll reply with a specification and a quote.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                <WhatsAppIcon /> WhatsApp Us
              </a>
              <Link href="/contact/" className="btn btn-outline-dark">
                Contact
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
