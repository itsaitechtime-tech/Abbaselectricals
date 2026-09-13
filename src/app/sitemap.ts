import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/products/", "/services/", "/projects/", "/about/", "/contact/"];
  const lastModified = new Date("2026-09-13");

  return routes.map((route) => ({
    url: `${site.url}${route === "" ? "/" : route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/products/" ? 0.9 : 0.8,
  }));
}
