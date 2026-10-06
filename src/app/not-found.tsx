import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Section";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found. Browse Barq Lumi products or contact us.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-ink pb-24 pt-40 text-white md:pt-48">
      <Container>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-white/60">
          The page may have moved. Try the product catalogue or get in touch and we will help.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products/" className="btn btn-light">
            Browse products
          </Link>
          <Link href="/contact/" className="btn btn-outline-light">
            Contact us
          </Link>
        </div>
      </Container>
    </section>
  );
}
