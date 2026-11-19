"use client";
import { LeadsManager } from "@/components/admin/LeadsManager";

export default function QuotesPage() {
  return (
    <LeadsManager
      cfg={{
        collection: "quotes",
        title: "Quote Requests",
        description: "Personalized quote requests from the Pricing page. Track each one from new to won or lost.",
        statuses: ["new", "contacted", "quoted", "won", "lost", "archived"],
        hasNotes: true,
        title1: (l) => String(l.name),
        title2: (l) => `${l.service} · ${l.location}`,
        detail: [
          ["name", "Name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["contactMethod", "Prefers"],
          ["service", "Service"],
          ["location", "Location"],
          ["description", "Project"],
        ],
      }}
    />
  );
}
