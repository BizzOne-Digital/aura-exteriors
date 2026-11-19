"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { ObjectEditor } from "@/components/admin/ObjectEditor";
import { api } from "@/components/admin/api";
import { Btn, inputCls, useToast } from "@/components/admin/ui";

export function ObjectEditorClient() {
  return (
    <ObjectEditor
      endpoint="settings"
      title="Website Settings"
      description="Logo, contact details, social links, SEO, and notification preferences."
      folder="misc"
      hints={{
        logoUrl: "Upload the official logo to replace the temporary wordmark. Leave empty to keep the temporary logo.",
        address: "Optional. Only add a verified business address. The map appears on the Contact page only when both address and map URL are set.",
        mapEmbedUrl: "Google Maps embed URL (Share → Embed a map → copy the src link)",
        facebookUrl: "Shown in the footer when provided",
        notifyEmail: "Where new lead notifications are sent (defaults to the contact email)",
        sendCustomerConfirmations: "Email customers a confirmation copy when SMTP is configured",
        ogImage: "Image used when the site is shared on social media",
      }}
    />
  );
}

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/auth/password", { method: "POST", body: { current, next } });
      toast("success", "Password updated. Please sign in again.");
      setTimeout(() => (window.location.href = "/admin/login"), 1200);
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <div>
        <label htmlFor="pw-current" className="mb-1 block text-sm font-medium text-slate-700">
          Current password
        </label>
        <input id="pw-current" type="password" autoComplete="current-password" className={inputCls} value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>
      <div>
        <label htmlFor="pw-next" className="mb-1 block text-sm font-medium text-slate-700">
          New password (12+ characters)
        </label>
        <input id="pw-next" type="password" autoComplete="new-password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} />
      </div>
      <Btn type="submit" disabled={busy || !current || next.length < 12}>
        {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Update Password
      </Btn>
    </form>
  );
}

export function CleanupButton() {
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  return (
    <Btn
      className="mt-4"
      variant="secondary"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const r = await api<{ removed: number }>("/api/admin/uploads/cleanup", { method: "POST" });
          toast("success", r.removed ? `Removed ${r.removed} unused image(s).` : "No unused images found.");
        } catch (e) {
          toast("error", (e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Clean Up Unused Images
    </Btn>
  );
}
