import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Gem, Hammer, Sparkles } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { NeverLadder, Occasions } from "@/components/home/Occasions";
import { Reveal, MaskReveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { SectionHeading, ServiceCard, ImageCta, JsonLd } from "@/components/shared/sections";
import { FinancingBanner, FinancingCallout } from "@/components/shared/Financing";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { GalleryGrid } from "@/components/shared/GalleryGrid";
import { getFaqs, getFinancing, getGallery, getPage, getServices, getSettings, getTestimonials } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

const WHY_ICONS = [Compass, Sparkles, Gem, Hammer];

export default async function HomePage() {
  const [home, services, financing, faqs, gallery, settings, testimonials] = await Promise.all([
    getPage("home"),
    getServices(),
    getFinancing(),
    getFaqs(),
    getGallery(),
    getSettings(),
    getTestimonials(),
  ]);
  const featuredFaqs = (faqs.filter((f) => f.featured).length ? faqs.filter((f) => f.featured) : faqs).slice(0, 6);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          name: settings.siteName,
          url: siteUrl(),
          telephone: settings.phone,
          email: settings.email,
          description: settings.seoDescription,
          ...(settings.address ? { address: settings.address } : {}),
        }}
      />
      <Hero hero={home.hero} trust={home.trust} />

      {/* Our Services */}
      <section className="relative bg-night py-20 md:py-28">
        <div className="container-lux grid gap-12 lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-14">
          <Reveal direction="left" className="lg:pt-4">
            <h2 className="h-display text-[2.6rem] text-ivory md:text-[3.1rem]">{home.services.heading}</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 text-[1.05rem] leading-relaxed text-muted">{home.services.description}</p>
            <Link href="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:text-champagne">
              All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <div className="bg-night pb-20 md:pb-28">
        <FinancingBanner f={financing} />
      </div>

      <NeverLadder data={home.ladder} />
      <Occasions data={home.occasions} />

      {/* About */}
      <section className="relative overflow-hidden bg-midnight py-24 md:py-32">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <MaskReveal className="relative aspect-[4/5] overflow-hidden rounded-[10px] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src={home.about.image} alt="Luxury residence with warm architectural lighting at twilight" fill sizes="(max-width:1024px) 100vw, 50vw" className="night-grade object-cover" />
            </MaskReveal>
            <Reveal delay={0.6} className="absolute -bottom-8 right-4 rounded-[10px] border border-line bg-night/90 px-7 py-6 backdrop-blur-md sm:-right-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Nearly</p>
              <p className="font-serif text-6xl leading-none text-champagne">40</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Years of Experience</p>
            </Reveal>
            <span aria-hidden="true" className="absolute -left-4 -top-4 h-28 w-28 border-l border-t border-gold/60" />
          </div>
          <Reveal direction="right">
            <p className="eyebrow mb-5">{home.about.label}</p>
            <h2 className="h-display text-[2.5rem] text-ivory sm:text-5xl lg:text-[3.4rem]">{home.about.heading}</h2>
            <span className="gold-rule mt-7" />
            <p className="mt-7 text-[1.05rem] leading-[1.9] text-muted">{home.about.body}</p>
            <Link href="/about" className="btn btn-outline mt-9">
              {home.about.button} <ArrowRight className="arrow h-4 w-4 text-gold" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why choose */}
      <section className="relative bg-navy py-24 md:py-32">
        <div className="container-lux">
          <SectionHeading eyebrow={home.why.label} title={home.why.heading} align="center" />
          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.why.items.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <StaggerItem key={i}>
                  <div className="group card-lux relative h-full overflow-hidden p-8 transition duration-500 hover:-translate-y-2 hover:border-gold/70 hover:shadow-[0_30px_60px_-30px_rgba(217,173,87,0.35)]">
                    <span aria-hidden="true" className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full bg-gold/10 blur-2xl transition duration-700 group-hover:translate-x-0 group-hover:translate-y-0" />
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-line text-gold transition duration-500 group-hover:border-gold group-hover:bg-gold/10">
                      <Icon className="h-6 w-6" strokeWidth={1.4} />
                    </span>
                    <h3 className="mt-7 font-serif text-[1.6rem] leading-tight text-ivory">{item.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{item.text}</p>
                    <span className="mt-6 block h-px w-10 bg-gold/60 transition-all duration-500 group-hover:w-20" />
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <ImageCta
        title={home.transform.heading}
        text={home.transform.text}
        image={home.transform.image}
        imageAlt="Contemporary home glowing with architectural lighting at twilight"
        primary={{ label: home.transform.button, href: "/services" }}
        align="left"
      />

      {/* Process */}
      <section className="bg-night py-24 md:py-32">
        <div className="container-lux">
          <SectionHeading eyebrow={home.process.label} title={home.process.heading} align="center" />
          <div className="mt-16 md:mt-20">
            <Process steps={home.process.steps} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-midnight py-24 md:py-32">
          <div className="container-lux">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow={home.gallery.label} title={home.gallery.heading} />
              <Reveal>
                <p className="max-w-xs text-sm text-muted/80 md:text-right">{home.gallery.note}</p>
              </Reveal>
            </div>
            <div className="mt-14">
              <GalleryGrid items={gallery.slice(0, 6)} />
            </div>
          </div>
        </section>
      )}

      {/* Testimonials: rendered only when genuine, client-approved testimonials exist */}
      {testimonials.length > 0 && (
        <section className="bg-navy py-24">
          <div className="container-lux">
            <SectionHeading eyebrow="Testimonials" title="In Our Clients' Words" align="center" />
            <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <StaggerItem key={t._id}>
                  <figure className="card-lux h-full p-8">
                    <blockquote className="font-serif text-xl leading-relaxed text-ivory">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-6 text-sm text-gold">
                      {t.name}
                      {t.location && <span className="text-muted"> · {t.location}</span>}
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <FinancingCallout f={financing} />

      {/* FAQ preview */}
      <section className="bg-night py-24 md:py-32">
        <div className="container-lux grid gap-14 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading eyebrow="FAQ" title={home.faq.heading} />
            <Reveal delay={0.2}>
              <Link href="/faq" className="btn btn-outline mt-10">
                View All FAQs <ArrowRight className="arrow h-4 w-4 text-gold" />
              </Link>
            </Reveal>
          </div>
          <Reveal>
            <FaqAccordion items={featuredFaqs} />
          </Reveal>
        </div>
      </section>

      <ImageCta
        title={home.finalCta.heading}
        text={home.finalCta.text}
        image={home.finalCta.image}
        imageAlt="Modern residence with warm exterior lighting at night"
        primary={{ label: home.finalCta.button, href: "/booking" }}
        phone={settings.phone}
      />
    </>
  );
}
