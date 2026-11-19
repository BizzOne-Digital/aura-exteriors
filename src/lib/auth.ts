import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { connectDB } from "./mongodb";
import { AdminSession, AdminUser } from "@/models";

export const SESSION_COOKIE = "aura_admin";
const SESSION_DAYS = 7;

const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

/** Creates the first admin from environment variables if no admin exists yet. */
export async function bootstrapAdmin() {
  await connectDB();
  if ((await AdminUser.estimatedDocumentCount()) > 0) return;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) return;
  await AdminUser.updateOne(
    { email },
    { $setOnInsert: { email, passwordHash: await bcrypt.hash(password, 12), name: "Administrator" } },
    { upsert: true },
  );
}

export async function verifyCredentials(email: string, password: string) {
  await bootstrapAdmin();
  const user = await AdminUser.findOne({ email: email.trim().toLowerCase() });
  // Always run a hash compare to reduce timing differences between unknown users and bad passwords.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!user || !ok) return null;
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  const ua = (await headers()).get("user-agent")?.slice(0, 300) ?? "";
  await AdminSession.create({ tokenHash: hashToken(token), userId, expiresAt, userAgent: ua });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectDB();
    await AdminSession.deleteOne({ tokenHash: hashToken(token) });
  }
  jar.delete(SESSION_COOKIE);
}

export type AdminIdentity = { id: string; email: string; name: string };

export async function getAdmin(): Promise<AdminIdentity | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  await connectDB();
  const session = await AdminSession.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean();
  if (!session) return null;
  const user = await AdminUser.findById(session.userId, { email: 1, name: 1 }).lean();
  if (!user) return null;
  return { id: String(user._id), email: user.email, name: user.name ?? "Administrator" };
}

/** For server components/layouts in the admin area. */
export async function requireAdminPage() {
  const admin = await getAdmin().catch(() => null);
  if (!admin) redirect("/admin/login");
  return admin;
}

/**
 * For admin route handlers. Returns the admin or a 401/403 response.
 * Mutating requests must come from the same origin (CSRF defense in addition to SameSite cookies).
 */
export async function requireAdminApi(req: Request): Promise<AdminIdentity | NextResponse> {
  if (req.method !== "GET" && req.method !== "HEAD") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (!origin || !host || new URL(origin).host !== host) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
  }
  const admin = await getAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return admin;
}

export async function changePassword(userId: string, current: string, next: string) {
  const user = await AdminUser.findById(userId);
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return false;
  user.passwordHash = await bcrypt.hash(next, 12);
  await user.save();
  await AdminSession.deleteMany({ userId: user._id });
  return true;
}
