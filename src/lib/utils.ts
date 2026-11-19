export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^(\d{10})$/, "+1$1")}`;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function isSafeExternalUrl(url: string | undefined | null) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Merge stored partial content onto defaults. Arrays from storage replace defaults entirely. */
export function deepMerge<T>(base: T, over: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(over)) return (over === undefined || over === null ? base : (over as T));
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined || v === null) continue;
    const b = (base as Record<string, unknown>)[k];
    if (b === undefined) continue; // ignore unknown keys
    if (Array.isArray(b)) out[k] = Array.isArray(v) ? v : b;
    else if (isPlainObject(b)) out[k] = deepMerge(b, v);
    else if (typeof b === typeof v) out[k] = v;
  }
  return out as T;
}

export function genReference(prefix = "AE") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}-${Array.from(bytes, (b) => chars[b % chars.length]).join("")}`;
}
