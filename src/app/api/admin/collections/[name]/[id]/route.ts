import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidObjectId } from "mongoose";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/admin-registry";
import { CONTENT_TAG, readAvailability } from "@/lib/data";
import { jsonError, readJson, zodFieldErrors } from "@/lib/http";
import { extractUploadUrls, releaseUnreferenced } from "@/lib/uploads";
import { releaseSlot, reserveSlot } from "@/lib/booking";
import { Booking } from "@/models";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ name: string; id: string }> };

function refresh() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

export async function PATCH(req: Request, { params }: Ctx) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const { name, id } = await params;
  const cfg = COLLECTIONS[name];
  if (!cfg || !isValidObjectId(id)) return jsonError("Not found", 404);
  await connectDB();
  const existing = await cfg.model.findById(id).lean<Record<string, unknown>>();
  if (!existing) return jsonError("Not found", 404);
  const body = await readJson(req);

  // Lead records (bookings/inquiries/quotes): only status/notes can change.
  if (cfg.patchSchema) {
    const parsed = cfg.patchSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid update", 422, { fields: zodFieldErrors(parsed.error) });
    const update: Record<string, unknown> = { ...parsed.data };

    if (name === "bookings" && update.status && update.status !== existing.status) {
      const b = existing as { mode: string; date: string; time: string; holdsSlot: boolean };
      if (update.status === "cancelled" && b.holdsSlot) {
        await releaseSlot(b.date, b.time);
        update.holdsSlot = false;
      } else if (update.status !== "cancelled" && b.mode === "scheduled" && !b.holdsSlot) {
        const a = await readAvailability();
        if (!(await reserveSlot(b.date, b.time, a.capacityPerSlot)))
          return jsonError("That time slot is now fully booked. The booking cannot be reactivated.", 409);
        update.holdsSlot = true;
      }
    }
    const doc = await cfg.model.findByIdAndUpdate(id, { $set: update }, { new: true }).lean<Record<string, unknown>>();
    return NextResponse.json({ ok: true, item: { ...doc, _id: id } });
  }

  if (!cfg.schema) return jsonError("Not allowed", 405);
  const parsed = cfg.schema.safeParse(body);
  if (!parsed.success) return jsonError("Please fix the highlighted fields", 422, { fields: zodFieldErrors(parsed.error) });
  const before = extractUploadUrls(existing);
  const doc = await cfg.model.findByIdAndUpdate(id, { $set: parsed.data }, { new: true, runValidators: true }).lean<Record<string, unknown>>();
  await releaseUnreferenced(before);
  refresh();
  return NextResponse.json({ ok: true, item: { ...doc, _id: id } });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const { name, id } = await params;
  const cfg = COLLECTIONS[name];
  if (!cfg || !isValidObjectId(id)) return jsonError("Not found", 404);
  if (!cfg.canDelete) return jsonError("Not allowed", 405);
  await connectDB();
  const existing = await cfg.model.findByIdAndDelete(id).lean<Record<string, unknown>>();
  if (!existing) return jsonError("Not found", 404);
  if (cfg.model === Booking) {
    const b = existing as { date: string; time: string; holdsSlot: boolean };
    if (b.holdsSlot) await releaseSlot(b.date, b.time);
  } else {
    await releaseUnreferenced(extractUploadUrls(existing));
    refresh();
  }
  return NextResponse.json({ ok: true });
}
