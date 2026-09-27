import type { MetadataRoute } from "next";
import { catalog, groups } from "@/lib/catalog";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-27");
  const base = ["/", "/products/", "/services/", "/projects/", "/about/", "/contact/"];
  const groupRoutes = groups.map((g) => `/products/${g.slug}/`);
  const subRoutes = groups.flatMap((g) => g.subs.map((s) => `/products/${g.slug}/${s.slug}/`));
  const itemRoutes = catalog.map((c) => c.href);
  return [...base, ...groupRoutes, ...subRoutes, ...itemRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").length <= 3 ? 0.8 : 0.6,
  }));
}
