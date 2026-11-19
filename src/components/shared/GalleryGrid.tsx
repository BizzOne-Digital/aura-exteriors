"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { _id?: string; image: string; alt: string; caption: string };

// Asymmetric 12-col layout pattern, repeats every 6 images.
const SPANS = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

export function GalleryGrid({ items, variant = "masonry" }: { items: Item[]; variant?: "masonry" | "simple" }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  if (!items.length) return null;

  return (
    <>
      <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", variant === "masonry" ? "md:auto-rows-[260px] md:grid-cols-12" : "lg:grid-cols-3")}>
        {items.map((item, i) => (
          <motion.li
            key={item._id ?? item.image + i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={cn("relative aspect-[4/3] md:aspect-auto", variant === "masonry" ? SPANS[i % SPANS.length] : "md:aspect-[4/3]")}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block h-full w-full overflow-hidden rounded-[10px] border border-line"
              aria-label={`View larger: ${item.alt}`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="night-grade object-cover transition duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-left">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-ivory">{item.caption}</span>
                <span className="grid h-9 w-9 scale-75 place-items-center rounded-full border border-gold text-gold opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {index !== null && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
                className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight/95 p-4 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-[75vh] w-full max-w-6xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image src={items[index].image} alt={items[index].alt} fill sizes="100vw" className="object-contain" />
                  <figcaption className="absolute -bottom-10 left-0 right-0 text-center text-sm text-muted">
                    {items[index].caption} · {index + 1} / {items.length}
                  </figcaption>
                </motion.figure>
                <button type="button" onClick={close} aria-label="Close image viewer" className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-line text-ivory hover:border-gold hover:text-gold">
                  <X className="h-5 w-5" />
                </button>
                {items.length > 1 && (
                  <>
                    <button type="button" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-midnight/60 text-ivory hover:border-gold hover:text-gold">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next image" className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-midnight/60 text-ivory hover:border-gold hover:text-gold">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
