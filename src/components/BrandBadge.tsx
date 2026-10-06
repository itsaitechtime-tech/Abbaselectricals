import { brandOf, type Brand } from "@/lib/products";

const styles: Record<string, string> = {
  FSL: "bg-[#d71920] text-white",
  Enlight: "bg-gold text-ink",
  "Barq Lumi": "bg-ink text-white",
  Philips: "bg-[#0b5ed7] text-white",
};

/** Small brand pill for FSL / Enlight items. Barq Lumi's own range shows no badge unless `showOwn`. */
export function BrandBadge({
  item,
  className = "",
  showOwn = false,
}: {
  item: { brand?: Brand };
  className?: string;
  showOwn?: boolean;
}) {
  const b = brandOf(item);
  if (b === "Barq Lumi" && !showOwn) return null;
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[0.58rem] font-bold uppercase leading-none tracking-[0.12em] shadow-sm ${styles[b] ?? "bg-ink text-white"} ${className}`}
    >
      {b}
    </span>
  );
}
