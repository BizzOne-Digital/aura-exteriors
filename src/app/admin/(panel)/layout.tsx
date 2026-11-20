import { Sidebar } from "@/components/admin/Sidebar";
import { ToastProvider } from "@/components/admin/ui";
import { requireAdminPage } from "@/lib/auth";
import { Booking, ContactInquiry, QuoteRequest, Testimonial } from "@/models";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  const [pending, newInquiries, newQuotes, pendingReviews] = await Promise.all([
    Booking.countDocuments({ status: "pending" }),
    ContactInquiry.countDocuments({ status: "new" }),
    QuoteRequest.countDocuments({ status: "new" }),
    Testimonial.countDocuments({ approved: false, source: "website" }),
  ]);
  return (
    <ToastProvider>
      <Sidebar email={admin.email} counts={{ "/admin/bookings": pending, "/admin/inquiries": newInquiries, "/admin/quotes": newQuotes, "/admin/testimonials": pendingReviews }} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
