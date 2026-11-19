import "server-only";
import { BookingSlot } from "@/models";
import type { AvailabilityData } from "./defaults";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function partsInTz(instant: number, timeZone: string) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(f.formatToParts(new Date(instant)).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second };
}

export function todayInTz(timeZone: string) {
  const p = partsInTz(Date.now(), timeZone);
  return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

/** Converts a wall-clock date/time in `timeZone` to a UTC timestamp. */
export function zonedToUtc(date: string, time: string, timeZone: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "00:00").split(":").map(Number);
  const target = Date.UTC(y, m - 1, d, hh, mm);
  let guess = target;
  for (let i = 0; i < 2; i++) {
    const p = partsInTz(guess, timeZone);
    const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
    guess += target - asUtc;
  }
  return guess;
}

export function addDays(date: string, n: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function isValidTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fromMin = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

/** Why a date can't be booked, or null if the date itself is open. */
export function dateProblem(date: string, a: AvailabilityData): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return "Invalid date";
  const today = todayInTz(a.timeZone);
  if (date < today) return "Please choose a future date";
  if (date > addDays(today, a.maxAdvanceDays)) return `Bookings are available up to ${a.maxAdvanceDays} days in advance`;
  if (!a.enabled) return null; // request mode: any future date can be requested
  const [y, m, d] = date.split("-").map(Number);
  const dow = DAY_KEYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  if (!a.days[dow]) return "We are not scheduling consultations on this day";
  if (a.blockedDates.includes(date)) return "This date is unavailable";
  return null;
}

/** All configured slot start times for a date (ignores existing bookings). */
export function slotTimes(date: string, a: AvailabilityData) {
  if (!a.enabled || dateProblem(date, a)) return [];
  const step = Math.max(15, a.slotMinutes);
  const start = toMin(a.startTime);
  const end = toMin(a.endTime);
  const earliest = Date.now() + a.minNoticeHours * 3600_000;
  const out: string[] = [];
  for (let t = start; t + step <= end; t += step) {
    const time = fromMin(t);
    if (zonedToUtc(date, time, a.timeZone) >= earliest) out.push(time);
  }
  return out;
}

export async function availableSlots(date: string, a: AvailabilityData) {
  const times = slotTimes(date, a);
  if (!times.length) return [];
  const taken = await BookingSlot.find({ date }, { key: 1, count: 1 }).lean();
  const counts = new Map(taken.map((s) => [s.key, s.count]));
  return times.map((time) => ({ time, available: (counts.get(`${date}|${time}`) ?? 0) < a.capacityPerSlot }));
}

/** Atomically reserves capacity for a slot. Returns false when the slot is full. */
export async function reserveSlot(date: string, time: string, capacity: number) {
  const key = `${date}|${time}`;
  const updated = await BookingSlot.findOneAndUpdate({ key, count: { $lt: capacity } }, { $inc: { count: 1 } }, { new: true }).lean();
  if (updated) return true;
  try {
    await BookingSlot.create({ key, date, count: 1 });
    return true;
  } catch {
    // Duplicate key → slot doc exists and is full (or another request just reserved it).
    const retry = await BookingSlot.findOneAndUpdate({ key, count: { $lt: capacity } }, { $inc: { count: 1 } }, { new: true }).lean();
    return Boolean(retry);
  }
}

export async function releaseSlot(date: string, time: string) {
  await BookingSlot.updateOne({ key: `${date}|${time}`, count: { $gt: 0 } }, { $inc: { count: -1 } });
}

export function formatDateLong(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatTime12(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
