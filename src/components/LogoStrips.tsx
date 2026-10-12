/* eslint-disable @next/next/no-img-element */
import { brandLogos, clientLogos, selectedClients, stripBrands, type Logo } from "@/lib/site";

function Tile({ name, logo }: { name: string; logo?: Logo }) {
  if (!logo)
    return (
      <li className="flex h-16 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold tracking-wide text-white/80">
        {name}
      </li>
    );
  return (
    <li
      className={`flex h-16 items-center justify-center rounded-lg px-4 ${logo.white ? "border border-white/15" : "bg-white"}`}
      title={name}
    >
      <img src={logo.src} alt={`${name} logo`} width={logo.width} height={logo.height} loading="lazy" className="max-h-9 w-auto max-w-full object-contain" />
    </li>
  );
}

export default function LogoStrips() {
  return (
    <section className="bg-ink py-16 text-white md:py-20" aria-label="Clients and brands">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="eyebrow mb-2">Organisations We Have Supplied</p>
        <p className="mb-6 text-sm text-white/60">From the company profile — listed for reference, not endorsements.</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {selectedClients.map((c) => <Tile key={c} name={c} logo={clientLogos[c]} />)}
        </ul>
        <p className="eyebrow mb-2 mt-14">Brands We Supply</p>
        <p className="mb-6 text-sm text-white/60">Product lines we specify, supply and install — not claimed partnerships or dealerships.</p>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {stripBrands.map((b) => <Tile key={b} name={b} logo={brandLogos[b]} />)}
        </ul>
      </div>
    </section>
  );
}
