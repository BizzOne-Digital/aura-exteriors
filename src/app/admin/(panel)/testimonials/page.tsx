"use client";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function TestimonialsAdmin() {
  return (
    <CollectionManager
      collection="testimonials"
      title="Testimonials"
      description="Testimonials appear on the homepage only when marked Approved."
      folder="misc"
      primary="name"
      secondary="quote"
      imageField="image"
      activeField="approved"
      notice="Only add genuine testimonials from real customers, with their permission. Never publish edited or invented reviews."
      defaults={{ name: "", location: "", quote: "", image: "", approved: false }}
      fields={[
        { name: "name", label: "Customer Name", type: "text", required: true, hint: "As the customer approved it to appear (e.g. first name and last initial)" },
        { name: "location", label: "Location", type: "text" },
        { name: "quote", label: "Testimonial", type: "textarea", required: true },
        { name: "image", label: "Photo (optional)", type: "image" },
        { name: "approved", label: "Approved by client to publish", type: "boolean" },
      ]}
    />
  );
}
