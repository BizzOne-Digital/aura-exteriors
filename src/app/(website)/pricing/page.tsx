import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/shared/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PickServiceButton } from "@/components/forms/PickServiceButton";
import { FinancingInfo } from "@/components/shared/Financing";
import { getFinancing, getPage, getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing & Personalized Quotes",
  description: "Every home is unique. Request a personalized quote for roofline lighting, landscape lighting, or exterior home improvements from Aura Exteriors.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [page, services, financing] = await Promise.all([getPage("pricing"), getServices(), getFinancing()]);
  return (
    <>
      <PageHero eyebrow={page.hero.label} title={page.hero.heading} intro={page.hero.intro} image={page.hero.image} imageAlt="Courtyard glowing with landscape lighting">
        <a href="#quote" className="btn btn-gold">
          Request a Personalized Quote <ArrowRight className="arrow h-4 w-4" />
        </a>
      </PageHero>

      {/* What shapes your quote */}
      <section className="border-b border-line bg-midnight py-12">
        <div className="container-lux flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="eyebrow shrink-0">What shapes your investment</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {page.factors.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[0.95rem] text-ivory/85">
                <Check className="h-4 w-4 text-gold" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service inquiry cards */}
      <section className="bg-night py-24 md:py-28">
        <div className="container-lux">
          <SectionHeading eyebrow="Request a Quote" title="Choose Your Service" align="center" description="Select a service to start your personalized quote. No fixed packages, just a plan tailored to your home." />
          <Stagger className="mt-16 grid gap-6 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <article className="group card-lux flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1 hover:border-gold/70">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={s.cardImage} alt="" fill sizes="(max-width:1024px) 100vw, 33vw" className="night-grade object-cover transition duration-[1.2s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-night to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <h3 className="font-serif text-[1.7rem] leading-tight text-ivory">{s.title}</h3>
                    <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>
                    <p className="mb-6 mt-6 border-t border-line pt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Custom quote</p>
                    <PickServiceButton service={s.title} />
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="bg-navy py-24 md:py-28">
        <div className="container-lux">
          <SectionHeading eyebrow="Simple & Transparent" title="How Our Quote Process Works" align="center" />
          <Stagger as="ol" className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {page.steps.map((s, i) => (
              <StaggerItem as="li" key={i} className="relative rounded-[10px] border border-line bg-night/60 p-8">
                <span className="font-serif text-5xl text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-2xl text-ivory">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Form + financing */}
      <section id="quote" className="scroll-mt-24 bg-night py-24 md:py-32">
        <div className="container-lux grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <div className="card-lux p-6 sm:p-10">
              <p className="eyebrow mb-3">Personalized Quote</p>
              <h2 className="h-display mb-8 text-4xl text-ivory sm:text-5xl">Tell us about your project.</h2>
              <QuoteForm />
            </div>
          </Reveal>
          <Reveal direction="right" className="space-y-6">
            <FinancingInfo f={financing} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
