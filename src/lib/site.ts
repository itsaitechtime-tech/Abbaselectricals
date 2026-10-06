export const site = {
  name: "Barq Lumi",
  tradingName: "Abbas Electricals",
  legalName: "ABBAS AHMED SANITARY & ELECTRIC WARE TR LLC",
  url: "https://abbaselectricals.com",
  description:
    "Barq Lumi specifies, supplies and installs lighting and electrical works for buildings that have to look finished at night. From Muweilah, Sharjah — serving the UAE. Licensed since 2006.",
  established: 2006,
  address: {
    locality: "Muweilah",
    region: "Sharjah",
    country: "AE",
    postalCode: "68444",
    display: "Muweilah, Sharjah, UAE · P.O. Box 68444",
  },
  tel: {
    display: "055 341 8850",
    href: "tel:+971553418850",
  },
  whatsapp: {
    display: "052 850 0094",
    href: "https://wa.me/971528500094",
  },
  email: {
    display: "Info@abbaselectricals.com",
    href: "mailto:Info@abbaselectricals.com",
  },
  instagram: {
    display: "@barqlumi",
    href: "https://instagram.com/barqlumi",
  },
  vatTrn: "100044362000003",
  mission:
    "Specify, supply and install to a standard consultants and developers can rely on.",
  vision:
    "Among the leading lighting, electrical and sanitary suppliers in the UAE; specified when the work must be done once, and done correctly.",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/products/", label: "Products" },
  { href: "/products/facade-architectural/", label: "Façade" },
  { href: "/services/", label: "Services" },
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

export const whoWeAre = [
  {
    title: "Quality first",
    detail: "Specified materials and finishes that hold up on site and after handover.",
  },
  {
    title: "Clear responsibility",
    detail: "Named accountability for commercial and project decisions from day one.",
  },
  {
    title: "Disciplined execution",
    detail: "Coordinated supply and install so the night finish matches the brief.",
  },
  {
    title: "Accountable handover",
    detail: "Records and responsibility that travel with the building.",
  },
] as const;

export const qualityAssurance = [
  {
    title: "Commercial responsibility",
    detail: "Abbas Ahmed",
  },
  {
    title: "Project responsibility",
    detail: "Projects Manager, Lighting Division",
  },
  {
    title: "Specified materials only",
    detail: "No substitution without written agreement.",
  },
  {
    title: "Incoming inspection",
    detail: "Goods checked against specification before they leave for site.",
  },
  {
    title: "Site quality",
    detail: "Install reviewed against drawings and the approved schedule.",
  },
  {
    title: "Records that travel with the building",
    detail: "Documentation retained for consultants, developers, and facilities teams.",
  },
] as const;

export const lightingBrands = [
  "OSRAM",
  "Philips",
  "FSL",
  "Opple",
  "LumiLife",
  "Eaton",
  "NEXON",
  "ESENCO",
  "MOGEN",
  "MK",
  "Schneider",
  "ABB",
  "LEDVANCE",
  "Legrand",
  "Panasonic",
  "HAVELLS",
] as const;

export const sanitaryBrands = [
  "KLUDI",
  "RAK",
  "Jaquar",
  "Milano",
  "RAK Ceramics",
  "KOHLER",
  "GROHE",
] as const;

export const selectedClients = [
  "Dubai Police",
  "University of Sharjah",
  "Al Teneiji Real Estate",
  "Khansaheb Industries",
  "Grankraft Industries",
  "Ayat Group",
  "HSH Real Estate",
] as const;

/** Official client logos (see public/images/clients/SOURCES.md). Clients without a logo render as text. */
export const clientLogos: Partial<Record<(typeof selectedClients)[number], { src: string; width: number; height: number }>> = {
  "Ayat Group": { src: "/images/clients/ayat-group.png", width: 448, height: 120 },
  "HSH Real Estate": { src: "/images/clients/hsh-real-estate.png", width: 252, height: 120 },
};

export const services = [
  {
    slug: "facade-architectural",
    title: "Façade & architectural lighting",
    summary:
      "External illumination designed for presence after dark — towers, plazas, and elevations that read clearly from the street.",
  },
  {
    slug: "interior-villa",
    title: "Interior & villa lighting",
    summary:
      "Layered interior schemes for villas and commercial interiors — ambient, task, and accent, finished to the last fitting.",
  },
  {
    slug: "emergency",
    title: "Emergency lighting",
    summary:
      "Compliant emergency and exit lighting for towers and public buildings, coordinated with the main electrical package.",
  },
  {
    slug: "gaming-rgb-dmx",
    title: "Gaming, RGB & DMX",
    summary:
      "Programmable colour and effect lighting for gaming rooms, entertainment spaces, and feature installations.",
  },
  {
    slug: "garden-outdoor",
    title: "Garden & outdoor lighting",
    summary:
      "Landscape poles, path lighting, and outdoor fittings for gardens, promenades, and compound exteriors.",
  },
  {
    slug: "led-supply",
    title: "LED supply",
    summary:
      "Specification-grade LED luminaires and fittings supplied for projects across the Emirates.",
  },
  {
    slug: "electrical",
    title: "Electrical — main supply to DB",
    summary:
      "Main supply, distribution boards, and circuit work from the intake through to final circuits.",
  },
  {
    slug: "smart-home",
    title: "Smart home — Tuya Wi-Fi & Zigbee",
    summary:
      "Retrofit and new-build smart switches, sockets, locks, lights, cameras, security, and AC control.",
  },
  {
    slug: "sanitary",
    title: "Sanitary ware (secondary)",
    summary:
      "Sanitary supply alongside electrical packages where the project requires a single coordinated vendor.",
  },
] as const;

export type ProjectTone = "cool" | "warm" | "amber" | "blue" | "green" | "soft";

export type Project = {
  title: string;
  location: string;
  tone: ProjectTone;
  description: string;
  image?: string;
  gallery?: string[];
  alt?: string;
};

export const projects: Project[] = [
  {
    title: "RGB entertainment room",
    location: "UAE",
    tone: "blue",
    image: "/projects/web/rgb-room-feature.webp",
    gallery: ["/projects/web/rgb-room-zigzag.webp", "/projects/web/rgb-room-desk.webp"],
    alt: "RGB geometric wall feature and floor lines in an entertainment room",
    description:
      "Completed Barq Lumi install — programmable RGB wall geometry, floor lines, zigzag shelves and a lit desk run in one entertainment room.",
  },
  {
    title: "Living cove and floor line",
    location: "UAE",
    tone: "blue",
    image: "/projects/web/living-cove-floor.webp",
    alt: "Living room cove lighting in blue and green with a floor LED line around the seating",
    description:
      "Completed Barq Lumi install — colour-changing cove around a floating ceiling plane and a continuous floor LED line in a living room.",
  },
  {
    title: "Gaming desk RGB",
    location: "UAE",
    tone: "soft",
    image: "/projects/web/gaming-desk-rgb.webp",
    alt: "Gaming desk with pink and purple RGB lighting along the ceiling and desk edge",
    description:
      "Completed Barq Lumi install — pink and purple RGB along the ceiling cove and desk edge of a gaming room.",
  },
  {
    title: "Feature mirror RGB",
    location: "UAE",
    tone: "cool",
    image: "/projects/web/mirror-rgb-cube.webp",
    alt: "Feature mirror cube with rainbow RGB lighting",
    description:
      "Completed Barq Lumi install — rainbow RGB on a feature mirror cube.",
  },
  {
    title: "Gaming venue RGB",
    location: "UAE",
    tone: "blue",
    image: "/projects/web/gaming-venue-rgb.webp",
    alt: "Gaming venue ceiling LED geometry and desk-edge RGB strip",
    description:
      "Completed Barq Lumi install — geometric ceiling LED runs and a desk-edge strip in a gaming venue.",
  },
  {
    title: "Kitchen recessed linear",
    location: "UAE",
    tone: "warm",
    image: "/projects/web/kitchen-recessed.webp",
    gallery: ["/projects/web/kitchen-linear.webp"],
    alt: "Kitchen recessed white rectangular linear lighting",
    description:
      "Completed Barq Lumi install — recessed white linear in a kitchen ceiling, with a second view of a linear run and chandelier.",
  },
  {
    title: "Residential façade linear",
    location: "UAE",
    tone: "warm",
    image: "/projects/web/facade-linear-residential.webp",
    alt: "Residential building façade with linear architectural lighting at dusk",
    description:
      "Completed Barq Lumi install — linear façade and soffit lighting on a residential elevation at dusk.",
  },
  {
    title: "Façade lighting",
    location: "Dubai tower",
    tone: "cool",
    description:
      "Architectural façade scheme for a high-rise elevation — linear and accent lighting coordinated with the building’s night profile.",
  },
  {
    title: "Emergency lighting",
    location: "Dubai tower",
    tone: "amber",
    description:
      "Emergency and exit lighting package for a multi-storey tower, integrated with the main electrical distribution.",
  },
  {
    title: "Tower / plaza lighting",
    location: "Al Qusais",
    tone: "warm",
    description:
      "Tower and plaza illumination balancing pedestrian comfort with clear architectural definition after dark.",
  },
  {
    title: "Interior lighting",
    location: "Residential / commercial",
    tone: "soft",
    description:
      "Interior lighting for residential and commercial spaces — from ceiling planes to feature walls and work areas.",
  },
  {
    title: "Wall washers / fountain lighting",
    location: "Mixed-use promenade",
    tone: "blue",
    description:
      "Wall washers and water-feature lighting for a mixed-use promenade, tuned for evening footfall and reflection.",
  },
  {
    title: "LED supply",
    location: "Al Ain / Al Mamzar",
    tone: "green",
    description:
      "LED luminaire supply for projects in the Al Ain and Al Mamzar areas — fittings matched to specification.",
  },
];
