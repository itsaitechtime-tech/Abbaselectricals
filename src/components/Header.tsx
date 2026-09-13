"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname === href.replace(/\/$/, "") || pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[rgba(10,10,10,0.94)] backdrop-blur-md">
      <div className="gold-bar" aria-hidden />
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8 md:py-4">
          <Link
            href="/"
            className="group flex flex-col"
            onClick={() => setOpen(false)}
          >
            <span className="wordmark text-[1.15rem] text-cream md:text-[1.35rem]">
              {site.name}
            </span>
            <span className="mt-0.5 text-[0.58rem] tracking-[0.28em] uppercase text-accent/85">
              Lighting
            </span>
          </Link>

          <nav className="hidden items-center gap-5 xl:gap-6 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = pathMatches(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={`nav-link ${
                    active ? "text-accent-bright" : "text-paper-muted hover:text-cream"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={site.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.12em] text-accent hover:text-accent-bright"
            >
              {site.instagram.display}
            </a>
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp !px-4 !py-2 text-xs tracking-wide"
            >
              WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <a
              href={site.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[0.7rem] tracking-[0.1em] text-accent sm:inline"
            >
              {site.instagram.display}
            </a>
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp !px-3 !py-2 text-xs"
            >
              WhatsApp
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,175,106,0.35)] text-cream"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden className="flex flex-col gap-1.5">
                <span
                  className={`block h-px w-4 bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
                />
                <span className={`block h-px w-4 bg-current transition ${open ? "opacity-0" : ""}`} />
                <span
                  className={`block h-px w-4 bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-b border-line bg-charcoal-elevated lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-4" aria-label="Mobile">
            {nav.map((item) => {
              const active = pathMatches(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-line py-3.5 text-sm tracking-[0.08em] uppercase ${
                    active ? "text-accent-bright" : "text-paper-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={site.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-line py-3.5 text-sm tracking-[0.08em] text-accent"
            >
              Instagram {site.instagram.display}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
