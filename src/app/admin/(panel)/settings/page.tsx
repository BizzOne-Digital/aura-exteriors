import { ObjectEditorClient, PasswordForm, CleanupButton } from "./client";
import { isEmailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const email = isEmailConfigured();
  return (
    <div className="space-y-10">
      <ObjectEditorClient />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Email Notifications</h2>
        <p className="mt-2 text-sm text-slate-600">
          Status:{" "}
          <span className={email ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>{email ? "SMTP configured" : "Not configured"}</span>
        </p>
        <p className="mt-2 text-sm text-slate-500">
          SMTP credentials are set securely as environment variables on the server (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM), never stored in the database. Without them, every submission is still saved and visible in this portal. Admin notifications go to the Notify Email above (or the contact email).
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Change Password</h2>
          <PasswordForm />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Image Storage</h2>
          <p className="mt-2 text-sm text-slate-500">
            Images are stored in the database so they persist across deployments. Replaced or removed images are cleaned up automatically when nothing else uses them. Use this to remove any leftover uploads that were never saved.
          </p>
          <CleanupButton />
        </div>
      </section>
    </div>
  );
}
