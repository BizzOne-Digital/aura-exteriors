import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";
import { PageHero, SectionHeading, ServiceCard, JsonLd } from "@/components/shared/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { GalleryGrid } from "@/components/shared/GalleryGrid";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { getFaqs, getGallery, getPage, getService, getServices, getSettings } from "@/lib/data";
import { Occasions } from "@/components/home/Occasions";
import { SERVICE_SLUGS } from "@/lib/defaults";
import { siteUrl, telHref } from "@/lib/utils";

const FAQ_CATEGORY: Record<string, string> = {
  "roofline-lighting": "Roofline Lighting",
  "landscape-lighting": "Landscape Lighting",
  "exterior-improvements": "Exterior Improvements",
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return {};
  return { title: s.title, description: s.summary, alternates: { canonical: `/services/${s.slug}` }, openGraph: { images: [s.heroImage] } };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, all, faqs, gallery, settings, home] = await Promise.all([getService(slug), getServices(), getFaqs(), getGallery(), getSettings(), getPage("home")]);
  if (!service) notFound();
  const related = all.filter((s) => s.slug !== slug);
  const serviceFaqs = faqs.filter((f) => f.category === FAQ_CATEGORY[slug] || f.category === "General").slice(0, 6);
  const images = gallery.filter((g) => g.category === slug);
  const shownImages = (images.length >= 2 ? images : gallery).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.summary,
          provider: { "@type": "HomeAndConstructionBusiness", name: settings.siteName, telephone: settings.phone, url: siteUrl() },
        }}
      />
      <PageHero eyebrow="Our Services" title={service.title} intro={service.summary} image={service.heroImage || service.cardImage} imageAlt={`${service.title} at dusk`}>
        <Link href={`/pricing?service=${encodeURIComponent(service.title)}#quote`} className="btn btn-gold">
          Request a Quote <ArrowRight className="arrow h-4 w-4" />
        </Link>
        <a href={telHref(settings.phone)} className="btn btn-outline">
          <Phone className="h-4 w-4 text-gold" /> {settings.phone}
        </a>
      </PageHero>

      {/* Overview + benefits */}
      <section className="bg-night py-24 md:py-32">
        <div className="container-lux grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal direction="left">
            <p className="eyebrow mb-5">Overview</p>
            <h2 className="h-display text-[2.3rem] text-ivory sm:text-5xl">Designed around your home.</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-8 text-[1.08rem] leading-[1.9] text-muted">{service.description}</p>
            {service.details && <p className="mt-5 text-[1.08rem] leading-[1.9] text-muted">{service.details}</p>}
          </Reveal>
          <Reveal direction="right">
            <div className="card-lux p-8 md:p-10">
              <h3 className="font-serif text-3xl text-ivory">{slug === "exterior-improvements" ? "Services We Offer" : "Key Benefits"}</h3>
              <Stagger as="ul" className="mt-6 space-y-4">
                {service.benefits.map((b) => (
                  <StaggerItem as="li" key={b} className="flex items-start gap-3 text-ivory/90">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </section>

      {slug === "roofline-lighting" && <Occasions data={home.occasions} />}

      {shownImages.length > 0 && (
        <section className="bg-midnight py-24">
          <div className="container-lux">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeading eyebrow="Lighting Inspiration" title="A Closer Look" />
              <p className="text-sm text-muted/70">Illustrative imagery shown for design inspiration.</p>
            </div>
            <div className="mt-12">
              <GalleryGrid items={shownImages} variant="simple" />
            </div>
          </div>
        </section>
      )}

      {serviceFaqs.length > 0 && (
        <section className="bg-night py-24">
          <div className="container-lux grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="FAQ" title="Common Questions" />
            <FaqAccordion items={serviceFaqs} />
          </div>
        </section>
      )}

      {/* Quote CTA */}
      <section className="relative isolate overflow-hidden py-24">
        <Image src={service.cardImage} alt="" fill sizes="100vw" className="night-grade -z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-midnight/80" />
        <Reveal className="container-lux text-center">
          <h2 className="h-display mx-auto max-w-3xl text-4xl text-ivory sm:text-6xl">Request your personalized quote.</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted">Every home is different. Tell us about yours and we&apos;ll recommend the right approach.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/pricing?service=${encodeURIComponent(service.title)}#quote`} className="btn btn-gold">
              Request a Quote <ArrowRight className="arrow h-4 w-4" />
            </Link>
            <Link href={`/booking?service=${encodeURIComponent(service.title)}`} className="btn btn-outline">
              Book a Consultation
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      <section className="bg-night py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Explore More" title="Related Services" />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {related.map((s) => (
              <StaggerItem key={s.slug}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
