"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = { _id?: string; question: string; answer: string; category: string };

export function FaqAccordion({ items, searchable = false, categories = false }: { items: Faq[]; searchable?: boolean; categories?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const baseId = useId();

  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))], [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) => (cat === "All" || i.category === cat) && (!q || i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)),
    );
  }, [items, query, cat]);

  return (
    <div>
      {(searchable || categories) && (
        <div className="mb-10 space-y-6">
          {searchable && (
            <label className="relative block">
              <span className="sr-only">Search questions</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(null);
                }}
                placeholder="Search questions…"
                className="field !min-h-14 !pl-12 text-lg"
              />
            </label>
          )}
          {categories && cats.length > 2 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCat(c);
                    setOpen(null);
                  }}
                  aria-pressed={cat === c}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    cat === c ? "border-gold bg-gold text-midnight" : "border-line text-ivory/80 hover:border-gold hover:text-champagne",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="card-lux p-8 text-center text-muted">No questions match your search. Try different words or contact us directly.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {filtered.map((item, i) => {
            const isOpen = open === i;
            const id = `${baseId}-${i}`;
            return (
              <li key={item._id ?? item.question}>
                <h3>
                  <button
                    type="button"
                    id={`${id}-btn`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={cn("font-serif text-[1.35rem] leading-snug transition-colors md:text-[1.55rem]", isOpen ? "text-champagne" : "text-ivory group-hover:text-champagne")}>
                      {item.question}
                    </span>
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition duration-500", isOpen ? "rotate-45 border-gold bg-gold text-midnight" : "border-line text-gold group-hover:border-gold")}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-panel`}
                      role="region"
                      aria-labelledby={`${id}-btn`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-7 pr-12 leading-relaxed text-muted">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
