import { brandProducts } from "@/lib/brand-products";
import { facadeProducts } from "@/lib/facade-products";

export type ProductCategory =
  | "Aluminum profiles"
  | "LED strip lights"
  | "Wall washers"
  | "Drivers & control"
  | "Accessories"
  | "Luminaires"
  | "Electrical package";

export type ProductTone = "cool" | "warm" | "amber" | "blue" | "green" | "soft" | "silver" | "violet";

export type Brand = "Barq Lumi" | "FSL" | "Enlight";

export const brands: Brand[] = ["FSL", "Enlight", "Barq Lumi"];

export type SpecRowData = { label: string; value: string };

/** One orderable model inside a product family (wattage / size / finish step). */
export type Voltage = "220V" | "48V" | "24V" | "12V";
export const voltages: Voltage[] = ["220V", "48V", "24V", "12V"];

export type Variant = {
  model: string;
  power?: string;
  lumens?: string;
  intensity?: string;
  size?: string;
  beam?: string;
  note?: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  use: string;
  specs: string[];
  tone: ProductTone;
  featured?: boolean;
  /** Real product photo (optional). Representative stock photos are mapped in catalog.ts */
  image?: string;
  /** Brand line. Omitted = Barq Lumi's own specified range. */
  brand?: Brand;
  /** Single model code (when the product has no variants). */
  model?: string;
  /** Spec table copied from the manufacturer / distributor source (brand products). */
  specRows?: SpecRowData[];
  variants?: Variant[];
  /** Source page / document for brand or catalogue data. */
  source?: string;
  /** Extra real images (dimension drawing, lighting curve) for the product-page gallery. */
  gallery?: string[];
  applications?: string[];
  /** Caption under the product-page gallery (overrides the default). */
  photoNote?: string;
  /** True when the main image is a generated stand-in rather than a real photo. */
  representativeImage?: boolean;
  /** Strip supply voltage (filter key); brand strips set it from the source data. */
  voltage?: Voltage;
};

export const productCategories: ProductCategory[] = [
  "Aluminum profiles",
  "LED strip lights",
  "Wall washers",
  "Drivers & control",
  "Accessories",
  "Luminaires",
  "Electrical package",
];

const barqProducts: Product[] = [
  // ——— Aluminum profiles → profile-recessed, cove-linear, pendant-linear, kitchen-linear ———
  {
    id: "al-recessed-trimless",
    name: "Recessed Trimless Plaster-in Profile",
    category: "Aluminum profiles",
    use: "Flush drywall line for continuous cove and ceiling slots — AL6063-T5 architectural grade.",
    specs: ["AL6063-T5", "Trimless", "Opal / frosted", "End caps", "Heat-sink body"],
    tone: "silver",
    featured: true,
  },
  {
    id: "al-recessed-flanged",
    name: "Recessed Flanged Slot-in Profile",
    category: "Aluminum profiles",
    use: "Covers the plaster gap on recessed runs; clean flange for renovation and new-build ceilings.",
    specs: ["AL6063-T5", "Flanged", "Clear / opal diffuser", "Mounting clips", "1–3 m cuts"],
    tone: "silver",
  },
  {
    id: "al-slim-surface-u",
    name: "Slim Surface-mount U Profile",
    category: "Aluminum profiles",
    use: "Silver anodised surface-mount channel for tight corridors, under-cabinet and feature lines.",
    specs: ["Silver anodised", "Slim U", "Opal / clear", "Clips + end caps", "Heat-sink"],
    tone: "silver",
    featured: true,
  },
  {
    id: "al-wide-surface",
    name: "Wide Surface-mount Profile (Dual / Triple Strip)",
    category: "Aluminum profiles",
    use: "Wide extrusion for dual or triple strip layouts — higher output architectural lines.",
    specs: ["Wide body", "Dual / triple", "Lensed 30–60°", "AL6063-T5", "End caps"],
    tone: "warm",
  },
  {
    id: "al-corner-cove",
    name: "Corner / Cove Internal-angle Profile",
    category: "Aluminum profiles",
    use: "Internal-angle extrusion for wall–ceiling coves and soft indirect uplight.",
    specs: ["Internal angle", "Cove", "Frosted diffuser", "Clips", "Cut lengths"],
    tone: "soft",
  },
  {
    id: "al-external-angle",
    name: "External-angle Profile",
    category: "Aluminum profiles",
    use: "External corner channel for shelf edges, steps and architectural reveals.",
    specs: ["External angle", "AL6063-T5", "Opal diffuser", "End caps", "Mount clips"],
    tone: "silver",
  },
  {
    id: "al-pendant",
    name: "Pendant / Suspended Linear Profile",
    category: "Aluminum profiles",
    use: "Continuous suspended runs for offices, lobbies and retail — joinable linear sections.",
    specs: ["Suspended", "Continuous join", "Opal / lensed", "Suspension kit", "Heat-sink"],
    tone: "cool",
    featured: true,
  },
  {
    id: "al-inground",
    name: "In-ground Walkable Profile IP67",
    category: "Aluminum profiles",
    use: "Walkable in-ground channel for plazas, driveways and pathway edge lighting.",
    specs: ["IP67", "Walkable", "Heavy extrude", "Frosted / clear", "Drain-ready"],
    tone: "green",
  },
  {
    id: "al-hermetic",
    name: "Hermetic Outdoor Profile IP67",
    category: "Aluminum profiles",
    use: "Heavy-duty façade extrusion for 24V outdoor linear — sealed for coastal UAE exposure.",
    specs: ["IP67", "Façade class", "24V ready", "SS hardware", "Opal / clear"],
    tone: "blue",
  },
  {
    id: "al-bendable",
    name: "Bendable / Curved Profile",
    category: "Aluminum profiles",
    use: "Curved architectural runs for arcs and soft radii — min radius ~120 mm class.",
    specs: ["Bendable", "~120 mm R", "AL6063 class", "Opal diffuser", "End caps"],
    tone: "amber",
  },
  {
    id: "al-mini-furniture",
    name: "Mini Furniture / Cabinet Profile",
    category: "Aluminum profiles",
    use: "Compact extrusion for joinery, wardrobe and display cabinets — discreet linear glow.",
    specs: ["Mini width", "Cabinet", "Frosted", "Clips", "Short cuts"],
    tone: "soft",
  },
  {
    id: "al-stair-handrail",
    name: "Stair / Handrail Profile",
    category: "Aluminum profiles",
    use: "Handrail and stair-nosing channel for safe, low-glare circulation lighting.",
    specs: ["Stair / rail", "Low glare", "Opal", "AL6063-T5", "Mount clips"],
    tone: "warm",
  },
  {
    id: "al-matte-black",
    name: "Matte Black Powder-coated Architectural Profile",
    category: "Aluminum profiles",
    use: "Powder-coated matte black finish for dark ceilings and high-contrast interiors.",
    specs: ["Matte black PC", "Architectural", "Opal / clear", "End caps", "Heat-sink"],
    tone: "amber",
  },
  {
    id: "al-custom-ral",
    name: "Custom RAL / Anodised Silver / White",
    category: "Aluminum profiles",
    use: "Cut lengths typically 1–3 m in anodised silver, white or specified RAL — project finish match.",
    specs: ["Custom RAL", "Anodised options", "1–3 m cuts", "Diffuser suite", "Project finish"],
    tone: "silver",
  },
  {
    id: "al-surface-deep",
    name: "Deep Surface-mount Profile with Lensed Optic",
    category: "Aluminum profiles",
    use: "Deeper channel for glare control with 30–60° lensed covers on surface runs.",
    specs: ["Deep body", "30–60° lens", "AL6063-T5", "Clips", "End caps"],
    tone: "cool",
  },

  // ——— LED strip lights → led-strip-profile, cove-linear, rgb-ambient, kitchen-linear ———
  {
    id: "led-cob-ip20",
    name: "24V COB IP20 High-CRI 90+",
    category: "LED strip lights",
    use: "Dotless interior tape for villas and retail — continuous line without visible diodes.",
    specs: ["24V", "COB", "IP20", "CRI 90+", "Dotless"],
    tone: "warm",
    featured: true,
  },
  {
    id: "led-cob-ip67",
    name: "24V COB IP67 Silicone",
    category: "LED strip lights",
    use: "Silicone-jacket COB for wet zones, outdoor soffits and sheltered façades.",
    specs: ["24V", "COB", "IP67", "Silicone", "CRI 90+"],
    tone: "green",
  },
  {
    id: "led-cob-ip68",
    name: "24V COB IP68 Fountain / Pool-edge Class",
    category: "LED strip lights",
    use: "Fully sealed COB for fountain rims, pool edges and water-adjacent features.",
    specs: ["24V", "COB", "IP68", "Water edge", "Sealed"],
    tone: "blue",
  },
  {
    id: "led-smd-2700",
    name: "24V SMD 2700K Warm White",
    category: "LED strip lights",
    use: "Warm residential and hospitality ambient — classic villa evening tone.",
    specs: ["24V", "SMD", "2700K", "Warm white", "Cut pitch"],
    tone: "warm",
  },
  {
    id: "led-smd-3000",
    name: "24V SMD 3000K Hospitality",
    category: "LED strip lights",
    use: "Hospitality-grade neutral-warm for lobbies, F&B and guest corridors.",
    specs: ["24V", "SMD", "3000K", "Hospitality", "CRI 90+"],
    tone: "amber",
    featured: true,
  },
  {
    id: "led-smd-4000",
    name: "24V SMD 4000K Neutral",
    category: "LED strip lights",
    use: "Neutral white for offices, retail floors and task-adjacent architectural lines.",
    specs: ["24V", "SMD", "4000K", "Neutral", "Cut pitch"],
    tone: "cool",
  },
  {
    id: "led-tunable-cct",
    name: "24V Tunable CCT 2700–6000K",
    category: "LED strip lights",
    use: "Tunable white for circadian and scene-set interiors — villas and premium offices.",
    specs: ["24V", "CCT 2700–6000K", "Tunable", "Controller ready", "CRI 90+"],
    tone: "soft",
  },
  {
    id: "led-rgb",
    name: "24V RGB",
    category: "LED strip lights",
    use: "RGB colour for feature walls, gaming rooms and event spaces.",
    specs: ["24V", "RGB", "Controller", "Cut pitch", "Interior / IP options"],
    tone: "violet",
  },
  {
    id: "led-rgbw",
    name: "24V RGBW",
    category: "LED strip lights",
    use: "RGB plus dedicated white channel for accurate white and saturated colour.",
    specs: ["24V", "RGBW", "White channel", "DMX / PWM", "Cut pitch"],
    tone: "violet",
  },
  {
    id: "led-rgb-cct",
    name: "24V RGB+CCT",
    category: "LED strip lights",
    use: "Full colour plus tunable white in one tape — entertainment and multi-scene interiors.",
    specs: ["24V", "RGB+CCT", "Multi-scene", "Controller", "Cut pitch"],
    tone: "violet",
  },
  {
    id: "led-12v-short",
    name: "12V Short-run Interior Strip",
    category: "LED strip lights",
    use: "Short interior runs for joinery and niches where 12V gear is preferred.",
    specs: ["12V", "Short run", "Interior", "Cut pitch", "IP20 class"],
    tone: "soft",
  },
  {
    id: "led-48v-facade",
    name: "48V Long-run Façade Linear",
    category: "LED strip lights",
    use: "Long-run façade tape with voltage-drop control for extended elevations.",
    specs: ["48V", "Long run", "Façade", "Voltage-drop control", "Outdoor class"],
    tone: "blue",
  },
  {
    id: "led-neon-flex",
    name: "High-density COB Neon-flex Silicone IP67",
    category: "LED strip lights",
    use: "Side-bend neon-flex look for signage, curves and outdoor graphic lines.",
    specs: ["COB neon-flex", "IP67", "Silicone", "High density", "Bendable"],
    tone: "amber",
  },
  {
    id: "led-narrow-cob",
    name: "Narrow 5–8 mm COB for Tight Profiles",
    category: "LED strip lights",
    use: "Ultra-narrow COB for mini furniture and slim architectural channels.",
    specs: ["5–8 mm", "COB", "24V", "Tight profile", "Dotless"],
    tone: "silver",
  },
  {
    id: "led-high-output",
    name: "High-output 15–20 W/m Architectural Tape",
    category: "LED strip lights",
    use: "Higher wattage class for wall wash and bright cove where output matters.",
    specs: ["15–20 W/m", "Architectural", "24V preferred", "Heat-sink profile", "CRI 90+"],
    tone: "warm",
  },
  {
    id: "led-rgbic",
    name: "RGBIC / Addressable",
    category: "LED strip lights",
    use: "Pixel-addressable entertainment and gaming-room effects — chase and gradient scenes.",
    specs: ["RGBIC", "Addressable", "Entertainment", "Controller", "Cut pitch"],
    tone: "violet",
  },
  {
    id: "led-cob-3000-cri",
    name: "24V COB 3000K CRI 95 Retail Class",
    category: "LED strip lights",
    use: "High-CRI COB for retail and villa display — colour-critical interiors.",
    specs: ["24V", "COB", "3000K", "CRI 95", "Retail / villa"],
    tone: "warm",
  },

  // ——— Wall washers → facade-wash, wall-washer-stone, rgb-ambient ———
  {
    id: "ww-500-mono-3000",
    name: "Linear 500 mm IP65 Mono 3000K",
    category: "Wall washers",
    use: "Compact mono wall washer for villa façades and short elevation modules.",
    specs: ["500 mm", "IP65", "3000K", "Mono", "Die-cast Al"],
    tone: "warm",
    featured: true,
  },
  {
    id: "ww-1000-mono-4000",
    name: "Linear 1000 mm IP65/67 Mono 4000K",
    category: "Wall washers",
    use: "Metre-length mono wash for towers and commercial façades — neutral white.",
    specs: ["1000 mm", "IP65/67", "4000K", "Mono", "SS hardware"],
    tone: "cool",
  },
  {
    id: "ww-1000-rgbw-dmx",
    name: "Linear 1000 mm RGBW DMX512 IP67",
    category: "Wall washers",
    use: "DMX512 RGBW façade bar for programmable colour elevations.",
    specs: ["1000 mm", "RGBW", "DMX512", "IP67", "Die-cast Al"],
    tone: "violet",
  },
  {
    id: "ww-rgb-dmx-ip65",
    name: "Linear RGB DMX IP65",
    category: "Wall washers",
    use: "RGB DMX linear for plazas and feature walls with outdoor rating.",
    specs: ["RGB", "DMX", "IP65", "Linear", "Coastal SS"],
    tone: "violet",
  },
  {
    id: "ww-asymmetric-graze",
    name: "Asymmetric 15×30 / 10×32 Graze Optic",
    category: "Wall washers",
    use: "Grazing optic for textured stone and cladding — tight vertical wash.",
    specs: ["15×30 / 10×32", "Asymmetric", "Graze", "IP65+", "Die-cast"],
    tone: "amber",
  },
  {
    id: "ww-narrow-15",
    name: "Narrow 15° Accent Beam",
    category: "Wall washers",
    use: "Narrow accent for columns, niches and sculptural elements.",
    specs: ["15°", "Accent", "Narrow beam", "IP65", "0–10V / DMX"],
    tone: "cool",
  },
  {
    id: "ww-30-wash",
    name: "30° Wall Wash",
    category: "Wall washers",
    use: "Classic 30° wash optic for even façade planes and lobby walls.",
    specs: ["30°", "Wall wash", "Even field", "IP65/67", "Die-cast Al"],
    tone: "warm",
  },
  {
    id: "ww-60-flood",
    name: "Wide 60° Flood Wash",
    category: "Wall washers",
    use: "Wide flood for broad elevations and open plaza walls.",
    specs: ["60°", "Flood", "Wide field", "IP65", "SS fixings"],
    tone: "soft",
  },
  {
    id: "ww-pixel",
    name: "Pixel-addressable Linear Bar",
    category: "Wall washers",
    use: "Pixel bar for media façades and sequenced architectural effects.",
    specs: ["Pixel", "Addressable", "Linear bar", "DMX / SPI", "IP65+"],
    tone: "violet",
  },
  {
    id: "ww-flexible",
    name: "Flexible Wall-washer / Curve Façade",
    category: "Wall washers",
    use: "Flexible wash module for curved façades and organic elevations.",
    specs: ["Flexible", "Curve façade", "IP65/67", "Mono / RGB options", "Coastal ready"],
    tone: "blue",
  },
  {
    id: "ww-ground-recessed",
    name: "Recessed Ground-wash IP67",
    category: "Wall washers",
    use: "In-ground wash uplighting façades and landscape walls from grade.",
    specs: ["Recessed", "IP67", "Ground wash", "Die-cast", "Walk-adjacent"],
    tone: "green",
  },
  {
    id: "ww-high-power",
    name: "High-power 36–48 W/m Façade Bar",
    category: "Wall washers",
    use: "High-output façade bar for tall elevations and long throw wash.",
    specs: ["36–48 W/m", "High power", "Façade", "IP67", "DMX / 0–10V"],
    tone: "amber",
  },
  {
    id: "ww-compact-column",
    name: "Compact 18–24 W Column Washer",
    category: "Wall washers",
    use: "Compact washer for columns, pilasters and narrow verticals.",
    specs: ["18–24 W", "Compact", "Column", "IP65", "Narrow optic"],
    tone: "cool",
  },
  {
    id: "ww-fountain-ip68",
    name: "Fountain / Water-feature Wash IP68 Class",
    category: "Wall washers",
    use: "Submersible-class wash for fountains and water features — sealed hardware.",
    specs: ["IP68 class", "Fountain", "Water feature", "SS hardware", "RGB / mono"],
    tone: "blue",
  },
  {
    id: "ww-0-10v-mono",
    name: "0–10V Dimmable Mono Linear Wash IP65",
    category: "Wall washers",
    use: "Analogue 0–10V dimming for hospitality façades and controlled night scenes.",
    specs: ["0–10V", "Mono", "IP65", "Dimmable", "Die-cast Al"],
    tone: "warm",
  },

  // ——— Drivers & control / Accessories / Luminaires / Electrical — subtler effect shots ———
  {
    id: "drv-24v-const",
    name: "24V Constant-voltage LED Driver / PSU",
    category: "Drivers & control",
    use: "Constant-voltage 24V supply for strip and profile systems — preferred for longer runs.",
    specs: ["24V CV", "PSU", "Power injection ready", "Indoor / IP options", "Project sizing"],
    tone: "silver",
  },
  {
    id: "drv-dmx-decoder",
    name: "DMX Decoder / PWM Interface",
    category: "Drivers & control",
    use: "DMX512 to PWM decoding for RGB/RGBW strips and linear wash control.",
    specs: ["DMX512", "PWM out", "RGB / RGBW", "Rack / DIN options", "Scene ready"],
    tone: "violet",
  },
  {
    id: "acc-opal-diffuser",
    name: "Opal Diffuser Covers",
    category: "Accessories",
    use: "Opal, frosted, clear and lensed (30–60°) covers for architectural profiles.",
    specs: ["Opal / frosted", "Clear", "30–60° lens", "Profile match", "Cut to length"],
    tone: "soft",
  },
  {
    id: "acc-endcaps-brackets",
    name: "End Caps & Mounting Brackets",
    category: "Accessories",
    use: "End caps, clips and brackets matched to AL6063 profile families.",
    specs: ["End caps", "Clips", "Brackets", "AL match", "Silver / black"],
    tone: "silver",
  },
  {
    id: "lum-emergency-exit",
    name: "Emergency Exit Luminaires",
    category: "Luminaires",
    use: "Compliant exit and emergency luminaires for towers and public buildings.",
    specs: ["Emergency", "Exit signage", "Maintained options", "Battery pack", "Code-ready"],
    tone: "amber",
  },
  {
    id: "lum-downlight",
    name: "LED Downlights",
    category: "Luminaires",
    use: "Architectural recessed downlights for villas, offices and retail ceilings.",
    specs: ["Recessed", "CRI 90+", "CCT options", "Cut-out sizes", "Dimmable options"],
    tone: "warm",
  },
  {
    id: "lum-track-spot",
    name: "Track Spots",
    category: "Luminaires",
    use: "Track-mounted accent spots for retail, galleries and feature interiors.",
    specs: ["Track", "Accent", "Beam options", "CRI 90+", "Phase / DALI options"],
    tone: "cool",
  },
  {
    id: "lum-garden-pole",
    name: "Outdoor Garden Poles",
    category: "Luminaires",
    use: "Landscape bollards and poles for gardens, compounds and promenades.",
    specs: ["IP65+", "Pole / bollard", "Warm / neutral", "Coastal SS", "Ground mount"],
    tone: "green",
  },
  {
    id: "elec-smdb",
    name: "SMDB / Isolators — Electrical Package",
    category: "Electrical package",
    use: "Sub-main distribution boards and isolators coordinated with lighting packages.",
    specs: ["SMDB", "Isolators", "Main to DB", "Project package", "UAE practice"],
    tone: "silver",
  },
  {
    id: "drv-12v-compact",
    name: "12V Compact PSU for Short Runs",
    category: "Drivers & control",
    use: "Compact 12V drivers for joinery and short interior strip circuits.",
    specs: ["12V CV", "Compact", "Short run", "Indoor", "Protected"],
    tone: "soft",
  },
  {
    id: "drv-48v-facade",
    name: "48V Façade Driver Suite",
    category: "Drivers & control",
    use: "Higher-voltage façade drivers for long-run linear with reduced drop.",
    specs: ["48V", "Façade", "Long run", "Outdoor class options", "Injection points"],
    tone: "blue",
  },
  {
    id: "acc-connectors",
    name: "Waterproof Connectors & Injection Leads",
    category: "Accessories",
    use: "IP-rated connectors and power-injection leads for outdoor strip and wash systems.",
    specs: ["IP67 connectors", "Injection leads", "24V / 48V", "Outdoor", "Field fit"],
    tone: "green",
  },
];

export const products: Product[] = [
  ...barqProducts,
  ...[...facadeProducts, ...brandProducts].map(({ sub: _sub, ...p }) => p), // eslint-disable-line @typescript-eslint/no-unused-vars
];

export const brandOf = (p: Pick<Product, "brand">): Brand => p.brand ?? "Barq Lumi";

/** Supply voltage for strip products: explicit field, else an exact "12V" / "24V" / "48V" spec chip. */
export function voltageOf(p: Pick<Product, "voltage" | "specs" | "category">): Voltage | undefined {
  if (p.voltage) return p.voltage;
  if (p.category !== "LED strip lights") return undefined;
  const hit = p.specs.find((s) => /^(12|24|48)V$/.test(s));
  return hit as Voltage | undefined;
}

export const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

export const productCount = products.length;
