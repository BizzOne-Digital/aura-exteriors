import Link from "next/link";
import { CalendarDays, Mail, Phone, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/shared/Icons";
import { telHref, isSafeExternalUrl } from "@/lib/utils";
import type { SiteSettingsData } from "@/lib/defaults";
import type { SupplierItem } from "@/lib/data";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book Online" },
];

export function Footer({
  settings,
  services,
  suppliers,
}: {
  settings: SiteSettingsData;
  services: { slug: string; title: string }[];
  suppliers: SupplierItem[];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-midnight">
      <div className="container-lux py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Aura Exteriors home">
              <Logo logoUrl={settings.logoUrl} />
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-muted">{settings.footerDescription}</p>
            <div className="mt-6 flex gap-3">
              {isSafeExternalUrl(settings.facebookUrl) && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Aura Exteriors on Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold transition hover:bg-gold hover:text-midnight">
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {isSafeExternalUrl(settings.instagramUrl) && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Aura Exteriors on Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold transition hover:bg-gold hover:text-midnight">
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="eyebrow">Quick Links</h2>
            <ul className="mt-5 space-y-3">
              {QUICK.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.95rem] text-ivory/80 transition hover:text-champagne">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow">Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-[0.95rem] text-ivory/80 transition hover:text-champagne">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            {suppliers.length > 0 && (
              <>
                <h2 className="eyebrow mt-8">Our Suppliers</h2>
                <ul className="mt-4 space-y-2">
                  {suppliers.map((s) => (
                    <li key={s._id}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-ivory/70 hover:text-champagne">
                        {s.name} <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div>
            <h2 className="eyebrow">Get in Touch</h2>
            <ul className="mt-5 space-y-4">
              <li>
                <a href={telHref(settings.phone)} className="flex items-center gap-3 text-ivory/90 hover:text-champagne">
                  <Phone className="h-4 w-4 text-gold" /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all text-ivory/90 hover:text-champagne">
                  <Mail className="h-4 w-4 shrink-0 text-gold" /> {settings.email}
                </a>
              </li>
            </ul>
            <Link href="/booking" className="btn btn-gold mt-7">
              <CalendarDays className="h-4 w-4" /> Book a Consultation
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted/80 md:flex-row">
          <p>
            &copy; {year} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-champagne">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-champagne">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
