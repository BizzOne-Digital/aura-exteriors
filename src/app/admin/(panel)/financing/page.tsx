"use client";
import { ObjectEditor } from "@/components/admin/ObjectEditor";

export default function FinancingAdmin() {
  return (
    <ObjectEditor
      endpoint="financing"
      title="Financing Settings"
      description="Controls the Hearth financing banner, the homepage financing section, and the Pricing page financing card."
      folder="misc"
      hints={{
        enabled: "Show financing sections on the website",
        url: "Your Hearth financing link. Until this is set, the button sends visitors to the contact form instead.",
        logoUrl: "Upload the official Hearth logo only if you have approval to use it. Otherwise a neutral text mark is shown.",
        disclaimer: "Shown under the financing section. Do not add rates, payments, or approval promises unless provided by Hearth.",
      }}
    />
  );
}
