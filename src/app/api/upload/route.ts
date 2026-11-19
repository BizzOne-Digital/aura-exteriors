import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { StoredUpload, UPLOAD_FOLDERS } from "@/models";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES } from "@/lib/uploads";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

/** Verifies file signatures so a renamed non-image can't be stored as an image. */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.toString("ascii", 0, 3) === "GIF") return "image/gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function POST(req: Request) {
  const admin = await requireAdminApi(req);
  if (admin instanceof NextResponse) return admin;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Invalid upload. The file may be too large for the server.", 400);
  }
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "misc");
  if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) return jsonError("Invalid folder");
  if (!(file instanceof File)) return jsonError("No file provided");
  if (file.size === 0) return jsonError("The file is empty");
  if (file.size > MAX_UPLOAD_BYTES) return jsonError("Image must be 8 MB or smaller", 413);
  if (!ALLOWED_MIME[file.type]) return jsonError("Only PNG, JPG, WEBP, or GIF images are allowed", 415);

  const buf = Buffer.from(await file.arrayBuffer());
  const actual = sniff(buf);
  if (!actual || actual !== (file.type === "image/jpg" ? "image/jpeg" : file.type))
    return jsonError("The file content does not match a supported image type", 415);

  const filename = `${Date.now().toString(36)}-${randomBytes(8).toString("hex")}.${ALLOWED_MIME[actual]}`;
  await connectDB();
  await StoredUpload.create({ folder, filename, contentType: actual, size: buf.length, data: buf });
  return NextResponse.json({ ok: true, url: `/api/uploads/${folder}/${filename}` }, { status: 201 });
}
