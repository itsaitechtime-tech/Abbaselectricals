"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  productCategories,
  products,
  type ProductCategory,
} from "@/lib/products";

type Filter = "All" | ProductCategory;

export function ProductCatalog() {
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = useMemo(() => ["All", ...productCategories], []);

  const visible = useMemo(() => {
    if (filter === "All") return products;
    return products.filter((p) => p.category === filter);
  }, [filter]);

  const sections = useMemo(() => {
    if (filter !== "All") return null;
    return productCategories
      .map((cat) => ({
        category: cat,
        items: products.filter((p) => p.category === cat),
      }))
      .filter((s) => s.items.length > 0);
  }, [filter]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            data-active={filter === f}
            className="filter-chip"
            onClick={() => setFilter(f)}
          >
            {f}
            {f !== "All" && (
              <span className="ml-1.5 opacity-60">
                {products.filter((p) => p.category === f).length}
              </span>
            )}
            {f === "All" && <span className="ml-1.5 opacity-60">{products.length}</span>}
          </button>
        ))}
      </div>

      {filter !== "All" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {sections?.map((section) => (
            <div key={section.category} id={section.category.replace(/\s+/g, "-").toLowerCase()}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2">{section.items.length} items</p>
                  <h2 className="display text-2xl text-cream md:text-3xl">{section.category}</h2>
                  <span className="gold-rule" aria-hidden />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
