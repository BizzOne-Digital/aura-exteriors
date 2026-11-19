import "server-only";
import { PageContent, SiteSettings, BookingAvailability, Service, GalleryImage, Testimonial, FAQ, SupplierLink, StoredUpload } from "@/models";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const URL_RE = /\/api\/uploads\/(products|gallery|pages|misc)\/([A-Za-z0-9._-]+)/g;

export function extractUploadUrls(value: unknown): Set<string> {
  const s = JSON.stringify(value ?? "");
  return new Set(Array.from(s.matchAll(URL_RE), (m) => m[0]));
}

/** Collects every upload URL referenced by any saved content. */
async function allReferencedUrls() {
  const sources = await Promise.all([
    PageContent.find({}, { data: 1 }).lean(),
    SiteSettings.find({}, { data: 1 }).lean(),
    BookingAvailability.find({}, { data: 1 }).lean(),
    Service.find({}).lean(),
    GalleryImage.find({}, { image: 1 }).lean(),
    Testimonial.find({}, { image: 1 }).lean(),
    FAQ.find({}, { answer: 1 }).lean(),
    SupplierLink.find({}, { logo: 1 }).lean(),
  ]);
  return extractUploadUrls(sources);
}

function parse(url: string) {
  const m = /\/api\/uploads\/([a-z]+)\/([A-Za-z0-9._-]+)$/.exec(url);
  return m ? { folder: m[1], filename: m[2] } : null;
}

/**
 * Call AFTER saving a change. Deletes stored files that were referenced before the change,
 * are no longer referenced anywhere, so shared images are never removed accidentally.
 */
export async function releaseUnreferenced(previous: Set<string>) {
  if (!previous.size) return 0;
  const live = await allReferencedUrls();
  let removed = 0;
  for (const url of previous) {
    if (live.has(url)) continue;
    const p = parse(url);
    if (!p) continue;
    const r = await StoredUpload.deleteOne(p);
    removed += r.deletedCount ?? 0;
  }
  return removed;
}

/** Deletes uploads that nothing references and that are older than one hour (avoids racing fresh, unsaved uploads). */
export async function cleanupOrphans() {
  const live = await allReferencedUrls();
  const cutoff = new Date(Date.now() - 3600_000);
  const candidates = await StoredUpload.find({ createdAt: { $lt: cutoff } }, { folder: 1, filename: 1 }).lean();
  const orphanIds = candidates.filter((c) => !live.has(`/api/uploads/${c.folder}/${c.filename}`)).map((c) => c._id);
  if (!orphanIds.length) return 0;
  const r = await StoredUpload.deleteMany({ _id: { $in: orphanIds } });
  return r.deletedCount ?? 0;
}
