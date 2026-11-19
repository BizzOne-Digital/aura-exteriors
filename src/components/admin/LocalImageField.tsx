"use client";

import { useRef, useState } from "react";
import { ImageUp, LoaderCircle, RefreshCw, Trash2, Link2 } from "lucide-react";
import { useToast, inputCls } from "./ui";
import { cn } from "@/lib/utils";

export type UploadFolder = "products" | "gallery" | "pages" | "misc";

const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX = 8 * 1024 * 1024;
// Serverless platforms (e.g. Vercel) cap request bodies at ~4.5 MB, so larger stills are resized in the browser first.
const SAFE_BODY = 4 * 1024 * 1024;

async function shrink(file: File): Promise<File> {
  if (file.size <= SAFE_BODY || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, 2800 / Math.max(bitmap.width, bitmap.height));
  for (let attempt = 0; attempt < 4; attempt++) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
    if (blob && blob.size <= SAFE_BODY) return new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
    scale *= 0.75;
  }
  return file;
}

/**
 * Reusable image input: preview, upload (POST /api/upload), replace, remove.
 * Removing/replacing only changes the form value; the server deletes the old file
 * after save, and only if no other content still references it.
 */
export function LocalImageField({
  id,
  label,
  value,
  onChange,
  folder = "misc",
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const toast = useToast();

  const pick = () => input.current?.click();

  const upload = async (file: File) => {
    setError("");
    if (!ACCEPT.includes(file.type)) return setError("Please choose a PNG, JPG, WEBP, or GIF image.");
    if (file.size > MAX) return setError("Image must be 8 MB or smaller.");
    setBusy(true);
    try {
      const ready = await shrink(file);
      const fd = new FormData();
      fd.append("file", ready);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || (res.status === 413 ? "Image is too large." : "Upload failed."));
      onChange(data.url);
      toast("success", "Image uploaded. Remember to save your changes.");
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast("error", msg);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <button type="button" onClick={() => setShowUrl((v) => !v)} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <Link2 className="h-3 w-3" /> {showUrl ? "Hide URL" : "Use URL"}
        </button>
      </div>
      {hint && <p className="mb-2 text-xs text-slate-500">{hint}</p>}
      <div
        className={cn(
          "relative flex min-h-36 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-slate-50",
          value ? "border-slate-200" : "border-slate-300",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="max-h-56 w-full object-contain" />
        ) : (
          <button type="button" onClick={pick} className="flex flex-col items-center gap-2 p-6 text-sm text-slate-500 hover:text-slate-800">
            <ImageUp className="h-7 w-7" />
            Click or drop an image (PNG, JPG, WEBP, GIF · max 8 MB)
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/80">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-700" />
          </div>
        )}
      </div>
      <input ref={input} id={id} type="file" accept={ACCEPT.join(",")} className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      {value && (
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={pick} disabled={busy} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Replace
          </button>
          <button type="button" onClick={() => onChange("")} disabled={busy} className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      )}
      {showUrl && <input className={cn(inputCls, "mt-2 font-mono text-xs")} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /api/uploads/…" aria-label={`${label} URL`} />}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
