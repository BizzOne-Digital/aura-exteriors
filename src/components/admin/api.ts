"use client";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export async function api<T = Record<string, unknown>>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: init?.method ?? "GET",
      headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Network error. Check your connection.", 0);
  }
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data.fields);
  return data as T;
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function labelize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bUrl\b/g, "URL")
    .replace(/\bCta\b/g, "CTA")
    .replace(/\bSeo\b/g, "SEO")
    .replace(/\bFaq\b/g, "FAQ")
    .trim();
}
