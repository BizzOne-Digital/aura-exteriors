import Link from "next/link";
import { CalendarCheck, CalendarClock, CalendarDays, Mail, Receipt, TriangleAlert } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Booking, ContactInquiry, QuoteRequest } from "@/models";
import { readAvailability } from "@/lib/data";
import { isEmailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const fmt = (d: Date) => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default async function Dashboard() {
  await connectDB();
  const [total, pending, confirmed, inquiries, newInquiries, newQuotes, recentB, recentI, recentQ, availability] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "confirmed" }),
    ContactInquiry.countDocuments(),
    ContactInquiry.countDocuments({ status: "new" }),
    QuoteRequest.countDocuments({ status: "new" }),
    Booking.find({}, { name: 1, service: 1, status: 1, createdAt: 1, reference: 1 }).sort({ createdAt: -1 }).limit(6).lean(),
    ContactInquiry.find({}, { name: 1, subject: 1, status: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(6).lean(),
    QuoteRequest.find({}, { name: 1, service: 1, status: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(6).lean(),
    readAvailability(),
  ]);

  const stats = [
    { label: "Total Bookings", value: total, icon: CalendarDays, href: "/admin/bookings" },
    { label: "Pending Bookings", value: pending, icon: CalendarClock, href: "/admin/bookings", warn: pending > 0 },
    { label: "Confirmed Bookings", value: confirmed, icon: CalendarCheck, href: "/admin/bookings" },
    { label: "Contact Inquiries", value: inquiries, sub: `${newInquiries} new`, icon: Mail, href: "/admin/inquiries", warn: newInquiries > 0 },
    { label: "New Quote Requests", value: newQuotes, icon: Receipt, href: "/admin/quotes", warn: newQuotes > 0 },
  ];

  type Row = { _id: unknown; name: string; status: string; createdAt: Date };
  const activity = [
    ...(recentB as Row[]).map((r) => ({ ...r, kind: "Booking", detail: (r as Row & { service: string }).service, href: "/admin/bookings" })),
    ...(recentI as Row[]).map((r) => ({ ...r, kind: "Inquiry", detail: (r as Row & { subject: string }).subject, href: "/admin/inquiries" })),
    ...(recentQ as Row[]).map((r) => ({ ...r, kind: "Quote", detail: (r as Row & { service: string }).service, href: "/admin/quotes" })),
  ]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 10);

  const warnings = [
    !availability.enabled && { text: "Online scheduling is off. Visitors can send consultation requests with a preferred date, but cannot pick confirmed time slots.", href: "/admin/availability", cta: "Set availability" },
    !isEmailConfigured() && { text: "Email (SMTP) is not configured. Submissions are saved here, but no email notifications are sent.", href: "/admin/settings", cta: "See settings" },
  ].filter(Boolean) as { text: string; href: string; cta: string }[];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Business overview and recent activity.</p>

      {warnings.length > 0 && (
        <div className="mt-6 space-y-2">
          {warnings.map((w) => (
            <div key={w.text} className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              <p className="flex-1">{w.text}</p>
              <Link href={w.href} className="font-semibold underline">
                {w.cta}
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-slate-400 group-hover:text-amber-600" />
              {s.warn && <span className="h-2 w-2 rounded-full bg-amber-500" aria-label="Needs attention" />}
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">
              {s.label}
              {s.sub && <span className="text-amber-700"> · {s.sub}</span>}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 px-5 py-4 font-bold text-slate-900">Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No submissions yet. New bookings, inquiries, and quote requests will appear here.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {activity.map((a) => (
              <li key={String(a._id)}>
                <Link href={a.href} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50">
                  <span className="w-16 shrink-0 text-xs font-semibold uppercase text-slate-400">{a.kind}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">{a.name}</span>
                    <span className="block truncate text-xs text-slate-500">{a.detail}</span>
                  </span>
                  <span className="hidden text-xs text-slate-400 sm:block">{fmt(a.createdAt)}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">{a.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
