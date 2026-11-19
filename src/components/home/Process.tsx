"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Process({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div className="relative">
      {/* Connecting gold line (desktop horizontal) */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[8%] right-[8%] top-[46px] hidden h-px origin-left bg-gradient-to-r from-gold/0 via-gold to-gold/0 lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.8, ease: EASE }}
      />
      {/* Vertical line (mobile) */}
      <motion.span
        aria-hidden="true"
        className="absolute bottom-10 left-[46px] top-10 w-px origin-top bg-gradient-to-b from-gold via-gold/60 to-gold/0 lg:hidden"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.8, ease: EASE }}
      />
      <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
        {steps.map((s, i) => (
          <motion.li
            key={i}
            className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.18 }}
          >
            <span className="relative z-10 grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full border border-line bg-night font-serif text-[2.1rem] text-champagne shadow-[0_0_0_8px_var(--color-night)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-4 lg:pt-8">
              <h3 className="font-serif text-[1.65rem] leading-tight text-ivory">{s.title}</h3>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-muted">{s.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
