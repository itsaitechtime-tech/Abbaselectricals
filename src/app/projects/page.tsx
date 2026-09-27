import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/Icons";
import { Container, PageBanner, SectionTitle } from "@/components/Section";
import { projects, site } from "@/lib/site";
import { projectPhotos } from "@/lib/site-extra";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Completed Barq Lumi lighting installs across the UAE — RGB entertainment rooms, living-room coves, kitchens and residential façades.",
  alternates: { canonical: "/projects/" },
};

const photoProjects = projects.filter((p) => p.image);
const earlier = projects.filter((p) => !p.image);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        image="/projects/web/living-cove-floor.webp"
        alt="Living room with colour-changing cove and floor LED line — a completed Barq Lumi install"
        crumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]}
        eyebrow="Our Work"
        title={
          <>
            Signature
            <br />
            Installations
          </>
        }
        description="Every photograph on this page is a completed Barq Lumi install, shot on site."
        meta={`${photoProjects.length} projects · ${projectPhotos.length} photographs`}
        size="md"
      />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <SectionTitle
            eyebrow="Completed Installs"
            title="Recent Projects"
            description="Residential interiors, entertainment rooms and façades — lit, commissioned and handed over."
          />
          <div className="grid grid-flow-dense grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
            {projectPhotos.map((p, i) => (
              <figure
                key={p.src}
                className={`group relative isolate overflow-hidden rounded-lg bg-zinc-100 ${
                  i === 0
                    ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto"
                    : i === 3 || i === 8
                      ? "col-span-2 aspect-[2/1]"
                      : i === 9
                        ? "col-span-2 aspect-[4/3] md:col-span-1 md:aspect-square"
                        : "aspect-square"
                }`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  className="-z-10 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="tile-shade absolute inset-0 -z-10" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-5">
                  <p className="text-xs font-semibold text-white md:text-base">{p.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-zinc-50 py-16 md:py-24">
        <Container>
          <SectionTitle eyebrow="Project Notes" title="What We Delivered" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photoProjects.map((p) => (
              <article key={p.title} className="rounded-lg border border-zinc-200 bg-white p-6">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">{p.location}</p>
                <h3 className="h-display mt-2 text-xl text-ink">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{capitalize(p.description.replace(/^Completed Barq Lumi install — /, ""))}</p>
              </article>
            ))}
          </div>

          {earlier.length > 0 && (
            <div className="mt-16">
              <p className="eyebrow eyebrow-muted mb-5">Earlier Work · by type and location</p>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {earlier.map((p) => (
                  <li key={p.title + p.location} className="border-b border-zinc-200 py-4">
                    <p className="font-semibold text-ink">{p.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{p.location}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-ink py-16 text-white md:py-20">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow mb-3">Your Project Next</p>
            <h2 className="h-display text-2xl md:text-[2.2rem]">Have a space that needs light?</h2>
            <p className="mt-2 text-white/60">Share a location, drawings or a brief — we&apos;ll arrange a site visit.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              <WhatsAppIcon /> WhatsApp
            </a>
            <Link href="/contact/" className="btn btn-outline-light">Contact</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
