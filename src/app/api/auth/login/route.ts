import { NextResponse } from "next/server";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validations";
import { clientIp, jsonError, rateLimit, readJson } from "@/lib/http";
import { createSession, verifyCredentials } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isDbConfigured()) return jsonError("Database is not configured. Set MONGODB_URI.", 503);
  const parsed = loginSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Enter a valid email and password.", 422);
  await connectDB();
  const ip = clientIp(req);
  const okIp = await rateLimit(`login:ip:${ip}`, 10, 900);
  const okUser = await rateLimit(`login:user:${parsed.data.email.toLowerCase()}`, 8, 900);
  if (!okIp || !okUser) return jsonError("Too many login attempts. Please try again in 15 minutes.", 429);

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) return jsonError("Invalid email or password.", 401);
  await createSession(String(user._id));
  return NextResponse.json({ ok: true });
}
