"use client";

import { useId, useState, type ReactNode } from "react";
import type { Brand, Voltage } from "@/lib/products";

const VORDER: Voltage[] = ["220V", "48V", "24V", "12V"];
const VLABEL: Record<Voltage, string> = { "220V": "220V AC", "48V": "48V DC", "24V": "24V DC", "12V": "12V DC" };

/**
 * Brand chips (All / FSL / Enlight / other brands / Barq Lumi) and, on strip listings, Voltage chips
 * (All / 220V / 24V / 12V) over a server-rendered grid. Cards carry data-brand and data-voltage;
 * a scoped style rule hides the non-matching ones (both filters combine).
 * `counts` must be passed in display order (see brandsIn()).
 */
export function BrandFilter({
  counts,
  voltageCounts,
  total: totalItems,
  keys,
  children,
}: {
  counts: Record<Brand, number>;
  /** Pass only on strip listings; omit to hide the Voltage row. */
  voltageCounts?: Partial<Record<Voltage, number>>;
  total?: number;
  /** Brand/voltage of each card, used to show a note when a chip combination matches nothing. */
  keys?: { b: Brand; v?: Voltage }[];
  children: ReactNode;
}) {
  const scope = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [active, setActive] = useState<"All" | Brand>("All");
  const [volt, setVolt] = useState<"All" | Voltage>("All");
  const present = Object.keys(counts).filter((b) => counts[b] > 0);
  const total = totalItems ?? present.reduce((n, b) => n + counts[b], 0);
  const vPresent = voltageCounts ? VORDER.filter((v) => (voltageCounts[v] ?? 0) > 0) : [];
  const chip = (on: boolean, label: string, n: number, onClick: () => void, title?: string) => (
    <button
      key={label}
      type="button"
      aria-pressed={on}
      title={title}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition ${
        on ? "border-ink bg-ink text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
      }`}
    >
      {label} <span className="opacity-60">{n}</span>
    </button>
  );
  const row = "no-scrollbar -mx-5 flex items-center gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0";
  const rowLabel = "mr-1 w-16 shrink-0 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-500";
  const showBrand = present.length > 1;
  const showVolt = vPresent.length > 0;
  const sel = `[data-filter-scope="${scope}"] [data-brand]`;
  const rules = [
    active !== "All" ? `${sel}:not([data-brand=${JSON.stringify(active)}]){display:none}` : "",
    volt !== "All" ? `${sel}:not([data-voltage="${volt}"]){display:none}` : "",
  ].join("");
  return (
    <div data-filter-scope={scope} data-brand-filter={active} data-volt-filter={volt}>
      {rules && <style>{rules}</style>}
      {(showBrand || showVolt) && (
        <div className="mb-6 space-y-3">
          {showBrand && (
            <div className={row} role="group" aria-label="Filter by brand">
              <span className={rowLabel}>Brand</span>
              {chip(active === "All", "All", total, () => setActive("All"))}
              {present.map((b) => chip(active === b, b, counts[b], () => setActive(b)))}
            </div>
          )}
          {showVolt && (
            <div className={row} role="group" aria-label="Filter by voltage">
              <span className={rowLabel}>Voltage</span>
              {chip(volt === "All", "All", total, () => setVolt("All"))}
              {vPresent.map((v) => chip(volt === v, v, voltageCounts?.[v] ?? 0, () => setVolt(v), VLABEL[v]))}
            </div>
          )}
        </div>
      )}
      {children}
      {keys && !keys.some((k) => (active === "All" || k.b === active) && (volt === "All" || k.v === volt)) && (
        <p className="py-10 text-center text-sm text-zinc-500">No products match this brand and voltage combination.</p>
      )}
    </div>
  );
}
