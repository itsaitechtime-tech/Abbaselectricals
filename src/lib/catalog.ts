import { brandProducts } from "@/lib/brand-products";
import { facadeProducts } from "@/lib/facade-products";
import { brandOf, brands, products, voltageOf, voltages, type Brand, type Product } from "@/lib/products";
import { site } from "@/lib/site";

/**
 * Catalogue structure — top-level groups and sub-categories.
 * Every product in products.ts is mapped to exactly one sub-category below.
 */

export type IconKey =
  | "downlight"
  | "track"
  | "linear"
  | "strip"
  | "pendant"
  | "emergency"
  | "washer"
  | "inground"
  | "bollard"
  | "rgb"
  | "neon"
  | "driver"
  | "control"
  | "accessory"
  | "breaker";

export type SubCategory = {
  slug: string;
  name: string;
  blurb: string;
  icon: IconKey;
  /** tile / banner image */
  image?: string;
  /** optional banner override for the sub-category page (falls back to image, then group banner) */
  banner?: string;
  productIds: string[];
};

export type Group = {
  slug: string;
  name: string;
  eyebrow: string;
  blurb: string;
  banner: string;
  subs: SubCategory[];
};

const S = "/images/stock";
const FA = "/products/catalog-facade";

export const groups: Group[] = [
  {
    slug: "indoor",
    name: "Indoor",
    eyebrow: "Interior lighting",
    blurb: "Downlights, track, linear profiles and LED strip for villas, offices and retail interiors.",
    banner: `${S}/cat-luminaires.webp`,
    subs: [
      {
        slug: "downlights",
        name: "Downlights",
        blurb: "Recessed and surface downlights for clean, glare-controlled ceilings.",
        icon: "downlight",
        image: `${S}/p-downlight-surface.webp`,
        productIds: ["lum-downlight"],
      },
      {
        slug: "panels-ceiling",
        name: "Panels & Ceiling Lights",
        blurb: "Grid panels, slim round and square panels and surface ceiling lights.",
        icon: "downlight",
        image: `${S}/p-downlight-round.webp`,
        banner: `${S}/space-offices.webp`,
        productIds: [],
      },
      {
        slug: "track-lights",
        name: "Track Lights & Spots",
        blurb: "Adjustable accent on track for retail, galleries and feature walls.",
        icon: "track",
        image: `${S}/p-track-brass.webp`,
        productIds: ["lum-track-spot"],
      },
      {
        slug: "lamps-bulbs",
        name: "LED Lamps & Bulbs",
        blurb: "GLS bulbs, candles, filament, GU10 / MR16, PAR and reflector lamps.",
        icon: "downlight",
        image: `${S}/space-retail.webp`,
        banner: `${S}/space-retail.webp`,
        productIds: [],
      },
      {
        slug: "linear-profiles",
        name: "Linear & Profiles",
        blurb: "AL6063-T5 aluminium profiles — recessed, surface, corner and custom finish.",
        icon: "linear",
        image: `${S}/p-linear-wall.webp`,
        productIds: [
          "al-recessed-trimless",
          "al-recessed-flanged",
          "al-slim-surface-u",
          "al-wide-surface",
          "al-corner-cove",
          "al-external-angle",
          "al-bendable",
          "al-mini-furniture",
          "al-stair-handrail",
          "al-matte-black",
          "al-custom-ral",
          "al-surface-deep",
        ],
      },
      {
        slug: "tubes-battens",
        name: "Tubes & Battens",
        blurb: "T8 and T5 LED tubes, integrated battens and tube fixtures.",
        icon: "linear",
        image: `${S}/p-linear-ceiling.webp`,
        banner: `${S}/space-offices.webp`,
        productIds: [],
      },
      {
        slug: "led-strips",
        name: "LED Strips",
        blurb: "12V, 24V and 220V AC LED tape — COB and SMD in warm, neutral, tunable white and single colours.",
        icon: "strip",
        image: `${S}/p-strip-smd.webp`,
        productIds: [
          "led-cob-ip20",
          "led-smd-2700",
          "led-smd-3000",
          "led-smd-4000",
          "led-tunable-cct",
          "led-12v-short",
          "led-narrow-cob",
          "led-high-output",
          "led-cob-3000-cri",
        ],
      },
      {
        slug: "pendants",
        name: "Pendants & Suspended",
        blurb: "Suspended linear runs for offices, lobbies and retail.",
        icon: "pendant",
        image: `${S}/p-pendant-linear.webp`,
        productIds: ["al-pendant"],
      },
      {
        slug: "emergency",
        name: "Emergency & Exit",
        blurb: "Exit signage and emergency luminaires for towers and public buildings.",
        icon: "emergency",
        image: `${S}/p-emergency-exit.webp`,
        productIds: ["lum-emergency-exit"],
      },
    ],
  },
  {
    slug: "outdoor",
    name: "Outdoor",
    eyebrow: "Façade & landscape",
    blurb: "Wall washers, in-ground, outdoor linear and garden lighting rated for UAE conditions.",
    banner: `${S}/p-washer-arches.webp`,
    subs: [
      {
        slug: "wall-washers",
        name: "Wall Washers",
        blurb: "Linear and asymmetric wash for façades, columns and textured stone.",
        icon: "washer",
        image: `${S}/p-washer-facade.webp`,
        productIds: [
          "ww-500-mono-3000",
          "ww-1000-mono-4000",
          "ww-asymmetric-graze",
          "ww-narrow-15",
          "ww-30-wash",
          "ww-60-flood",
          "ww-flexible",
          "ww-high-power",
          "ww-compact-column",
          "ww-0-10v-mono",
        ],
      },
      {
        slug: "floodlights",
        name: "Floodlights & High Bay",
        blurb: "IP-rated floodlights for façades, yards and sports, plus industrial high bays.",
        icon: "washer",
        image: "/products/brands/enlight/enl-tm-p08-flood.webp",
        banner: `${S}/p-washer-facade.webp`,
        productIds: [],
      },
      {
        slug: "in-ground-underwater",
        name: "In-ground & Underwater",
        blurb: "Walkable, recessed and water-edge fittings sealed to IP67–IP68.",
        icon: "inground",
        image: `${S}/space-outdoor.webp`,
        productIds: ["al-inground", "ww-ground-recessed", "ww-fountain-ip68", "led-cob-ip68"],
      },
      {
        slug: "outdoor-linear",
        name: "Outdoor Linear & Strips",
        blurb: "Sealed profiles and IP67 tape for soffits, façades and long runs.",
        icon: "linear",
        image: `${S}/p-outdoor-linear.webp`,
        productIds: ["al-hermetic", "led-cob-ip67", "led-48v-facade"],
      },
      {
        slug: "bollards-garden",
        name: "Bollards & Garden",
        blurb: "Poles and bollards for gardens, compounds and promenades.",
        icon: "bollard",
        image: `${S}/p-bollard.webp`,
        productIds: ["lum-garden-pole"],
      },
    ],
  },
  {
    slug: "facade-architectural",
    name: "Façade & Architectural",
    eyebrow: "Façade lighting",
    blurb: "24V DC linear façade lights in single colour, RGB and RGBW with DMX — for building outlines, bridges and landmarks.",
    banner: `${FA}/banner-cityscape.webp`,
    subs: [
      {
        slug: "linear-facade",
        name: "Linear Façade Lights",
        blurb: "IP66 aluminium linear lights with PC or acrylic covers for continuous outline lighting.",
        icon: "linear",
        image: `${FA}/banner-towers.webp`,
        banner: `${FA}/banner-cityscape.webp`,
        productIds: [],
      },
      {
        slug: "lensed-linear",
        name: "Lensed Linear Lights",
        blurb: "Lensed IP66 linear lights with an aluminium face cover — crisp dotted lines for façade detailing.",
        icon: "linear",
        image: `${FA}/banner-plaza.webp`,
        banner: `${FA}/banner-cityscape.webp`,
        productIds: [],
      },
    ],
  },
  {
    slug: "decorative",
    name: "Decorative",
    eyebrow: "Colour & effect",
    blurb: "RGB, pixel and neon-flex for entertainment rooms, signage and feature façades.",
    banner: `${S}/banner-decorative.webp`,
    subs: [
      {
        slug: "rgb-strips",
        name: "RGB & Pixel Strips",
        blurb: "RGB, RGBW, RGB+CCT and addressable tape for scenes and effects.",
        icon: "rgb",
        image: `${S}/p-rgb-pixel.webp`,
        productIds: ["led-rgb", "led-rgbw", "led-rgb-cct", "led-rgbic"],
      },
      {
        slug: "neon-flex",
        name: "Neon Flex",
        blurb: "Silicone neon-flex for curves, signage and graphic lines.",
        icon: "neon",
        image: `${S}/p-neon-flex.webp`,
        productIds: ["led-neon-flex"],
      },
      {
        slug: "colour-facade",
        name: "RGB & Pixel Façade",
        blurb: "DMX colour washers and pixel bars for media and feature façades.",
        icon: "washer",
        image: `${S}/cat-wall-washers.webp`,
        productIds: ["ww-1000-rgbw-dmx", "ww-rgb-dmx-ip65", "ww-pixel"],
      },
    ],
  },
  {
    slug: "smart-controls",
    name: "Smart & Controls",
    eyebrow: "Power & control",
    blurb: "Drivers, DMX control and the accessories that make a lighting system work.",
    banner: `${S}/cat-drivers-control.webp`,
    subs: [
      {
        slug: "drivers-power",
        name: "Drivers & Power Supplies",
        blurb: "12V, 24V and 48V constant-voltage supplies sized per project.",
        icon: "driver",
        image: `${S}/p-driver-psu.webp`,
        productIds: ["drv-24v-const", "drv-12v-compact", "drv-48v-facade"],
      },
      {
        slug: "dmx-control",
        name: "DMX & Controls",
        blurb: "DMX512 decoding for RGB, RGBW and linear wash control.",
        icon: "control",
        productIds: ["drv-dmx-decoder"],
      },
      {
        slug: "accessories",
        name: "Accessories & Connectors",
        blurb: "Diffusers, end caps, brackets and IP-rated connectors.",
        icon: "accessory",
        image: `${S}/p-connectors.webp`,
        productIds: ["acc-opal-diffuser", "acc-endcaps-brackets", "acc-connectors"],
      },
    ],
  },
  {
    slug: "electrical-sanitary",
    name: "Electrical & Sanitary",
    eyebrow: "Electrical package",
    blurb: "Distribution and switchgear coordinated with the lighting package. Sanitary ware on request.",
    banner: `${S}/cat-electrical-package.webp`,
    subs: [
      {
        slug: "distribution",
        name: "Distribution & Switchgear",
        blurb: "Sub-main distribution boards and isolators, main supply to DB.",
        icon: "breaker",
        productIds: ["elec-smdb"],
      },
    ],
  },
];

// Attach FSL / Enlight products to their sub-categories (after Barq Lumi's own lines).
{
  const subsBySlug = new Map(groups.flatMap((g) => g.subs.map((sub) => [sub.slug, sub] as const)));
  for (const bp of [...facadeProducts, ...brandProducts]) {
    const sub = subsBySlug.get(bp.sub);
    if (!sub) throw new Error(`catalog: unknown sub-category ${bp.sub} for ${bp.id}`);
    sub.productIds.push(bp.id);
  }
}

/** Representative photo per product (real stock photography, see CREDITS.md). */
const productImages: Record<string, string> = {
  "lum-downlight": `${S}/p-downlight-surface.webp`,
  "lum-track-spot": `${S}/p-track-brass.webp`,
  "al-recessed-trimless": `${S}/p-linear-ceiling.webp`,
  "al-recessed-flanged": `${S}/p-linear-wall.webp`,
  "al-slim-surface-u": `${S}/p-linear-surface.webp`,
  "al-wide-surface": `${S}/p-linear-surface.webp`,
  "al-corner-cove": `${S}/p-linear-wall.webp`,
  "al-external-angle": `${S}/p-linear-vertical.webp`,
  "al-bendable": `${S}/p-strip-coil.webp`,
  "al-mini-furniture": `${S}/p-linear-vertical.webp`,
  "al-stair-handrail": `${S}/p-strip-stair.webp`,
  "al-matte-black": `${S}/p-linear-wall.webp`,
  "al-custom-ral": `${S}/p-linear-ceiling.webp`,
  "al-surface-deep": `${S}/p-linear-surface.webp`,
  "led-cob-ip20": `${S}/p-strip-coil.webp`,
  "led-smd-2700": `${S}/p-strip-smd.webp`,
  "led-smd-3000": `${S}/p-strip-reel.webp`,
  "led-smd-4000": `${S}/p-strip-smd.webp`,
  "led-tunable-cct": `${S}/p-strip-reel.webp`,
  "led-12v-short": `${S}/p-strip-smd.webp`,
  "led-narrow-cob": `${S}/p-strip-coil.webp`,
  "led-high-output": `${S}/p-strip-stair.webp`,
  "led-cob-3000-cri": `${S}/p-strip-coil.webp`,
  "al-pendant": `${S}/p-pendant-linear.webp`,
  "lum-emergency-exit": `${S}/p-emergency-exit.webp`,
  "ww-500-mono-3000": `${S}/p-washer-brick.webp`,
  "ww-1000-mono-4000": `${S}/p-washer-linear.webp`,
  "ww-asymmetric-graze": `${S}/p-washer-arches.webp`,
  "ww-narrow-15": `${S}/p-washer-brick.webp`,
  "ww-30-wash": `${S}/p-washer-linear.webp`,
  "ww-60-flood": `${S}/p-washer-facade.webp`,
  "ww-flexible": `${S}/p-washer-arches.webp`,
  "ww-high-power": `${S}/p-washer-facade.webp`,
  "ww-compact-column": `${S}/p-washer-brick.webp`,
  "ww-0-10v-mono": `${S}/p-washer-linear.webp`,
  "al-inground": `${S}/space-outdoor.webp`,
  "ww-ground-recessed": `${S}/p-washer-arches.webp`,
  "al-hermetic": `${S}/p-outdoor-linear.webp`,
  "led-cob-ip67": `${S}/p-outdoor-linear.webp`,
  "led-48v-facade": `${S}/p-washer-facade.webp`,
  "lum-garden-pole": `${S}/p-bollard.webp`,
  "led-rgb": `${S}/p-rgb-strip.webp`,
  "led-rgbw": `${S}/p-rgb-strip.webp`,
  "led-rgb-cct": `${S}/p-rgb-pixel.webp`,
  "led-rgbic": `${S}/p-rgb-pixel.webp`,
  "led-neon-flex": `${S}/p-neon-flex.webp`,
  "ww-1000-rgbw-dmx": `${S}/cat-wall-washers.webp`,
  "ww-rgb-dmx-ip65": `${S}/cat-wall-washers.webp`,
  "drv-24v-const": `${S}/p-driver-psu.webp`,
  "drv-12v-compact": `${S}/p-driver-psu.webp`,
  "drv-48v-facade": `${S}/p-driver-psu.webp`,
  "acc-connectors": `${S}/p-connectors.webp`,
};

/** Extra representative photos shown in the product-page gallery. */
const extraImages: Record<string, string[]> = {
  "lum-downlight": [`${S}/p-downlight-round.webp`],
  "lum-track-spot": [`${S}/p-track-white.webp`],
  "lum-garden-pole": [`${S}/p-garden-lamp.webp`],
  "al-recessed-trimless": [`${S}/p-linear-wall.webp`],
  "led-smd-2700": [`${S}/p-strip-reel.webp`],
};

export type CatalogItem = Product & {
  group: Group;
  sub: SubCategory;
  photo?: string;
  gallery: string[];
  href: string;
};

const byId = new Map(products.map((p) => [p.id, p]));

export const catalog: CatalogItem[] = groups.flatMap((group) =>
  group.subs.flatMap((sub) =>
    sub.productIds.map((id) => {
      const p = byId.get(id);
      if (!p) throw new Error(`catalog: unknown product id ${id}`);
      return {
        ...p,
        group,
        sub,
        photo: p.image ?? productImages[id],
        gallery: extraImages[id] ?? p.gallery ?? [],
        href: `/products/${group.slug}/${sub.slug}/${id}/`,
      };
    })
  )
);

// Guard: every product must be mapped exactly once.
if (catalog.length !== products.length) {
  const mapped = new Set(catalog.map((c) => c.id));
  const missing = products.filter((p) => !mapped.has(p.id)).map((p) => p.id);
  throw new Error(`catalog: unmapped products ${missing.join(", ")}`);
}

export const brandCount = (b: Brand) => catalog.filter((c) => brandOf(c) === b).length;

/** Brands present in a list of items, in display order, with counts. */
export function brandsIn(items: CatalogItem[]) {
  return brands
    .map((b) => ({ brand: b, count: items.filter((i) => brandOf(i) === b).length }))
    .filter((x) => x.count > 0);
}

/** Voltages present in a list of items (strip listings), in display order, with counts. */
export function voltagesIn(items: CatalogItem[]) {
  return voltages
    .map((v) => ({ voltage: v, count: items.filter((i) => voltageOf(i) === v).length }))
    .filter((x) => x.count > 0);
}

/** Sub-categories that show Voltage chips. */
export const VOLTAGE_SUBS = ["led-strips", "rgb-strips", "neon-flex"];

export const groupCount = (g: Group) => g.subs.reduce((n, s) => n + s.productIds.length, 0);
export const subCount = groups.reduce((n, g) => n + g.subs.length, 0);
export const totalProducts = catalog.length;

export function findGroup(slug: string) {
  return groups.find((g) => g.slug === slug);
}
export function findSub(groupSlug: string, subSlug: string) {
  return findGroup(groupSlug)?.subs.find((s) => s.slug === subSlug);
}
export function itemsIn(sub: SubCategory) {
  return catalog.filter((c) => c.sub.slug === sub.slug);
}
export function findItem(id: string) {
  return catalog.find((c) => c.id === id);
}

/** Name used in the WhatsApp quote message — prefixed with the brand for FSL / Enlight items. */
export function quoteName(p: Product) {
  const b = brandOf(p);
  return b === "Barq Lumi" ? p.name : `${b} ${p.name}`;
}

export function quoteHref(name: string) {
  const text = `Hello Barq Lumi, I'd like a quote for: ${name}`;
  return `${site.whatsapp.href}?text=${encodeURIComponent(text)}`;
}

/** Lighting by space — tiles on the home page. */
export const spaces = [
  {
    name: "Residential / Villas",
    note: "Cove lines, COB strip, garden poles",
    image: `${S}/space-villas.webp`,
    href: "/products/indoor/led-strips/",
  },
  {
    name: "Retail",
    note: "Track spots and high-CRI strip",
    image: `${S}/space-retail.webp`,
    href: "/products/indoor/track-lights/",
  },
  {
    name: "Hospitality",
    note: "Warm 3000K ambient and façade wash",
    image: `${S}/space-hospitality.webp`,
    href: "/products/outdoor/wall-washers/",
  },
  {
    name: "Office",
    note: "Suspended and recessed linear",
    image: `${S}/space-offices.webp`,
    href: "/products/indoor/linear-profiles/",
  },
  {
    name: "Outdoor & Landscape",
    note: "Bollards, in-ground and IP67 linear",
    image: `${S}/space-outdoor.webp`,
    href: "/products/outdoor/",
  },
] as const;

/** Spec table: pull only values that already exist in each product's spec list. */
export type SpecRow = { label: string; value: string };

export function specTable(p: Product): { rows: SpecRow[]; features: string[] } {
  if (p.specRows) return { rows: p.specRows, features: p.specs };
  const rows: Record<string, string[]> = {};
  const used = new Set<string>();
  const add = (label: string, value: string, spec: string) => {
    const list = (rows[label] ||= []);
    if (!list.includes(value)) list.push(value);
    used.add(spec);
  };
  for (const spec of p.specs) {
    let m: RegExpMatchArray | null;
    if ((m = spec.match(/(\d+(?:–\d+)?\s?W(?:\/m)?)(?![a-z])/))) add("Wattage", m[1], spec);
    if ((m = spec.match(/(\d+(?:–\d+)?\s?lm)/i))) add("Lumens", m[1], spec);
    if ((m = spec.match(/(\d{4}(?:–\d{4})?K)/))) add("CCT", m[1], spec);
    if ((m = spec.match(/CRI\s?(\d+\+?)/))) add("CRI", m[1], spec);
    if ((m = spec.match(/(IP\d{2}(?:\/\d{2})?\+?)/))) add("IP rating", m[1], spec);
    if ((m = spec.match(/(\d+(?:–\d+)?°)/))) add("Beam angle", m[1], spec);
    if ((m = spec.match(/(\d+×\d+(?:\s\/\s\d+×\d+)?)/))) add("Beam angle", `${m[1]}° asymmetric`, spec);
    if ((m = spec.match(/(?<![–\d])(12|24|48)V(?!\w)(\s+preferred)?/))) add("Voltage", `${m[1]}V DC${m[2] ? " (preferred)" : ""}`, spec);
    if ((m = spec.match(/^(\d+(?:–\d+)?\s?mm)$/))) add("Size", m[1], spec);
    if ((m = spec.match(/^(\d+\s?mm)\b(?!\sR)/)) && !used.has(spec)) add("Size", m[1], spec);
    if ((m = spec.match(/(\d+–\d+\s?m)\s?cuts/))) add("Size", `${m[1]} cut lengths`, spec);
  }
  const order = ["Wattage", "Lumens", "CCT", "CRI", "IP rating", "Beam angle", "Voltage", "Size"];
  return {
    rows: order.filter((l) => rows[l]).map((l) => ({ label: l, value: rows[l].join(" / ") })),
    features: p.specs.filter((s) => !used.has(s)),
  };
}
