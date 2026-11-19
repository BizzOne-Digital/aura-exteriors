import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { readAvailability } from "@/lib/data";
import { availableSlots, dateProblem } from "@/lib/booking";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isDbConfigured()) return jsonError("Online booking is temporarily unavailable.", 503);
  const date = new URL(req.url).searchParams.get("date") ?? "";
  await connectDB();
  const a = await readAvailability();
  if (!a.enabled) return NextResponse.json({ mode: "request", slots: [] });
  const problem = dateProblem(date, a);
  if (problem) return NextResponse.json({ mode: "scheduled", slots: [], message: problem }, { headers: { "Cache-Control": "no-store" } });
  const slots = await availableSlots(date, a);
  return NextResponse.json(
    { mode: "scheduled", slots, timeZone: a.timeZone, message: slots.some((s) => s.available) ? undefined : "No times remain on this date. Please choose another day." },
    { headers: { "Cache-Control": "no-store" } },
  );
}
