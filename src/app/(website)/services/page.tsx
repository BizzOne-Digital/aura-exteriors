import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero, ConsultationBand } from "@/components/shared/sections";
import { Reveal, MaskReveal } from "@/components/shared/motion";
import { getPage, getServices, getSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description: "Low voltage permanent roofline lighting, integrated landscape lighting, and premium exterior home improvements by Aura Exteriors.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [page, services, settings] = await Promise.all([getPage("services"), getServices(), getSettings()]);
  return (
    <>
      <PageHero eyebrow={page.hero.label} title={page.hero.heading} intro={page.hero.intro} image={page.hero.image} imageAlt="Contemporary home with warm exterior lighting at dusk">
        <a href="#services-list" className="btn btn-outline">
          Explore Services <ArrowRight className="arrow h-4 w-4 text-gold" />
        </a>
      </PageHero>

      {/* Index strip */}
      <nav aria-label="Services" className="sticky top-[72px] z-30 border-b border-line bg-night/90 backdrop-blur-lg">
        <ul className="container-lux flex gap-6 overflow-x-auto py-4 text-sm [scrollbar-width:none]">
          {services.map((s, i) => (
            <li key={s.slug} className="shrink-0">
              <a href={`#${s.slug}`} className="flex items-center gap-2 text-ivory/80 transition hover:text-champagne">
                <span className="font-serif text-gold">{String(i + 1).padStart(2, "0")}</span> {s.shortTitle || s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div id="services-list" className="bg-night">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} className={cn("scroll-mt-32 py-20 md:py-28", i % 2 === 1 && "bg-midnight")}>
            <div className="container-lux grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className={cn("relative", i % 2 === 1 && "lg:order-2")}>
                <MaskReveal from={i % 2 === 1 ? "right" : "left"} className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-line">
                  <Image src={s.heroImage || s.cardImage} alt={`${s.title} example`} fill sizes="(max-width:1024px) 100vw, 50vw" className="night-grade object-cover" />
                </MaskReveal>
                <span className="absolute -top-6 left-6 font-serif text-[6rem] leading-none text-gold/20 md:text-[8rem]" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <Reveal direction={i % 2 === 1 ? "left" : "right"}>
                <p className="eyebrow mb-4">Service {String(i + 1).padStart(2, "0")}</p>
                <h2 className="h-display text-[2.3rem] text-ivory sm:text-5xl">{s.title}</h2>
                <span className="gold-rule mt-6" />
                <p className="mt-6 leading-[1.85] text-muted">{s.description}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {s.benefits.slice(0, 4).map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[0.95rem] text-ivory/90">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-gold" /> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/services/${s.slug}`} className="btn btn-outline">
                    Learn More <ArrowRight className="arrow h-4 w-4 text-gold" />
                  </Link>
                  <Link href={`/booking?service=${encodeURIComponent(s.title)}`} className="btn btn-gold">
                    Request a Consultation
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <ConsultationBand phone={settings.phone} />
    </>
  );
}
