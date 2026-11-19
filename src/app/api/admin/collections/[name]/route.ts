import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/admin-registry";
import { ensureSeeded, CONTENT_TAG } from "@/lib/data";
import { jsonError, readJson, zodFieldErrors } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ name: string }> };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: Request, { params }: Ctx) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const cfg = COLLECTIONS[(await params).name];
  if (!cfg) return jsonError("Unknown collection", 404);
  await connectDB();
  await ensureSeeded();

  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  const status = sp.get("status");
  if (cfg.statusField && status && status !== "all") filter[cfg.statusField] = status;
  const q = sp.get("q")?.trim().slice(0, 100);
  if (q && cfg.searchFields) filter.$or = cfg.searchFields.map((f) => ({ [f]: { $regex: escapeRegex(q), $options: "i" } }));
  const date = sp.get("date");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) filter.date = date;

  const page = Math.max(1, Number(sp.get("page")) || 1);
  const limit = cfg.orderable ? 500 : 25;
  const [items, total] = await Promise.all([
    cfg.model.find(filter, { __v: 0 }).sort(cfg.sort).skip((page - 1) * limit).limit(limit).lean(),
    cfg.model.countDocuments(filter),
  ]);
  return NextResponse.json(
    { items: items.map((i: Record<string, unknown>) => ({ ...i, _id: String(i._id) })), total, page, pages: Math.max(1, Math.ceil(total / limit)) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request, { params }: Ctx) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;
  const cfg = COLLECTIONS[(await params).name];
  if (!cfg || !cfg.canCreate || !cfg.schema) return jsonError("Not allowed", 405);
  const parsed = cfg.schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Please fix the highlighted fields", 422, { fields: zodFieldErrors(parsed.error) });
  await connectDB();
  const last = await cfg.model.findOne({}, { order: 1 }).sort({ order: -1 }).lean<{ order?: number }>();
  const doc = await cfg.model.create({ ...parsed.data, order: (last?.order ?? -1) + 1 });
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item: { ...doc.toObject(), _id: String(doc._id) } }, { status: 201 });
}
