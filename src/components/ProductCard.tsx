import Image from "next/image";
import type { Product, ProductTone } from "@/lib/products";

const toneClass: Record<ProductTone, string> = {
  cool: "atmosphere-cool",
  warm: "atmosphere-warm",
  amber: "atmosphere-amber",
  blue: "atmosphere-blue",
  green: "atmosphere-green",
  soft: "atmosphere-soft",
  silver: "atmosphere-silver",
  violet: "atmosphere-violet",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card group flex flex-col overflow-hidden rounded-2xl">
      <div
        className={`atmosphere ${toneClass[product.tone]} relative h-44 overflow-hidden md:h-48`}
      >
        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={`${product.name} — catalog plate illustrating product type`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.88)] via-[rgba(10,10,10,0.25)] to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-30 grid-fade" />
        )}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="eyebrow text-[0.62rem] text-accent/90">{product.category}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 md:px-5 md:py-5">
        <h3 className="display text-lg leading-snug text-cream md:text-xl">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-paper-muted">{product.use}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.specs.map((spec) => (
            <span key={spec} className="spec-chip">
              {spec}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
