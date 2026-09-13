import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Completed Barq Lumi lighting installs across the UAE — RGB rooms, interiors, kitchens and façades — plus earlier anonymised work by type and location.",
  alternates: { canonical: "/projects/" },
  openGraph: {
    title: `Projects · ${site.name}`,
    description:
      "Completed Barq Lumi install photos, with older anonymised cards by type and location.",
    url: `${site.url}/projects/`,
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Section className="!pb-8">
        <p className="eyebrow mb-3">Projects</p>
        <h1 className="display max-w-3xl text-4xl text-cream md:text-5xl">
          Work that has to hold up after dark
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
          Photographs on this page are completed Barq Lumi installs. Older cards without
          photos stay anonymised by type and location.
        </p>
      </Section>

      <Section className="!pt-4">
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={`${project.title}-${project.location}`} {...project} />
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="panel flex flex-col gap-6 rounded-2xl p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="eyebrow mb-2">Next project</p>
            <h2 className="display text-2xl text-cream md:text-3xl">
              Request a site visit
            </h2>
            <p className="mt-3 max-w-lg text-sm text-paper-muted">
              Share drawings, a location, or a brief. We respond on WhatsApp, telephone, or email.
            </p>
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
              Contact
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
