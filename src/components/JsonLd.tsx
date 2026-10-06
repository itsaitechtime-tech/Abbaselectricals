import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ElectricalContractor"],
    name: site.legalName,
    alternateName: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email.display,
    telephone: site.tel.href.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Muweilah",
      addressLocality: "Sharjah",
      addressRegion: "Sharjah",
      postalCode: site.address.postalCode,
      addressCountry: "AE",
    },
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
    sameAs: [site.instagram.href, site.whatsapp.href],
    description: site.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
