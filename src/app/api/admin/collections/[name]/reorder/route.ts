import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/admin-registry";
import { CONTENT_TAG } from "@/lib/data";
import { jsonError, readJson } from "@/lib/http";

export const runtime = "nodejs";

const schema = z.object({ ids: z.array(z.string().regex(/^[a-f0-9]{24}$/)).max(500) });

export async function POST(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const cfg = COLLECTIONS[(await params).name];
  if (!cfg?.orderable) return jsonError("Not allowed", 405);
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Invalid order", 422);
  await connectDB();
  await cfg.model.bulkWrite(parsed.data.ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })));
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
