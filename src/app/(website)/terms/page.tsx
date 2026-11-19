import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms for using the Aura Exteriors website.", alternates: { canonical: "/terms" } };

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <section className="bg-night pb-24 pt-40">
      <div className="container-lux max-w-3xl">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="h-display text-5xl text-ivory sm:text-6xl">Terms &amp; Conditions</h1>
        <div className="prose-lux mt-10">
          <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
          <h2>Website Content</h2>
          <p>Content on this website is provided for general information. Some photography is illustrative and used for design inspiration; it does not necessarily depict projects completed by {s.siteName}.</p>
          <h2>Quotes &amp; Consultations</h2>
          <p>Submitting a quote request or consultation request does not create a contract. Pricing is provided only through a personalized quote. Consultation times are confirmed by our team.</p>
          <h2>Financing</h2>
          <p>Financing is offered by a third-party provider and is subject to that provider&apos;s terms, credit review, and approval.</p>
          <h2>Third-Party Links</h2>
          <p>We are not responsible for the content or practices of external websites linked from this site.</p>
          <h2>Contact</h2>
          <p>Questions about these terms can be sent to {s.email}.</p>
        </div>
      </div>
    </section>
  );
}
