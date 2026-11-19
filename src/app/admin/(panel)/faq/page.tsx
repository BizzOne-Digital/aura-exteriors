"use client";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { FAQ_CATEGORIES } from "@/lib/defaults";

export default function FaqAdmin() {
  return (
    <CollectionManager
      collection="faqs"
      title="FAQ"
      description="Add, edit, reorder, and categorize questions. Featured questions appear on the homepage; categories power the FAQ page filters and service pages."
      primary="question"
      secondary="category"
      activeField="active"
      defaults={{ question: "", answer: "", category: "General", featured: false, active: true }}
      fields={[
        { name: "question", label: "Question", type: "text", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "category", label: "Category", type: "select", options: FAQ_CATEGORIES },
        { name: "featured", label: "Feature on homepage", type: "boolean" },
        { name: "active", label: "Visible on website", type: "boolean" },
      ]}
    />
  );
}
