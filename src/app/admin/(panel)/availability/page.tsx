"use client";
import { ObjectEditor } from "@/components/admin/ObjectEditor";

export default function AvailabilityAdmin() {
  return (
    <ObjectEditor
      endpoint="availability"
      title="Booking Availability"
      description="When scheduling is enabled, visitors pick from real open time slots. When disabled, they submit a consultation request with a preferred date instead."
      hints={{
        enabled: "Enable online time-slot scheduling",
        timeZone: "IANA time zone, e.g. America/New_York or America/Chicago",
        startTime: "First appointment start, 24-hour HH:mm (e.g. 09:00)",
        endTime: "Last appointment must end by this time (e.g. 17:00)",
        slotMinutes: "Appointment length in minutes",
        capacityPerSlot: "How many consultations can be booked at the same time",
        minNoticeHours: "Minimum hours of notice before an appointment",
        maxAdvanceDays: "How far ahead visitors can book",
        days: "Days you accept consultations",
        blockedDates: "Dates to block (holidays, time off). One per line as YYYY-MM-DD.",
      }}
      sections={{ days: "Booking Days", blockedDates: "Blocked Dates" }}
    />
  );
}
