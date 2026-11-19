"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CalendarDays, Gem, ShieldCheck, Wrench } from "lucide-react";
import { LaurelBadge } from "@/components/shared/Icons";
import type { HomeContent } from "@/lib/defaults";

const EASE = [0.22, 1, 0.36, 1] as const;
const TRUST_ICONS = [null, Gem, Wrench, ShieldCheck];

export function Hero({ hero, trust }: { hero: HomeContent["hero"]; trust: HomeContent["trust"] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "30%"]);

  // Split headline into three visual lines for the line-by-line reveal (matches the reference composition).
  const words = hero.headline.split(" ");
  const lines = [words.slice(0, 3), words.slice(3, 7), words.slice(7)].map((w) => w.join(" ")).filter(Boolean);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-midnight pt-[84px] lg:pt-[94px]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20 will-change-transform">
        <div className="absolute inset-0 animate-[hero-zoom_2.6s_cubic-bezier(0.22,1,0.36,1)_both]">
          <Image
            src={hero.image}
            alt="Luxury home illuminated with warm roofline and landscape lighting at dusk"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[70%_center] md:object-[center_40%]"
          />
        </div>
      </motion.div>
      {/* Layered overlays keep the left side dark for text while letting the home glow on the right. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/80 to-midnight/0 md:via-midnight/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/10 to-midnight/50" />
      <div className="absolute inset-y-0 left-0 -z-10 w-full bg-[radial-gradient(ellipse_at_20%_40%,rgba(3,11,20,0.75),transparent_60%)]" />

      <motion.div style={{ y: textY }} className="container-lux flex flex-1 items-center py-16 md:py-20">
        <div className="max-w-[640px]">
          <h1 className="h-display text-[2.85rem] leading-[1.05] text-ivory sm:text-[3.8rem] lg:text-[4.4rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }}>
                <motion.em
                  className="bg-gradient-to-r from-champagne to-gold bg-clip-text pr-2 font-semibold italic text-transparent"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.5 }}
                >
                  {hero.highlight}
                </motion.em>{" "}
                {lines[0]}
              </motion.span>
            </span>
            {lines.slice(1).map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.27 + i * 0.12 }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-7 max-w-[520px] text-[1.08rem] leading-relaxed text-ivory/85 md:text-[1.15rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          >
            {hero.description}
          </motion.p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}>
              <Link href="/contact?subject=Free%20Consultation" className="btn btn-gold w-full sm:w-auto">
                {hero.primaryCta} <ArrowRight className="arrow h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 1.02 }}>
              <Link href="/booking" className="btn btn-outline w-full sm:w-auto">
                <CalendarDays className="h-4 w-4 text-gold" /> {hero.secondaryCta}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        className="relative border-t border-white/5 bg-midnight/70 backdrop-blur-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.15 }}
      >
        <ul className="container-lux grid grid-cols-2 lg:grid-cols-4">
          {trust.slice(0, 4).map((t, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <li
                key={i}
                className={[
                  "flex items-center gap-4 py-6 lg:justify-center lg:py-7",
                  i % 2 === 1 ? "border-l border-white/10 pl-5 lg:pl-0" : "",
                  i >= 2 ? "border-t border-white/10 lg:border-t-0" : "",
                  i === 2 ? "lg:border-l" : "",
                ].join(" ")}
              >
                {Icon ? <Icon className="h-9 w-9 shrink-0 text-gold" strokeWidth={1.3} /> : <LaurelBadge className="h-12 w-[4.6rem] shrink-0" />}
                <p className="text-[0.92rem] leading-snug text-ivory/90 md:text-[1.02rem]">
                  {t.title}
                  <br />
                  {t.subtitle}
                </p>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </section>
  );
}
