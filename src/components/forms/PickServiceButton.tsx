"use client";

import { ArrowRight } from "lucide-react";

/** Preselects a service in the quote form on the same page and scrolls to it. */
export function PickServiceButton({ service, label = "Request a Quote" }: { service: string; label?: string }) {
  return (
    <button
      type="button"
      className="btn btn-outline w-full"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("aura:pick-service", { detail: service }));
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label} <ArrowRight className="arrow h-4 w-4 text-gold" />
    </button>
  );
}
