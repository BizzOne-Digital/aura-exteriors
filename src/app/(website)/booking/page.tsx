import type { Metadata } from "next";
import Image from "next/image";
import { Check, Mail, Phone } from "lucide-react";
import { BookingForm, type BookingConfig } from "@/components/booking/BookingForm";
import { readAvailability, getSettings } from "@/lib/data";
import { defaultAvailability } from "@/lib/defaults";
import { todayInTz, addDays } from "@/lib/booking";
import { IMG } from "@/lib/images";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Request a consultation with Aura Exteriors for outdoor lighting or exterior home improvements.",
  alternates: { canonical: "/booking" },
};

// Availability changes with every booking and with the date itself, so render per request.
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const [a, settings] = await Promise.all([readAvailability().catch(() => defaultAvailability), getSettings()]);
  const today = todayInTz(a.timeZone);
  const cfg: BookingConfig = {
    mode: a.enabled ? "scheduled" : "request",
    timeZone: a.timeZone,
    today,
    maxDate: addDays(today, a.maxAdvanceDays),
    days: a.days,
    blockedDates: a.blockedDates,
  };

  return (
    <section className="bg-night pt-[84px] lg:pt-[94px]">
      <div className="grid lg:min-h-[calc(100svh-94px)] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: image + info */}
        <aside className="relative isolate overflow-hidden px-5 py-16 md:px-12 lg:sticky lg:top-[94px] lg:h-[calc(100svh-94px)] lg:py-20">
          <Image src={IMG.heroDusk} alt="Home with warm roofline lighting at dusk" fill priority sizes="(max-width:1024px) 100vw, 45vw" className="night-grade -z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/80 to-midnight/40" />
          <div className="flex h-full flex-col justify-end">
            <p className="eyebrow mb-4">Free Consultation</p>
            <h1 className="h-display text-[2.7rem] text-ivory sm:text-6xl">Book Your Consultation.</h1>
            <p className="mt-5 max-w-md leading-relaxed text-muted">
              Meet with our team to discuss your goals, your property, and how thoughtful lighting and exterior improvements can transform your home.
            </p>
            <ul className="mt-8 space-y-3">
              {["Discuss your vision and priorities", "Review your property's requirements", "Receive a personalized recommendation"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ivory/90">
                  <Check className="h-4 w-4 text-gold" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm sm:flex-row sm:gap-8">
              <a href={telHref(settings.phone)} className="flex items-center gap-2 text-ivory hover:text-champagne">
                <Phone className="h-4 w-4 text-gold" /> {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 break-all text-ivory hover:text-champagne">
                <Mail className="h-4 w-4 text-gold" /> {settings.email}
              </a>
            </div>
          </div>
        </aside>

        {/* Right: booking interface */}
        <div className="px-5 py-14 md:px-12 lg:py-20">
          <div className="mx-auto max-w-2xl">
            <BookingForm cfg={cfg} />
          </div>
        </div>
      </div>
    </section>
  );
}
