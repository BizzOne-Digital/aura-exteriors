"use client";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function SuppliersAdmin() {
  return (
    <CollectionManager
      collection="suppliers"
      title="Supplier Links"
      description="External supplier websites shown in the site footer when enabled."
      folder="misc"
      primary="name"
      secondary="url"
      imageField="logo"
      activeField="active"
      notice="Only list suppliers the company actually works with and has approved for display."
      defaults={{ name: "", url: "https://", description: "", logo: "", active: true }}
      fields={[
        { name: "name", label: "Supplier Name", type: "text", required: true },
        { name: "url", label: "Website URL", type: "url", required: true },
        { name: "description", label: "Short Description", type: "text" },
        { name: "logo", label: "Logo (optional)", type: "image" },
        { name: "active", label: "Show on website", type: "boolean" },
      ]}
    />
  );
}
