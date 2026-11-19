import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { Booking } from "@/models";
import { bookingSchema, TIME_WINDOWS } from "@/lib/validations";
import { clientIp, jsonError, rateLimit, readJson, zodFieldErrors } from "@/lib/http";
import { readAvailability, getSettings } from "@/lib/data";
import { dateProblem, slotTimes, reserveSlot, releaseSlot, formatDateLong, formatTime12 } from "@/lib/booking";
import { sendMail, adminRecipient } from "@/lib/email";
import { genReference } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isDbConfigured()) return jsonError("Online booking is temporarily unavailable. Please call us directly.", 503);
  const parsed = bookingSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Please correct the highlighted fields.", 422, { fields: zodFieldErrors(parsed.error) });
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true, reference: genReference(), mode: "request", emailSent: false });

  await connectDB();
  if (!(await rateLimit(`booking:${clientIp(req)}`, 5, 900)))
    return jsonError("Too many booking attempts. Please wait a few minutes and try again.", 429);

  const a = await readAvailability();
  const problem = dateProblem(data.date, a);
  if (problem) return jsonError(problem, 422, { fields: { date: problem } });

  const mode = a.enabled ? "scheduled" : "request";
  let holdsSlot = false;
  if (mode === "scheduled") {
    if (!data.time || !slotTimes(data.date, a).includes(data.time))
      return jsonError("Please choose an available time.", 422, { fields: { time: "Please choose an available time" } });
    holdsSlot = await reserveSlot(data.date, data.time, a.capacityPerSlot);
    if (!holdsSlot)
      return jsonError("Sorry, that time was just booked. Please choose another time.", 409, { fields: { time: "This time is no longer available" } });
  } else if (data.timeWindow && !TIME_WINDOWS.includes(data.timeWindow)) {
    data.timeWindow = "Flexible";
  }

  let reference = genReference();
  try {
    for (let i = 0; i < 3; i++) {
      try {
        await Booking.create({
          ...data,
          time: mode === "scheduled" ? data.time : "",
          timeWindow: mode === "request" ? data.timeWindow || "Flexible" : "",
          timeZone: a.timeZone,
          mode,
          reference,
          holdsSlot,
        });
        break;
      } catch (e) {
        if ((e as { code?: number }).code === 11000 && i < 2) reference = genReference();
        else throw e;
      }
    }
  } catch (e) {
    if (holdsSlot) await releaseSlot(data.date, data.time);
    throw e;
  }

  const settings = await getSettings();
  const when =
    mode === "scheduled"
      ? `${formatDateLong(data.date)} at ${formatTime12(data.time)} (${a.timeZone})`
      : `${formatDateLong(data.date)}, ${data.timeWindow || "Flexible"} (preferred, not yet confirmed)`;
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Requested Time", when],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Property Address", data.address],
    ["Project Description", data.description],
    ["Additional Notes", data.notes],
  ];
  const [adminSent, customerSent] = await Promise.all([
    sendMail(adminRecipient(settings.notifyEmail, settings.email), `New consultation ${mode === "scheduled" ? "booking" : "request"}: ${reference}`, rows),
    settings.sendCustomerConfirmations
      ? sendMail(
          data.email,
          `Consultation ${mode === "scheduled" ? "booking received" : "request received"} | ${reference}`,
          rows,
          mode === "scheduled"
            ? `Hi ${data.name}, thank you for booking a consultation with Aura Exteriors. Your requested time is reserved and pending confirmation from our team.`
            : `Hi ${data.name}, thank you for requesting a consultation with Aura Exteriors. We will contact you to confirm a time.`,
        )
      : Promise.resolve(false),
  ]);

  return NextResponse.json({ ok: true, reference, mode, when, emailSent: customerSent, adminNotified: adminSent });
}
