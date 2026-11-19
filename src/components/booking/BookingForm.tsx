"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock, LoaderCircle } from "lucide-react";
import { bookingSchema, SERVICE_OPTIONS, TIME_WINDOWS } from "@/lib/validations";
import { TextField, TextArea, SelectField, Honeypot, SubmitButton, FormAlert, postJson, useQueryPrefill } from "@/components/forms/FormKit";
import { cn } from "@/lib/utils";

type In = z.input<typeof bookingSchema>;
type Out = z.output<typeof bookingSchema>;

export type BookingConfig = {
  mode: "scheduled" | "request";
  timeZone: string;
  today: string;
  maxDate: string;
  days: Record<string, boolean>;
  blockedDates: string[];
};

const DOW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DOW_LABEL = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const ymd = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const fmtLong = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
};
const fmt12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

function Calendar({ cfg, value, onChange }: { cfg: BookingConfig; value: string; onChange: (d: string) => void }) {
  const [ty, tm] = cfg.today.split("-").map(Number);
  const [view, setView] = useState({ y: ty, m: tm - 1 });
  const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
  const daysIn = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const monthLabel = new Date(Date.UTC(view.y, view.m, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const canPrev = view.y > ty || (view.y === ty && view.m > tm - 1);
  const [my, mm] = cfg.maxDate.split("-").map(Number);
  const canNext = view.y < my || (view.y === my && view.m < mm - 1);

  const disabled = (date: string, dow: number) => {
    if (date < cfg.today || date > cfg.maxDate) return true;
    if (cfg.mode === "scheduled") return !cfg.days[DOW[dow]] || cfg.blockedDates.includes(date);
    return false;
  };

  const shift = (n: number) => setView((v) => {
    const d = new Date(Date.UTC(v.y, v.m + n, 1));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  });

  return (
    <div className="rounded-[10px] border border-line bg-midnight/60 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month" className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold disabled:opacity-30">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-xl text-ivory" aria-live="polite">
          {monthLabel}
        </p>
        <button type="button" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month" className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold disabled:opacity-30">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label="Choose a date">
        {DOW_LABEL.map((d) => (
          <span key={d} className="py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted/70" role="columnheader">
            {d}
          </span>
        ))}
        {Array.from({ length: first }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysIn }).map((_, i) => {
          const day = i + 1;
          const date = ymd(view.y, view.m, day);
          const dow = (first + i) % 7;
          const off = disabled(date, dow);
          const selected = value === date;
          return (
            <button
              key={date}
              type="button"
              disabled={off}
              onClick={() => onChange(date)}
              aria-pressed={selected}
              aria-label={`${fmtLong(date)}${off ? " (unavailable)" : ""}`}
              className={cn(
                "aspect-square rounded-md text-sm transition",
                off && "cursor-not-allowed text-muted/25 line-through decoration-muted/20",
                !off && !selected && "text-ivory hover:bg-gold/15 hover:text-champagne",
                selected && "bg-gradient-to-br from-champagne to-gold font-semibold text-midnight",
                date === cfg.today && !selected && "ring-1 ring-gold/50",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BookingForm({ cfg, defaultService = "" }: { cfg: BookingConfig; defaultService?: string }) {
  const [serverError, setServerError] = useState("");
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [slotMsg, setSlotMsg] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [done, setDone] = useState<{ reference: string; when: string; mode: string; emailSent: boolean } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", phone: "", service: defaultService, address: "", date: "", time: "", timeWindow: "Flexible", description: "", notes: "", website: "" },
  });
  const date = watch("date");
  const time = watch("time");
  const timeWindow = watch("timeWindow");

  useQueryPrefill((p) => {
    const service = p.get("service");
    if (service && SERVICE_OPTIONS.includes(service)) setValue("service", service);
  });

  useEffect(() => {
    if (cfg.mode !== "scheduled" || !date) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSlotMsg("");
    fetch(`/api/bookings/availability?date=${date}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { slots?: { time: string; available: boolean }[]; message?: string; error?: string }) => {
        if (cancelled) return;
        setSlots(d.slots ?? []);
        setSlotMsg(d.message ?? d.error ?? "");
      })
      .catch(() => !cancelled && setSlotMsg("Could not load available times. Please try again."))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [date, cfg.mode, refreshKey]);

  const anyAvailable = useMemo(() => slots.some((s) => s.available), [slots]);

  const onSubmit = async (values: Out) => {
    setServerError("");
    if (cfg.mode === "scheduled" && !values.time) {
      setError("time", { message: "Please choose an available time" });
      return;
    }
    const { status, data } = await postJson("/api/bookings", values);
    if (status >= 200 && status < 300 && data.ok) {
      setDone({ reference: String(data.reference), when: String(data.when ?? ""), mode: String(data.mode), emailSent: Boolean(data.emailSent) });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (data.fields) for (const [k, v] of Object.entries(data.fields)) setError(k as keyof In, { message: v });
    if (status === 409) {
      setValue("time", "");
      setRefreshKey((k) => k + 1);
    }
    setServerError(data.error || "Something went wrong. Please try again or call us.");
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold bg-gold/10 text-gold">
          <CalendarCheck className="h-9 w-9" strokeWidth={1.4} />
        </span>
        <h2 className="mt-6 font-serif text-4xl text-ivory">{done.mode === "scheduled" ? "Your Consultation Is Requested" : "Request Received"}</h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          {done.mode === "scheduled"
            ? "Your selected time has been reserved and is pending confirmation from our team."
            : "Thank you. We'll contact you to confirm a consultation time that works for you."}
        </p>
        <dl className="mx-auto mt-8 max-w-md divide-y divide-line rounded-[10px] border border-line text-left">
          <div className="flex justify-between gap-4 p-4">
            <dt className="text-sm text-muted">Reference</dt>
            <dd className="font-mono font-semibold tracking-wider text-champagne">{done.reference}</dd>
          </div>
          <div className="flex justify-between gap-4 p-4">
            <dt className="text-sm text-muted">Requested</dt>
            <dd className="text-right text-sm text-ivory">{done.when}</dd>
          </div>
          <div className="flex justify-between gap-4 p-4">
            <dt className="text-sm text-muted">Status</dt>
            <dd className="text-sm text-ivory">Pending confirmation</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-muted/80">
          {done.emailSent ? "A confirmation email has been sent to you." : "Please keep your reference number for your records."}
        </p>
        <Link href="/" className="btn btn-outline mt-8">
          Return Home
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-10">
      <section aria-labelledby="step-1">
        <h2 id="step-1" className="mb-5 flex items-center gap-3 font-serif text-2xl text-ivory">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gold text-sm font-sans font-semibold text-gold">1</span>
          {cfg.mode === "scheduled" ? "Choose a Date & Time" : "Preferred Date & Time"}
        </h2>
        {cfg.mode === "request" && (
          <p className="mb-5 text-sm leading-relaxed text-muted">
            Choose your preferred date and time of day. This is a consultation request. Our team will contact you to confirm an appointment.
          </p>
        )}
        <Calendar
          cfg={cfg}
          value={date}
          onChange={(d) => {
            setValue("date", d, { shouldValidate: true });
            setValue("time", "");
            clearErrors("time");
          }}
        />
        {errors.date && <p className="field-error" role="alert">{errors.date.message}</p>}

        <AnimatePresence mode="wait">
          {date && (
            <motion.div key={date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
              <p className="field-label flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" /> {fmtLong(date)}
              </p>
              {cfg.mode === "scheduled" ? (
                loadingSlots ? (
                  <p className="flex items-center gap-2 py-4 text-sm text-muted">
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Checking availability…
                  </p>
                ) : anyAvailable ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Available times">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        role="radio"
                        aria-checked={time === s.time}
                        disabled={!s.available}
                        onClick={() => {
                          setValue("time", s.time);
                          clearErrors("time");
                        }}
                        className={cn(
                          "rounded-md border px-2 py-3 text-sm transition",
                          !s.available && "cursor-not-allowed border-white/5 text-muted/30 line-through",
                          s.available && time !== s.time && "border-line text-ivory hover:border-gold hover:text-champagne",
                          time === s.time && "border-gold bg-gold text-midnight font-semibold",
                        )}
                      >
                        {fmt12(s.time)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-3 text-sm text-muted">{slotMsg || "No times available on this date. Please choose another day."}</p>
                )
              ) : (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred time of day">
                  {TIME_WINDOWS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      role="radio"
                      aria-checked={timeWindow === w}
                      onClick={() => setValue("timeWindow", w)}
                      className={cn("rounded-full border px-5 py-2.5 text-sm transition", timeWindow === w ? "border-gold bg-gold/15 text-champagne" : "border-line text-ivory/80 hover:border-gold")}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
              {cfg.mode === "scheduled" && <p className="mt-3 text-xs text-muted/70">Times shown in {cfg.timeZone.replace(/_/g, " ")}.</p>}
              {errors.time && <p className="field-error" role="alert">{errors.time.message}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section aria-labelledby="step-2">
        <h2 id="step-2" className="mb-5 flex items-center gap-3 font-serif text-2xl text-ivory">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gold text-sm font-sans font-semibold text-gold">2</span>
          Your Details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="b-name" label="Full Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
          <TextField id="b-email" label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
          <TextField id="b-phone" label="Phone" type="tel" required autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
          <SelectField id="b-service" label="Service Interested In" required options={SERVICE_OPTIONS} placeholder="Select a service" error={errors.service?.message} {...register("service")} />
          <TextField id="b-address" label="Property Address" required wrapClassName="sm:col-span-2" autoComplete="street-address" error={errors.address?.message} {...register("address")} />
          <TextArea id="b-desc" label="Project Description" rows={4} wrapClassName="sm:col-span-2" placeholder="What would you like to achieve?" error={errors.description?.message} {...register("description")} />
          <TextArea id="b-notes" label="Additional Notes" rows={3} wrapClassName="sm:col-span-2" placeholder="Gate codes, best time to reach you, etc." error={errors.notes?.message} {...register("notes")} />
        </div>
      </section>

      <Honeypot {...register("website")} />
      {serverError && <FormAlert kind="error">{serverError}</FormAlert>}
      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted/70">
          {cfg.mode === "scheduled" ? "Your appointment will be confirmed by our team." : "Submitting sends a consultation request; it is not a confirmed appointment."}
        </p>
        <SubmitButton loading={isSubmitting}>{cfg.mode === "scheduled" ? "Book Consultation" : "Request Consultation"}</SubmitButton>
      </div>
    </form>
  );
}
