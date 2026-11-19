"use client";

import { useState } from "react";
import { ObjectEditor } from "@/components/admin/ObjectEditor";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "page:home", label: "Homepage" },
  { key: "page:about", label: "About Page" },
  { key: "page:services", label: "Services Page" },
  { key: "page:pricing", label: "Pricing Page" },
];

const HINTS: Record<string, string> = {
  "hero.highlight": "Italic gold word at the start of the headline",
  "hero.headline": "Rest of the headline after the highlighted word",
  trust: "The four trust indicators under the hero (first item shows the laurel badge)",
  "process.steps": "Edit these to match the company's actual workflow",
  "gallery.note": "Keep this note while gallery images are illustrative",
  factors: "One factor per line",
};

export default function ContentAdmin() {
  const [tab, setTab] = useState(TABS[0].key);
  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn("shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition", tab === t.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ObjectEditor
        key={tab}
        endpoint={tab}
        title={`${TABS.find((t) => t.key === tab)?.label} Content`}
        description="Edit headings, text, buttons, and images. Changes appear on the live website as soon as you save."
        hints={HINTS}
        folder="pages"
      />
    </div>
  );
}
