import "server-only";
import { z } from "zod";
import type { Model } from "mongoose";
import {
  Service,
  GalleryImage,
  Testimonial,
  FAQ,
  SupplierLink,
  Booking,
  ContactInquiry,
  QuoteRequest,
  BOOKING_STATUSES,
  INQUIRY_STATUSES,
  QUOTE_STATUSES,
} from "@/models";
import { PAGE_DEFAULTS, defaultSettings, defaultFinancing, defaultAvailability } from "./defaults";
import { deepMerge, isPlainObject } from "./utils";
import { isValidTimeZone } from "./booking";

/** Images may be our own uploads or https URLs. */
export const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine(
    (v) => v === "" || v.startsWith("/api/uploads/") || /^https:\/\//.test(v) || /^\/[A-Za-z0-9._-]+\.(webp|png|jpe?g|gif|svg|avif)$/i.test(v),
    "Must be an uploaded image, a site image, or https URL",
  );
const httpUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+$/.test(v), "Must be a full URL starting with https://");
const text = (max = 300) => z.string().trim().max(max);

type CollectionConfig = {
  model: Model<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema?: z.ZodObject; // create/update content schema
  patchSchema?: z.ZodObject; // lead status updates
  canCreate: boolean;
  canDelete: boolean;
  sort: Record<string, 1 | -1>;
  orderable: boolean;
  searchFields?: string[];
  statusField?: string;
};

export const COLLECTIONS: Record<string, CollectionConfig> = {
  services: {
    model: Service,
    schema: z.object({
      title: text(160).min(2),
      shortTitle: text(80),
      summary: text(600),
      description: text(5000),
      benefits: z.array(text(300)).max(20),
      details: text(5000),
      cardImage: imageUrl,
      heroImage: imageUrl,
    }),
    canCreate: false,
    canDelete: false,
    sort: { order: 1 },
    orderable: true,
  },
  gallery: {
    model: GalleryImage,
    schema: z.object({
      image: imageUrl.refine((v) => v !== "", "Image is required"),
      alt: text(200).min(3, "Describe the image for accessibility"),
      caption: text(120),
      category: text(60),
      active: z.boolean(),
    }),
    canCreate: true,
    canDelete: true,
    sort: { order: 1 },
    orderable: true,
  },
  testimonials: {
    model: Testimonial,
    schema: z.object({
      name: text(120).min(2),
      location: text(120),
      quote: text(2000).min(5),
      rating: z.coerce.number().int().min(1).max(5),
      image: imageUrl,
      approved: z.boolean(),
    }),
    canCreate: true,
    canDelete: true,
    sort: { order: 1 },
    orderable: true,
  },
  faqs: {
    model: FAQ,
    schema: z.object({
      question: text(300).min(5),
      answer: text(5000).min(5),
      category: text(60),
      featured: z.boolean(),
      active: z.boolean(),
    }),
    canCreate: true,
    canDelete: true,
    sort: { order: 1 },
    orderable: true,
  },
  suppliers: {
    model: SupplierLink,
    schema: z.object({
      name: text(120).min(2),
      url: httpUrl.refine((v) => v !== "", "URL is required"),
      description: text(300),
      logo: imageUrl,
      active: z.boolean(),
    }),
    canCreate: true,
    canDelete: true,
    sort: { order: 1 },
    orderable: true,
  },
  bookings: {
    model: Booking,
    patchSchema: z.object({ status: z.enum(BOOKING_STATUSES).optional(), adminNotes: text(3000).optional() }),
    canCreate: false,
    canDelete: true,
    sort: { createdAt: -1 },
    orderable: false,
    searchFields: ["name", "email", "phone", "reference", "address"],
    statusField: "status",
  },
  inquiries: {
    model: ContactInquiry,
    patchSchema: z.object({ status: z.enum(INQUIRY_STATUSES).optional() }),
    canCreate: false,
    canDelete: true,
    sort: { createdAt: -1 },
    orderable: false,
    searchFields: ["name", "email", "subject", "message"],
    statusField: "status",
  },
  quotes: {
    model: QuoteRequest,
    patchSchema: z.object({ status: z.enum(QUOTE_STATUSES).optional(), adminNotes: text(3000).optional() }),
    canCreate: false,
    canDelete: true,
    sort: { createdAt: -1 },
    orderable: false,
    searchFields: ["name", "email", "phone", "location", "description"],
    statusField: "status",
  },
};

/* ---------------- Singletons ---------------- */

const IMAGE_KEY = /(image|logo|Image|Logo|logoUrl)$/;
const URL_KEY = /(Url|url)$/;

/** Validates a nested content object against its defaults' shape, enforcing safe URLs for image/link fields. */
function sanitizeAgainst(base: unknown, input: unknown, path = ""): { value: unknown; errors: string[] } {
  const errors: string[] = [];
  const walk = (b: unknown, v: unknown, p: string): unknown => {
    if (Array.isArray(b)) {
      if (!Array.isArray(v)) return b;
      const tmpl = b[0] ?? (typeof v[0] === "string" ? "" : v[0]);
      return v.slice(0, 50).map((item, i) => walk(tmpl, item, `${p}[${i}]`));
    }
    if (isPlainObject(b)) {
      const src = isPlainObject(v) ? v : {};
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(b)) out[k] = walk(b[k], src[k], p ? `${p}.${k}` : k);
      return out;
    }
    if (typeof b === "boolean") return typeof v === "boolean" ? v : b;
    if (typeof b === "number") {
      const n = Number(v);
      return Number.isFinite(n) ? n : b;
    }
    if (typeof b === "string") {
      if (typeof v !== "string") return b;
      const s = v.trim().slice(0, 6000);
      const key = p.split(".").pop() ?? "";
      if (IMAGE_KEY.test(key) && !imageUrl.safeParse(s).success) errors.push(`${p}: must be an uploaded image or https URL`);
      else if (URL_KEY.test(key) && !httpUrl.safeParse(s).success) errors.push(`${p}: must be a full URL starting with https://`);
      return s;
    }
    return b;
  };
  const value = walk(base, input, path);
  return { value, errors };
}

export const SINGLETONS = {
  "page:home": { kind: "page", key: "home", defaults: PAGE_DEFAULTS.home },
  "page:about": { kind: "page", key: "about", defaults: PAGE_DEFAULTS.about },
  "page:services": { kind: "page", key: "services", defaults: PAGE_DEFAULTS.services },
  "page:pricing": { kind: "page", key: "pricing", defaults: PAGE_DEFAULTS.pricing },
  settings: { kind: "settings", key: "site", defaults: defaultSettings },
  financing: { kind: "settings", key: "financing", defaults: defaultFinancing },
  availability: { kind: "availability", key: "default", defaults: defaultAvailability },
} as const;
export type SingletonName = keyof typeof SINGLETONS;

export function validateSingleton(name: SingletonName, input: unknown) {
  const def = SINGLETONS[name].defaults;
  const { value, errors } = sanitizeAgainst(def, input);
  const merged = deepMerge(def, value) as Record<string, unknown>;

  if (name === "settings") {
    const s = merged as typeof defaultSettings;
    if (s.email && !z.string().email().safeParse(s.email).success) errors.push("email: invalid email address");
    if (s.notifyEmail && !z.string().email().safeParse(s.notifyEmail).success) errors.push("notifyEmail: invalid email address");
    if (s.mapEmbedUrl && !s.mapEmbedUrl.startsWith("https://www.google.com/maps/embed"))
      errors.push("mapEmbedUrl: must be a Google Maps embed URL (https://www.google.com/maps/embed?...)");
  }
  if (name === "availability") {
    const a = merged as typeof defaultAvailability;
    const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!isValidTimeZone(a.timeZone)) errors.push("timeZone: unknown IANA time zone (e.g. America/New_York)");
    if (!hhmm.test(a.startTime) || !hhmm.test(a.endTime)) errors.push("startTime/endTime: use 24-hour HH:mm");
    else if (a.startTime >= a.endTime) errors.push("endTime: must be after start time");
    a.slotMinutes = Math.min(480, Math.max(15, Math.round(a.slotMinutes)));
    a.capacityPerSlot = Math.min(50, Math.max(1, Math.round(a.capacityPerSlot)));
    a.minNoticeHours = Math.min(720, Math.max(0, Math.round(a.minNoticeHours)));
    a.maxAdvanceDays = Math.min(365, Math.max(1, Math.round(a.maxAdvanceDays)));
    a.blockedDates = Array.from(new Set(a.blockedDates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))).sort();
  }
  return { value: merged, errors };
}
