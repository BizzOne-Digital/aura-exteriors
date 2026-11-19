import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Phone } from "lucide-react";
import { Reveal, Parallax } from "./motion";
import { HeroText } from "./HeroText";
import { cn, telHref } from "@/lib/utils";
import type { ServiceData } from "@/lib/defaults";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="h-display text-[2.4rem] text-ivory sm:text-5xl lg:text-[3.6rem]">{title}</h2>
      <span className={cn("gold-rule mt-6", align === "center" && "mx-auto")} />
      {description && <p className="mt-6 text-[1.05rem] leading-relaxed text-muted">{description}</p>}
    </Reveal>
  );
}

/** Cinematic hero for inner pages. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
  short = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  children?: React.ReactNode;
  short?: boolean;
}) {
  return (
    <section className={cn("relative isolate flex items-end overflow-hidden bg-midnight", short ? "min-h-[62svh]" : "min-h-[78svh]")}>
      <div className="absolute inset-0 -z-10 animate-[hero-zoom_2.4s_cubic-bezier(0.22,1,0.36,1)_both]">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="night-grade object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/75 to-midnight/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-transparent to-midnight/40" />
      <div className="container-lux pb-16 pt-40 md:pb-24">
        <HeroText eyebrow={eyebrow} title={title} intro={intro} />
        {children && <div className="mt-9 flex flex-wrap gap-4">{children}</div>}
      </div>
    </section>
  );
}

export function ServiceCard({ service, priority = false, className }: { service: ServiceData; priority?: boolean; className?: string }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative block aspect-[4/3] overflow-hidden rounded-[10px] border border-line bg-navy transition duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-[0_30px_60px_-30px_rgba(217,173,87,0.45)] sm:aspect-[5/4]",
        className,
      )}
    >
      <Image
        src={service.cardImage}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 30vw"
        className="night-grade object-cover transition duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold to-champagne transition-transform duration-700 group-hover:scale-x-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div>
          <h3 className="text-[1.2rem] font-semibold leading-snug text-ivory">{service.title}</h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-muted opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
            {service.summary}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold text-gold transition duration-500 group-hover:bg-gold group-hover:text-midnight">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

/** Full-width image band with heading + CTA. */
export function ImageCta({
  title,
  text,
  image,
  imageAlt,
  primary,
  phone,
  align = "center",
}: {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  primary: { label: string; href: string };
  phone?: string;
  align?: "center" | "left";
}) {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-40">
      <Parallax className="-z-10">
        <Image src={image} alt={imageAlt} fill sizes="100vw" className="night-grade object-cover" />
      </Parallax>
      <div className={cn("absolute inset-0 -z-10", align === "center" ? "bg-midnight/65" : "bg-gradient-to-r from-midnight via-midnight/70 to-transparent")} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-transparent to-night" />
      <div className={cn("container-lux", align === "center" && "text-center")}>
        <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <h2 className="h-display text-[2.6rem] text-ivory sm:text-6xl lg:text-7xl">{title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{text}</p>
          <div className={cn("mt-10 flex flex-col gap-4 sm:flex-row", align === "center" && "justify-center")}>
            <Link href={primary.href} className="btn btn-gold">
              {primary.label} <ArrowRight className="arrow h-4 w-4" />
            </Link>
            {phone && (
              <a href={telHref(phone)} className="btn btn-outline">
                <Phone className="h-4 w-4 text-gold" /> Call {phone}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ConsultationBand({ phone, title = "Ready to see your home in a new light?" }: { phone: string; title?: string }) {
  return (
    <section className="relative overflow-hidden border-y border-line bg-navy py-16">
      <div aria-hidden="true" className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-lux relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Reveal>
          <p className="eyebrow mb-3">Free Consultation</p>
          <h2 className="h-display max-w-2xl text-4xl text-ivory md:text-5xl">{title}</h2>
        </Reveal>
        <Reveal direction="right" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/booking" className="btn btn-gold">
            <CalendarDays className="h-4 w-4" /> Book a Consultation
          </Link>
          <a href={telHref(phone)} className="btn btn-outline">
            <Phone className="h-4 w-4 text-gold" /> {phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
