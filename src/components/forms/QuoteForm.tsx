"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { quoteSchema, SERVICE_OPTIONS } from "@/lib/validations";
import { TextField, TextArea, SelectField, Honeypot, SubmitButton, FormAlert, postJson, useQueryPrefill } from "./FormKit";
import { cn } from "@/lib/utils";

type In = z.input<typeof quoteSchema>;
type Out = z.output<typeof quoteSchema>;

const METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "text", label: "Text Message" },
] as const;

export function QuoteForm({ defaultService = "" }: { defaultService?: string }) {
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState<{ emailSent: boolean } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: "", email: "", phone: "", service: defaultService, location: "", description: "", contactMethod: "email", website: "" },
  });
  const method = watch("contactMethod");

  useQueryPrefill((p) => {
    const service = p.get("service");
    if (service && SERVICE_OPTIONS.includes(service)) setValue("service", service);
  });

  // Service cards on the page dispatch this event to preselect a service and scroll here.
  useEffect(() => {
    const onPick = (e: Event) => setValue("service", (e as CustomEvent<string>).detail, { shouldValidate: true });
    window.addEventListener("aura:pick-service", onPick);
    return () => window.removeEventListener("aura:pick-service", onPick);
  }, [setValue]);

  const onSubmit = async (values: Out) => {
    setServerError("");
    const { status, data } = await postJson("/api/quotes", values);
    if (status >= 200 && status < 300 && data.ok) {
      setDone({ emailSent: Boolean(data.emailSent) });
      reset();
      return;
    }
    if (data.fields) for (const [k, v] of Object.entries(data.fields)) setError(k as keyof In, { message: v });
    setServerError(data.error || "Something went wrong. Please try again or call us.");
  };

  if (done) {
    return (
      <div className="space-y-6">
        <FormAlert kind="success">
          <p className="font-semibold">Thank you. Your quote request has been received.</p>
          <p className="mt-1">
            We&apos;ll review your project details and reach out using your preferred contact method.
            {done.emailSent ? " A confirmation has been sent to your email." : ""}
          </p>
        </FormAlert>
        <button type="button" className="btn btn-outline" onClick={() => setDone(null)}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <TextField id="q-name" label="Full Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
      <TextField id="q-email" label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField id="q-phone" label="Phone" type="tel" required autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
      <SelectField id="q-service" label="Service Interested In" required options={SERVICE_OPTIONS} placeholder="Select a service" error={errors.service?.message} {...register("service")} />
      <TextField id="q-location" label="Property Location" required wrapClassName="sm:col-span-2" placeholder="City, State or full address" autoComplete="street-address" error={errors.location?.message} {...register("location")} />
      <TextArea id="q-desc" label="Project Description" required wrapClassName="sm:col-span-2" placeholder="Describe your property and the look you'd like to achieve." error={errors.description?.message} {...register("description")} />
      <fieldset className="sm:col-span-2">
        <legend className="field-label">Preferred Contact Method</legend>
        <div className="flex flex-wrap gap-3">
          {METHODS.map((m) => (
            <label key={m.value} className={cn("cursor-pointer rounded-full border px-5 py-2.5 text-sm transition", method === m.value ? "border-gold bg-gold/15 text-champagne" : "border-line text-ivory/80 hover:border-gold")}>
              <input type="radio" value={m.value} className="sr-only" {...register("contactMethod")} />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Honeypot {...register("website")} />
      {serverError && (
        <div className="sm:col-span-2">
          <FormAlert kind="error">{serverError}</FormAlert>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted/70">No account required. No obligation.</p>
        <SubmitButton loading={isSubmitting}>Request My Quote</SubmitButton>
      </div>
    </form>
  );
}
