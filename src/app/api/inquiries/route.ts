import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { ContactInquiry } from "@/models";
import { contactSchema } from "@/lib/validations";
import { clientIp, jsonError, rateLimit, readJson, zodFieldErrors } from "@/lib/http";
import { sendMail, adminRecipient } from "@/lib/email";
import { getSettings } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isDbConfigured()) return jsonError("The form is temporarily unavailable. Please call or email us directly.", 503);
  const parsed = contactSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Please correct the highlighted fields.", 422, { fields: zodFieldErrors(parsed.error) });
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true, emailSent: false }); // honeypot: silently accept

  await connectDB();
  if (!(await rateLimit(`contact:${clientIp(req)}`, 5, 600)))
    return jsonError("Too many submissions. Please wait a few minutes and try again.", 429);

  await ContactInquiry.create(data);

  const settings = await getSettings();
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Subject", data.subject],
    ["Message", data.message],
  ];
  const [adminSent, customerSent] = await Promise.all([
    sendMail(adminRecipient(settings.notifyEmail, settings.email), `New contact inquiry: ${data.subject}`, rows),
    settings.sendCustomerConfirmations
      ? sendMail(data.email, "We received your message | Aura Exteriors", rows, `Hi ${data.name}, thank you for contacting Aura Exteriors. We have received your message and will be in touch soon.`)
      : Promise.resolve(false),
  ]);
  return NextResponse.json({ ok: true, emailSent: customerSent, adminNotified: adminSent });
}
