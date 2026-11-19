import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { cleanupOrphans } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  await connectDB();
  const removed = await cleanupOrphans();
  return NextResponse.json({ ok: true, removed });
}
