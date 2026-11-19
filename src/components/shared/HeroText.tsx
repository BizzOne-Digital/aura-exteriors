"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Inner-page hero copy with staggered line reveal. Text stays visible (opacity ≥ 0) for SEO; motion only transforms. */
export function HeroText({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  const words = title.split(" ");
  return (
    <div className="max-w-4xl">
      <motion.p className="eyebrow mb-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
        {eyebrow}
      </motion.p>
      <h1 className="h-display text-[2.7rem] text-ivory sm:text-6xl lg:text-[4.6rem]">
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.045 }}
              >
                {w}
              </motion.span>
            </span>{" "}
          </span>
        ))}
      </h1>
      {intro && (
        <motion.p
          className="mt-7 max-w-2xl text-lg leading-relaxed text-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}
