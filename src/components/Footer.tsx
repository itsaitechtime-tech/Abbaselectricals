import Link from "next/link";
import { Wordmark } from "@/components/Header";
import { groups } from "@/lib/catalog";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              Architectural lighting and electrical works — specified, supplied and installed
              from Muweilah, Sharjah for projects across the UAE.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Licensed in the UAE since {site.established}
            </p>
          </div>

          <div>
            <p className="eyebrow eyebrow-muted mb-5 !text-white/45">Products</p>
            <ul className="space-y-3 text-sm text-white/75">
              {groups.map((g) => (
                <li key={g.slug}>
                  <Link href={`/products/${g.slug}/`} className="hover:text-white">
                    {g.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products/" className="hover:text-white">
                  All products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-muted mb-5 !text-white/45">Company</p>
            <ul className="space-y-3 text-sm text-white/75">
              {nav
                .filter((n) => n.href !== "/")
                .map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="hover:text-white">
                      {n.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-muted mb-5 !text-white/45">Contact</p>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a href={site.tel.href} className="hover:text-white">
                  Tel {site.tel.display}
                </a>
              </li>
              <li>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a href={site.email.href} className="hover:text-white">
                  {site.email.display}
                </a>
              </li>
              <li>
                <a href={site.instagram.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram {site.instagram.display}
                </a>
              </li>
              <li className="pt-1 text-white/55">
                Muweilah, Sharjah, UAE
                <br />
                P.O. Box {site.address.postalCode}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            {site.legalName}
            <span className="mx-2 text-white/20">|</span>VAT TRN {site.vatTrn}
          </p>
          <p>
            © {new Date().getFullYear()} {site.name} · {site.tradingName} · Licensed in the UAE since{" "}
            {site.established}
          </p>
        </div>
      </div>
    </footer>
  );
}
