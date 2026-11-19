import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { StoredUpload, UPLOAD_FOLDERS } from "@/models";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params;
  if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder) || !/^[A-Za-z0-9._-]{1,120}$/.test(filename) || !isDbConfigured())
    return new Response("Not found", { status: 404 });
  await connectDB();
  const doc = await StoredUpload.findOne({ folder, filename }, { data: 1, contentType: 1, size: 1 }).lean();
  if (!doc) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  // lean() returns a BSON Binary (whose .buffer is a Uint8Array) or a Node Buffer depending on driver version.
  const raw = doc.data as unknown as Uint8Array | { buffer: Uint8Array };
  const bytes = raw instanceof Uint8Array ? raw : raw.buffer;
  return new Response(new Uint8Array(bytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": doc.contentType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
    },
  });
}
