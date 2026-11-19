import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { QuoteRequest } from "@/models";
import { quoteSchema } from "@/lib/validations";
import { clientIp, jsonError, rateLimit, readJson, zodFieldErrors } from "@/lib/http";
import { sendMail, adminRecipient } from "@/lib/email";
import { getSettings } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isDbConfigured()) return jsonError("The form is temporarily unavailable. Please call or email us directly.", 503);
  const parsed = quoteSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Please correct the highlighted fields.", 422, { fields: zodFieldErrors(parsed.error) });
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true, emailSent: false });

  await connectDB();
  if (!(await rateLimit(`quote:${clientIp(req)}`, 5, 600)))
    return jsonError("Too many submissions. Please wait a few minutes and try again.", 429);

  await QuoteRequest.create(data);

  const settings = await getSettings();
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Property Location", data.location],
    ["Preferred Contact", data.contactMethod],
    ["Project Description", data.description],
  ];
  const [adminSent, customerSent] = await Promise.all([
    sendMail(adminRecipient(settings.notifyEmail, settings.email), `New quote request: ${data.service}`, rows),
    settings.sendCustomerConfirmations
      ? sendMail(data.email, "Your quote request | Aura Exteriors", rows, `Hi ${data.name}, thank you for requesting a personalized quote. We have received your details and will follow up soon.`)
      : Promise.resolve(false),
  ]);
  return NextResponse.json({ ok: true, emailSent: customerSent, adminNotified: adminSent });
}
