import "server-only";
import { NextResponse } from "next/server";
import { connectDB } from "./mongodb";
import { RateLimit } from "@/models";
import type { ZodError } from "zod";

export function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Fixed-window rate limiter backed by MongoDB so it works across serverless instances. */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  await connectDB();
  const now = new Date();
  try {
    const doc = await RateLimit.findOneAndUpdate(
      { key, expiresAt: { $gt: now } },
      { $inc: { count: 1 } },
      { new: true },
    ).lean();
    if (doc) return doc.count <= limit;
    await RateLimit.findOneAndUpdate(
      { key },
      { $set: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
      { upsert: true },
    );
    return true;
  } catch {
    return true; // never block legitimate users because of a limiter failure
  }
}

export const jsonError = (error: string, status = 400, extra?: Record<string, unknown>) =>
  NextResponse.json({ error, ...extra }, { status });

export function zodFieldErrors(err: ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = issue.path.join(".") || "form";
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
