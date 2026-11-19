import type { Metadata } from "next";
import { PageHero, ConsultationBand, JsonLd } from "@/components/shared/sections";
import { Reveal } from "@/components/shared/motion";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { getFaqs, getSettings } from "@/lib/data";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about permanent roofline lighting, landscape lighting, exterior improvements, financing, and booking a consultation with Aura Exteriors.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        }}
      />
      <PageHero eyebrow="FAQ" title="Questions, Answered." intro="Everything you need to know about our lighting and exterior services. Can't find your answer? We're happy to help." image={IMG.villaPoolDusk} imageAlt="Illuminated courtyard at dusk" short />
      <section className="bg-night py-20 md:py-28">
        <Reveal className="container-lux max-w-4xl">
          <FaqAccordion items={faqs} searchable categories />
        </Reveal>
      </section>
      <ConsultationBand phone={settings.phone} title="Still have questions? Let's talk." />
    </>
  );
}
