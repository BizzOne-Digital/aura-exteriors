import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, Phone, User } from "lucide-react";
import { PageHero } from "@/components/shared/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSettings } from "@/lib/data";
import { IMG } from "@/lib/images";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aura Exteriors about outdoor lighting and exterior home improvements. Call (762) 763-7647 or send us a message.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const s = await getSettings();
  const cards = [
    { icon: Phone, label: "Call Us", value: s.phone, href: telHref(s.phone) },
    { icon: Mail, label: "Email Us", value: s.email, href: `mailto:${s.email}` },
    { icon: User, label: "Your Contact", value: s.contactPerson, href: undefined },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's Talk About Your Home." intro="Questions, ideas, or ready to begin? Reach out and our team will be in touch." image={IMG.altModernNight} imageAlt="Modern home exterior glowing at night" short />

      <section className="relative z-10 -mt-12 bg-transparent">
        <Stagger className="container-lux grid gap-4 md:grid-cols-3">
          {cards.map((c) => {
            const inner = (
              <>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/60 text-gold transition group-hover:bg-gold group-hover:text-midnight">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted">{c.label}</span>
                  <span className="mt-1 block break-words text-lg text-ivory">{c.value}</span>
                </span>
              </>
            );
            return (
              <StaggerItem key={c.label}>
                {c.href ? (
                  <a href={c.href} className="group card-lux flex h-full items-center gap-4 bg-night/95 p-6 backdrop-blur transition hover:border-gold">
                    {inner}
                  </a>
                ) : (
                  <div className="group card-lux flex h-full items-center gap-4 bg-night/95 p-6 backdrop-blur">{inner}</div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="bg-night py-20 md:py-28">
        <div className="container-lux grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal direction="left">
            <p className="eyebrow mb-4">Send a Message</p>
            <h2 className="h-display text-4xl text-ivory sm:text-5xl">We&apos;d love to hear about your project.</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-muted">
              Share a few details about your home and what you have in mind. Prefer to pick a time? Book a consultation online.
            </p>
            <Link href="/booking" className="btn btn-outline mt-8">
              <CalendarDays className="h-4 w-4 text-gold" /> Book a Consultation
            </Link>
            {s.mapEmbedUrl && s.address && (
              <div className="mt-10 overflow-hidden rounded-[10px] border border-line">
                <iframe title={`Map of ${s.address}`} src={s.mapEmbedUrl} className="h-64 w-full grayscale" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <p className="p-4 text-sm text-muted">{s.address}</p>
              </div>
            )}
          </Reveal>
          <Reveal direction="right">
            <div className="card-lux p-6 sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
