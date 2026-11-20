import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { reviewSchema } from "@/lib/validations";
import { clientIp, jsonError, rateLimit, readJson, zodFieldErrors } from "@/lib/http";
import { sendMail, adminRecipient } from "@/lib/email";
import { getSettings } from "@/lib/data";

export const runtime = "nodejs";

/** Public review submission. Reviews are saved unapproved and only appear on the site after an admin approves them. */
export async function POST(req: Request) {
  if (!isDbConfigured()) return jsonError("Reviews are temporarily unavailable. Please try again later.", 503);
  const parsed = reviewSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Please correct the highlighted fields.", 422, { fields: zodFieldErrors(parsed.error) });
  const { website, consent: _consent, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  await connectDB();
  if (!(await rateLimit(`review:${clientIp(req)}`, 3, 3600)))
    return jsonError("Too many submissions. Please try again later.", 429);

  const last = await Testimonial.findOne({}, { order: 1 }).sort({ order: -1 }).lean<{ order?: number }>();
  await Testimonial.create({ ...data, approved: false, source: "website", order: (last?.order ?? -1) + 1 });

  const settings = await getSettings();
  await sendMail(adminRecipient(settings.notifyEmail, settings.email), `New customer review (${data.rating}/5) awaiting approval`, [
    ["Name", data.name],
    ["Location", data.location],
    ["Email", data.email],
    ["Rating", `${data.rating} / 5`],
    ["Review", data.quote],
  ]);
  return NextResponse.json({ ok: true });
}
