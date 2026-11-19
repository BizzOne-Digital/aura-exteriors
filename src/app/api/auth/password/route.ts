import { NextResponse } from "next/server";
import { z } from "zod";
import { changePassword, requireAdminApi } from "@/lib/auth";
import { jsonError, readJson } from "@/lib/http";

export const runtime = "nodejs";

const schema = z.object({
  current: z.string().min(1),
  next: z.string().min(12, "New password must be at least 12 characters").max(200),
});

export async function POST(req: Request) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
  const ok = await changePassword(admin.id, parsed.data.current, parsed.data.next);
  if (!ok) return jsonError("Current password is incorrect", 401);
  return NextResponse.json({ ok: true, message: "Password updated. Please sign in again." });
}
