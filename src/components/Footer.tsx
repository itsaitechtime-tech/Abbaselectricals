import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-[#0d0d0d]">
      <div className="gold-bar" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="wordmark text-xl text-cream md:text-2xl">{site.name}</p>
          <p className="mt-1 text-[0.62rem] tracking-[0.28em] uppercase text-accent/85">
            Lighting
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper-muted">
            Barq Lumi specifies, supplies and installs lighting and electrical packages from
            Muweilah, Sharjah — serving buildings across the UAE since {site.established}.
          </p>
          <p className="mt-3 text-xs text-paper-muted/70">
            Trading / domain: {site.tradingName} · www.abbaselectricals.com
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp !py-2 text-xs">
              WhatsApp
            </a>
            <a
              href={site.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !py-2 text-xs"
            >
              {site.instagram.display}
            </a>
            <a href={site.tel.href} className="btn btn-ghost !py-2 text-xs">
              {site.tel.display}
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="space-y-2 text-sm text-paper-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-paper-muted">
            <li>
              <a href={site.tel.href} className="hover:text-paper">
                Tel {site.tel.display}
              </a>
            </li>
            <li>
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                WhatsApp {site.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={site.email.href} className="hover:text-paper">
                {site.email.display}
              </a>
            </li>
            <li>
              <a href={site.instagram.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                Instagram {site.instagram.display}
              </a>
            </li>
            <li className="pt-2 text-paper-muted/90">{site.address.display}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs leading-relaxed text-paper-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            {site.legalName}
            <span className="mx-2 text-line-strong">·</span>
            VAT TRN {site.vatTrn}
          </p>
          <p>
            {site.address.display}
            <span className="mx-2 text-line-strong">·</span>
            www.abbaselectricals.com
          </p>
        </div>
      </div>
    </footer>
  );
}
