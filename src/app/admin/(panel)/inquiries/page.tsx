"use client";
import { LeadsManager } from "@/components/admin/LeadsManager";

export default function InquiriesPage() {
  return (
    <LeadsManager
      cfg={{
        collection: "inquiries",
        title: "Contact Inquiries",
        description: "Messages from the contact form. Opening a new message marks it as read.",
        statuses: ["new", "read", "archived"],
        autoRead: true,
        title1: (l) => String(l.name),
        title2: (l) => `${l.subject} · ${l.email}`,
        detail: [
          ["name", "Name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["service", "Service"],
          ["subject", "Subject"],
          ["message", "Message"],
        ],
      }}
    />
  );
}
