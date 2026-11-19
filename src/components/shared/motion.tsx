"use client";

import { motion, useReducedMotion, useScroll, useTransform, MotionConfig, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type Direction = "up" | "left" | "right" | "scale" | "none";
const offsets: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 36 },
  left: { x: -48 },
  right: { x: 48 },
  scale: { scale: 0.94 },
  none: {},
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const M = motion[as];
  return (
    <M className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const M = motion[as];
  return (
    <M className={className} variants={staggerChild}>
      {children}
    </M>
  );
}

/** Image wrapper that reveals with a clip-path mask. */
export function MaskReveal({ children, className, from = "left" }: { children: ReactNode; className?: string; from?: "left" | "right" | "bottom" }) {
  const start = from === "left" ? "inset(0 100% 0 0)" : from === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
  return (
    <motion.div
      className={className}
      initial={{ clipPath: start }}
      whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Subtle vertical parallax for background layers (disabled for reduced motion). */
export function Parallax({ children, className, strength = 60 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-strength, strength]);
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[80px] inset-x-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Thin gold line drawn when scrolled into view. */
export function DrawLine({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block bg-gradient-to-r from-gold/0 via-gold to-gold/0", className)}
      style={{ originX: 0, originY: 0 }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
    />
  );
}
