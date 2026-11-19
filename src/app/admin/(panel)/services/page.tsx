"use client";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function ServicesAdmin() {
  return (
    <CollectionManager
      collection="services"
      title="Services"
      description="Edit the three core services. Changes update the homepage cards, Services page, and each service detail page."
      canCreate={false}
      canDelete={false}
      folder="pages"
      primary="title"
      secondary="summary"
      imageField="cardImage"
      defaults={{}}
      fields={[
        { name: "title", label: "Service Name", type: "text", required: true },
        { name: "shortTitle", label: "Short Name", type: "text", hint: "Used in compact navigation" },
        { name: "summary", label: "Summary", type: "textarea", hint: "One or two sentences shown on cards and at the top of the service page" },
        { name: "description", label: "Overview", type: "textarea" },
        { name: "details", label: "Additional Details", type: "textarea" },
        { name: "benefits", label: "Key Benefits", type: "lines", hint: "One benefit per line" },
        { name: "cardImage", label: "Card Image", type: "image" },
        { name: "heroImage", label: "Service Page Hero Image", type: "image" },
      ]}
    />
  );
}
