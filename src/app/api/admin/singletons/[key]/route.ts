import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { SINGLETONS, validateSingleton, type SingletonName } from "@/lib/admin-registry";
import { CONTENT_TAG } from "@/lib/data";
import { jsonError, readJson } from "@/lib/http";
import { deepMerge } from "@/lib/utils";
import { extractUploadUrls, releaseUnreferenced } from "@/lib/uploads";
import { BookingAvailability, PageContent, SiteSettings } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function modelFor(kind: string) {
  return kind === "page" ? PageContent : kind === "availability" ? BookingAvailability : SiteSettings;
}

type Ctx = { params: Promise<{ key: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const name = (await params).key as SingletonName;
  const def = SINGLETONS[name];
  if (!def) return jsonError("Not found", 404);
  await connectDB();
  const doc = await modelFor(def.kind).findOne({ key: def.key }).lean();
  return NextResponse.json({ data: deepMerge(def.defaults, doc?.data) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request, { params }: Ctx) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const name = (await params).key as SingletonName;
  const def = SINGLETONS[name];
  if (!def) return jsonError("Not found", 404);
  const { value, errors } = validateSingleton(name, await readJson(req));
  if (errors.length) return jsonError(errors.join("\n"), 422);
  await connectDB();
  const Model = modelFor(def.kind);
  const prev = await Model.findOne({ key: def.key }).lean();
  await Model.updateOne({ key: def.key }, { $set: { data: value } }, { upsert: true });
  await releaseUnreferenced(extractUploadUrls(prev?.data));
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, data: value });
}
