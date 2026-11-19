import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
import { SERVICE_SLUGS } from "@/lib/defaults";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/about", "/services", "/pricing", "/faq", "/contact", "/booking", "/privacy-policy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...SERVICE_SLUGS.map((s) => ({ url: `${base}/services/${s}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
