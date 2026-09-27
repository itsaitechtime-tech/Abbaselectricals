import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1320px] px-5 md:px-8 ${className}`}>{children}</div>;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  action?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div
      className={`mb-10 flex flex-col gap-6 md:mb-14 ${
        center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2
          className={`h-display text-[2rem] sm:text-[2.4rem] md:text-[2.9rem] ${dark ? "text-white" : "text-ink"}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-base leading-relaxed ${dark ? "text-white/60" : "text-zinc-500"}`}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items, dark = true }: { items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className={dark ? "text-white/30" : "text-zinc-300"}>/</span>}
            {c.href ? (
              <Link href={c.href} className={dark ? "text-white/55 hover:text-white" : "text-zinc-500 hover:text-ink"}>
                {c.label}
              </Link>
            ) : (
              <span className={dark ? "text-white" : "text-ink"}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Dark photo banner used at the top of inner pages. */
export function PageBanner({
  image,
  alt,
  eyebrow,
  title,
  description,
  crumbs,
  meta,
  size = "md",
  children,
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  meta?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}) {
  const h =
    size === "lg"
      ? "min-h-[560px] md:min-h-[640px]"
      : size === "md"
        ? "min-h-[440px] md:min-h-[520px]"
        : "min-h-[340px] md:min-h-[380px]";
  return (
    <section className={`relative isolate flex ${h} items-end overflow-hidden bg-ink text-white`}>
      <Image src={image} alt={alt} fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="hero-shade absolute inset-0 -z-10" />
      <Container className="pb-10 pt-28 md:pb-14">
        {crumbs && (
          <div className="mb-8">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="h-display max-w-4xl text-[2.4rem] sm:text-5xl md:text-[3.6rem]">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{description}</p>
        )}
        {meta && <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{meta}</div>}
        {children}
      </Container>
    </section>
  );
}
