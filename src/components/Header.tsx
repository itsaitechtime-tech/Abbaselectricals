"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/Icons";
import { nav, site } from "@/lib/site";

const FACADE = "/products/facade-architectural";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/products/" && pathname.startsWith(FACADE)) return false;
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display font-extrabold uppercase tracking-[-0.02em] text-white ${
          small ? "text-lg" : "text-[1.35rem] md:text-[1.5rem]"
        }`}
      >
        Barq<span className="text-gold">·</span>Lumi
      </span>
      <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-white/55">
        Lighting · Since {site.established}
      </span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-white/10 bg-[rgba(13,13,13,0.92)] backdrop-blur-md"
          : "border-b border-white/10 bg-gradient-to-b from-black/75 via-black/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 px-5 md:h-[4.5rem] md:px-8">
        <Link href="/" aria-label={`${site.name} home`}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition ${
                  active ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                <span className={active ? "border-b border-gold pb-1" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-light hidden sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/25 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="flex flex-col gap-[5px]">
              <span className={`block h-px w-5 bg-current transition ${open ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-current transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-white/10 bg-ink lg:hidden">
          <nav className="mx-auto flex max-w-[1320px] flex-col px-5 pb-6 pt-2" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-white/10 py-4 font-display text-lg font-semibold tracking-tight ${
                  isActive(pathname, item.href) ? "text-white" : "text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light mt-6"
            >
              <WhatsAppIcon /> WhatsApp {site.whatsapp.display}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
