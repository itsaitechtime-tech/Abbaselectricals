import type { Metadata, Viewport } from "next";
import { DM_Sans, Sora } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { otherGroups } from "@/lib/catalog";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { site } from "@/lib/site";
import "./globals.css";

/** Electrical / sanitary get a nav item only once they have products (lighting stays first). */
const extraNav = otherGroups.length
  ? [
      {
        href: otherGroups.length === 1 ? `/products/${otherGroups[0].slug}/` : "/products/#electrical-sanitary",
        match: otherGroups.map((g) => `/products/${g.slug}/`),
        label: otherGroups.some((g) => g.brandGroup === "sanitary")
          ? otherGroups.some((g) => g.brandGroup === "electrical")
            ? "Electrical & Sanitary"
            : "Sanitary"
          : "Electrical",
      },
    ]
  : [];

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Architectural Lighting · Sharjah, UAE`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · Architectural Lighting · Sharjah, UAE`,
    description: site.description,
    images: [{ url: "/images/stock/hero-living-cove.webp", width: 2400, height: 1600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Architectural Lighting · Sharjah, UAE`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmSans.variable} antialiased`}>
        <JsonLd />
        <div className="flex min-h-screen flex-col">
          <Header extraNav={extraNav} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
