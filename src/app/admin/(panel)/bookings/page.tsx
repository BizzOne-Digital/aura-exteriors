"use client";
import { LeadsManager, formatBookingWhen } from "@/components/admin/LeadsManager";

export default function BookingsPage() {
  return (
    <LeadsManager
      cfg={{
        collection: "bookings",
        title: "Bookings",
        description: "Consultation bookings and requests. Cancelling a booking frees its time slot automatically.",
        statuses: ["pending", "confirmed", "completed", "cancelled"],
        dateFilter: true,
        hasNotes: true,
        title1: (l) => `${l.name} · ${l.reference}`,
        title2: (l) => `${formatBookingWhen(l)} · ${l.service}`,
        detail: [
          ["reference", "Reference"],
          ["__when", "Requested"],
          ["timeZone", "Time Zone"],
          ["mode", "Type"],
          ["name", "Name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["service", "Service"],
          ["address", "Property Address"],
          ["description", "Project"],
          ["notes", "Notes"],
        ],
      }}
    />
  );
}
