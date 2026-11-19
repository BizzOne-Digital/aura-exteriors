import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Reveal, Parallax } from "./motion";
import { isSafeExternalUrl } from "@/lib/utils";
import type { FinancingData } from "@/lib/defaults";

/** Button goes to the configured Hearth URL; until one is set, it routes to an inquiry instead of inventing a link. */
function FinancingButton({ f, className = "btn btn-gold" }: { f: FinancingData; className?: string }) {
  if (isSafeExternalUrl(f.url)) {
    return (
      <a href={f.url} target="_blank" rel="noopener noreferrer" className={className}>
        {f.buttonLabel} <ArrowRight className="arrow h-4 w-4" />
      </a>
    );
  }
  return (
    <Link href="/contact?subject=Financing%20Inquiry" className={className}>
      Ask About Financing <ArrowRight className="arrow h-4 w-4" />
    </Link>
  );
}

function ProviderMark({ f }: { f: FinancingData }) {
  if (f.logoUrl) {
    return (
      <span className="relative block h-14 w-44">
        <Image src={f.logoUrl} alt={`${f.providerName} logo`} fill sizes="176px" className="object-contain" />
      </span>
    );
  }
  // Neutral text mark: the official Hearth logo is only shown once an approved asset is uploaded.
  return (
    <span className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-ivory text-midnight">
        <Landmark className="h-5 w-5" />
      </span>
      <span className="text-[1.8rem] font-semibold tracking-tight text-ivory">{f.providerName}</span>
    </span>
  );
}

export function FinancingBanner({ f }: { f: FinancingData }) {
  if (!f.enabled) return null;
  return (
    <Reveal className="container-lux">
      <div className="relative overflow-hidden rounded-xl border border-line bg-[linear-gradient(110deg,#0b1a2e_0%,#10294a_50%,#0b1a2e_100%)] px-6 py-8 md:px-12">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
          <div className="lg:border-r lg:border-white/10 lg:pr-12">
            <ProviderMark f={f} />
          </div>
          <div>
            <h2 className="font-serif text-[1.9rem] leading-tight text-ivory md:text-[2.1rem]">{f.heading}</h2>
            <p className="mt-2 text-muted">{f.text}</p>
          </div>
          <FinancingButton f={f} />
        </div>
      </div>
    </Reveal>
  );
}

export function FinancingCallout({ f }: { f: FinancingData }) {
  if (!f.enabled) return null;
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-32">
      <Parallax className="-z-10" strength={40}>
        <Image src={f.calloutImage} alt="" fill sizes="100vw" className="night-grade object-cover" />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/30" />
      <div className="container-lux">
        <Reveal direction="left" className="max-w-2xl">
          <p className="eyebrow mb-4">Financing Through {f.providerName}</p>
          <h2 className="h-display text-[2.6rem] text-ivory sm:text-6xl">{f.calloutHeading}</h2>
          <p className="mt-6 text-lg text-muted">{f.calloutText}</p>
          <div className="mt-9">
            <FinancingButton f={f} />
          </div>
          <p className="mt-8 max-w-xl border-l border-gold/60 pl-4 text-xs leading-relaxed text-muted/80">{f.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function FinancingInfo({ f }: { f: FinancingData }) {
  if (!f.enabled) return null;
  return (
    <div className="card-lux p-8 md:p-10">
      <p className="eyebrow mb-3">Financing</p>
      <h3 className="font-serif text-3xl text-ivory">{f.heading}</h3>
      <p className="mt-3 text-muted">{f.text}</p>
      <div className="mt-6">
        <FinancingButton f={f} />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted/80">{f.disclaimer}</p>
    </div>
  );
}
