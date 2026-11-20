import "server-only";
import { unstable_cache } from "next/cache";
import { connectDB, isDbConfigured } from "./mongodb";
import {
  PAGE_DEFAULTS,
  type PageKey,
  defaultSettings,
  defaultFinancing,
  defaultAvailability,
  defaultServices,
  defaultFaqs,
  defaultGallery,
  type ServiceData,
} from "./defaults";
import { deepMerge } from "./utils";
import { PageContent, SiteSettings, BookingAvailability, Service, FAQ, GalleryImage, Testimonial, SupplierLink } from "@/models";

export const CONTENT_TAG = "site-content";

/** Seeds editable collections with starter content the first time the database is used. */
let seedPromise: Promise<void> | null = null;
export async function ensureSeeded() {
  if (!isDbConfigured()) return;
  if (!seedPromise) {
    seedPromise = (async () => {
      await connectDB();
      const meta = await SiteSettings.findOne({ key: "meta" }).lean();
      if ((meta?.data as { seeded?: boolean } | undefined)?.seeded) return;
      if ((await Service.countDocuments()) === 0) await Service.insertMany(defaultServices);
      if ((await FAQ.countDocuments()) === 0) await FAQ.insertMany(defaultFaqs.map((f, i) => ({ ...f, order: i })));
      if ((await GalleryImage.countDocuments()) === 0)
        await GalleryImage.insertMany(defaultGallery.map((g, i) => ({ ...g, order: i })));
      await SiteSettings.updateOne({ key: "meta" }, { $set: { "data.seeded": true } }, { upsert: true });
    })().catch((e) => {
      seedPromise = null;
      throw e;
    });
  }
  return seedPromise;
}

async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    await connectDB();
    await ensureSeeded();
    return await fn();
  } catch (err) {
    console.error("[data] falling back to defaults:", (err as Error).message);
    return fallback;
  }
}

/** Changes whenever the built-in defaults change, so stale persisted cache entries are never reused after a deploy. */
const DEFAULTS_VERSION = (() => {
  const s = JSON.stringify([PAGE_DEFAULTS, defaultSettings, defaultFinancing, defaultAvailability, defaultServices, defaultFaqs, defaultGallery]);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
})();

const cached = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, key: string) =>
  unstable_cache(fn, [key, DEFAULTS_VERSION], { tags: [CONTENT_TAG], revalidate: 3600 });

export const getSettings = cached(
  () =>
    safe(defaultSettings, async () => {
      const doc = await SiteSettings.findOne({ key: "site" }).lean();
      return deepMerge(defaultSettings, doc?.data);
    }),
  "settings",
);

export const getFinancing = cached(
  () =>
    safe(defaultFinancing, async () => {
      const doc = await SiteSettings.findOne({ key: "financing" }).lean();
      return deepMerge(defaultFinancing, doc?.data);
    }),
  "financing",
);

/** Availability is read uncached by booking APIs; this cached version is for page rendering only. */
export async function readAvailability() {
  if (!isDbConfigured()) return defaultAvailability;
  await connectDB();
  const doc = await BookingAvailability.findOne({ key: "default" }).lean();
  return deepMerge(defaultAvailability, doc?.data);
}
export const getAvailability = cached(() => safe(defaultAvailability, readAvailability), "availability");

export const getPage = cached(
  <K extends PageKey>(key: K) =>
    safe(PAGE_DEFAULTS[key], async () => {
      const doc = await PageContent.findOne({ key }).lean();
      return deepMerge(PAGE_DEFAULTS[key], doc?.data);
    }),
  "page",
) as <K extends PageKey>(key: K) => Promise<(typeof PAGE_DEFAULTS)[K]>;

export const getServices = cached(
  (): Promise<ServiceData[]> =>
    safe(defaultServices as ServiceData[], async () => {
      const docs = await Service.find({}, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ order: 1 }).lean();
      if (!docs.length) return defaultServices as ServiceData[];
      return docs.map((d) => ({ ...d, _id: String(d._id) })) as unknown as ServiceData[];
    }),
  "services",
);

export async function getService(slug: string) {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export type FaqItem = { _id?: string; question: string; answer: string; category: string; featured: boolean };
export const getFaqs = cached(
  (): Promise<FaqItem[]> =>
    safe(defaultFaqs as FaqItem[], async () => {
      const docs = await FAQ.find({ active: true }, { question: 1, answer: 1, category: 1, featured: 1 }).sort({ order: 1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) })) as unknown as FaqItem[];
    }),
  "faqs",
);

export type GalleryItem = { _id?: string; image: string; alt: string; caption: string; category: string };
export const getGallery = cached(
  (): Promise<GalleryItem[]> =>
    safe(defaultGallery as GalleryItem[], async () => {
      const docs = await GalleryImage.find({ active: true }, { image: 1, alt: 1, caption: 1, category: 1 }).sort({ order: 1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) })) as unknown as GalleryItem[];
    }),
  "gallery",
);

export type TestimonialItem = { _id: string; name: string; location: string; quote: string; image: string; rating: number; createdAt?: string };
export const getTestimonials = cached(
  (): Promise<TestimonialItem[]> =>
    safe([] as TestimonialItem[], async () => {
      const docs = await Testimonial.find({ approved: true }, { name: 1, location: 1, quote: 1, image: 1, rating: 1, createdAt: 1 }).sort({ order: 1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id), rating: d.rating ?? 5, createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined })) as unknown as TestimonialItem[];
    }),
  "testimonials",
);

export type SupplierItem = { _id: string; name: string; url: string; description: string; logo: string };
export const getSuppliers = cached(
  (): Promise<SupplierItem[]> =>
    safe([] as SupplierItem[], async () => {
      const docs = await SupplierLink.find({ active: true }, { name: 1, url: 1, description: 1, logo: 1 }).sort({ order: 1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) })) as unknown as SupplierItem[];
    }),
  "suppliers",
);
