"use client";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function GalleryAdmin() {
  return (
    <CollectionManager
      collection="gallery"
      title="Gallery"
      description="Upload, replace, reorder, hide, or remove gallery images. The first six appear on the homepage."
      folder="gallery"
      primary="caption"
      secondary="alt"
      imageField="image"
      activeField="active"
      notice="Gallery is labeled on the website as Lighting Inspiration. Only describe images as completed Aura Exteriors projects once they are authentic project photos."
      defaults={{ image: "", alt: "", caption: "", category: "", active: true }}
      fields={[
        { name: "image", label: "Image", type: "image", required: true },
        { name: "alt", label: "Image Description (alt text)", type: "text", required: true, hint: "Describe the image for screen readers and search engines" },
        { name: "caption", label: "Caption", type: "text" },
        { name: "category", label: "Service Category", type: "select", options: ["", "roofline-lighting", "landscape-lighting", "exterior-improvements"], hint: "Shows the image on that service page" },
        { name: "active", label: "Visible on website", type: "boolean" },
      ]}
    />
  );
}
