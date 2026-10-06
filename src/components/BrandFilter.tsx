"use client";

import { useState, type ReactNode } from "react";
import type { Brand } from "@/lib/products";

const ORDER: Brand[] = ["FSL", "Enlight", "Barq Lumi"];

/**
 * Brand chips (All / FSL / Enlight / Barq Lumi) over a server-rendered grid.
 * Cards carry data-brand; CSS in globals.css hides the non-matching ones.
 */
export function BrandFilter({
  counts,
  children,
}: {
  counts: Partial<Record<Brand, number>>;
  children: ReactNode;
}) {
  const [active, setActive] = useState<"All" | Brand>("All");
  const total = ORDER.reduce((n, b) => n + (counts[b] ?? 0), 0);
  const present = ORDER.filter((b) => (counts[b] ?? 0) > 0);
  const chip = (key: "All" | Brand, label: string, n: number) => {
    const on = active === key;
    const disabled = n === 0;
    return (
      <button
        key={key}
        type="button"
        disabled={disabled}
        aria-pressed={on}
        onClick={() => setActive(key)}
        className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition ${
          on
            ? "border-ink bg-ink text-white"
            : disabled
              ? "cursor-not-allowed border-zinc-100 text-zinc-300"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
        }`}
      >
        {label} <span className="opacity-60">{n}</span>
      </button>
    );
  };
  return (
    <div data-brand-filter={active}>
      {present.length > 1 && (
        <div
          className="no-scrollbar -mx-5 mb-6 flex items-center gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0"
          role="group"
          aria-label="Filter by brand"
        >
          <span className="mr-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">Brand</span>
          {chip("All", "All", total)}
          {present.map((b) => chip(b, b, counts[b] ?? 0))}
        </div>
      )}
      {children}
    </div>
  );
}
