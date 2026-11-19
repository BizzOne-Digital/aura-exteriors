import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, Gem, Hammer, Sparkles } from "lucide-react";
import { PageHero, SectionHeading, ConsultationBand } from "@/components/shared/sections";
import { Reveal, MaskReveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { getPage, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Nearly 40 years of outdoor and landscape lighting experience. Learn about Aura Exteriors' commitment to thoughtful design, premium products, and expert installation.",
  alternates: { canonical: "/about" },
};

const ICONS = [Compass, Gem, Hammer, Sparkles];

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getPage("about"), getSettings()]);
  return (
    <>
      <PageHero eyebrow={about.hero.label} title={about.hero.heading} image={about.hero.image} imageAlt="Grand residence illuminated at twilight">
        <Link href="/booking" className="btn btn-gold">
          Schedule a Consultation <ArrowRight className="arrow h-4 w-4" />
        </Link>
      </PageHero>

      {/* Story */}
      <section className="bg-night py-24 md:py-32">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal direction="left">
            <p className="eyebrow mb-5">{about.story.label}</p>
            <h2 className="h-display text-[2.4rem] text-ivory sm:text-5xl">{about.story.heading}</h2>
            <span className="gold-rule mt-7" />
            <p className="mt-8 font-serif text-[1.55rem] leading-[1.55] text-ivory/90 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.6rem] first-letter:leading-[0.85] first-letter:text-gold">
              {about.story.body}
            </p>
          </Reveal>
          <div className="relative">
            <MaskReveal from="right" className="relative aspect-[4/5] overflow-hidden rounded-[10px]">
              <Image src={about.story.image} alt="Home with warm roofline lighting at dusk" fill sizes="(max-width:1024px) 100vw, 45vw" className="night-grade object-cover" />
            </MaskReveal>
            <span aria-hidden="true" className="absolute -bottom-5 -right-5 h-32 w-32 border-b border-r border-gold/60" />
          </div>
        </div>
      </section>

      {/* Philosophy: full-bleed editorial */}
      <section className="relative overflow-hidden bg-midnight">
        <div className="grid lg:grid-cols-2">
          <MaskReveal className="relative min-h-[420px] lg:min-h-[640px]">
            <Image src={about.philosophy.image} alt="Stone outdoor living space glowing at sunset" fill sizes="(max-width:1024px) 100vw, 50vw" className="night-grade object-cover" />
          </MaskReveal>
          <div className="flex items-center px-5 py-20 md:px-16 lg:py-28">
            <Reveal direction="right" className="max-w-xl">
              <p className="eyebrow mb-5">{about.philosophy.label}</p>
              <h2 className="h-display text-[2.4rem] text-ivory sm:text-5xl">{about.philosophy.heading}</h2>
              <p className="mt-8 text-[1.05rem] leading-[1.9] text-muted">{about.philosophy.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-navy py-24 md:py-32">
        <div className="container-lux">
          <SectionHeading eyebrow="What Guides Us" title={about.commitments.heading} align="center" />
          <Stagger className="mt-16 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.commitments.items.map((c, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <StaggerItem key={i} className="group bg-navy p-9 transition duration-500 hover:bg-night">
                  <Icon className="h-8 w-8 text-gold transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.3} />
                  <h3 className="mt-6 font-serif text-[1.6rem] text-ivory">{c.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Reasons */}
      <section className="bg-night py-24 md:py-32">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <MaskReveal className="relative aspect-[5/4] overflow-hidden rounded-[10px]">
              <Image src={about.reasons.image} alt="Courtyard with landscape lighting at dusk" fill sizes="(max-width:1024px) 100vw, 50vw" className="night-grade object-cover" />
            </MaskReveal>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="The Aura Experience" title={about.reasons.heading} />
            <Stagger as="ul" className="mt-10 space-y-4">
              {about.reasons.items.map((r, i) => (
                <StaggerItem as="li" key={i} className="flex items-start gap-4 border-b border-line/60 pb-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold text-gold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[1.02rem] text-ivory/90">{r}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <ConsultationBand phone={settings.phone} title="Let's discuss what's possible for your home." />
    </>
  );
}
