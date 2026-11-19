"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { contactSchema, SERVICE_OPTIONS } from "@/lib/validations";
import { TextField, TextArea, SelectField, Honeypot, SubmitButton, FormAlert, postJson, useQueryPrefill } from "./FormKit";

type In = z.input<typeof contactSchema>;
type Out = z.output<typeof contactSchema>;

export function ContactForm({ defaultSubject = "", defaultService = "" }: { defaultSubject?: string; defaultService?: string }) {
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState<{ emailSent: boolean } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", service: defaultService, subject: defaultSubject, message: "", website: "" },
  });

  useQueryPrefill((p) => {
    const subject = p.get("subject");
    const service = p.get("service");
    if (subject) setValue("subject", subject.slice(0, 200));
    if (service && SERVICE_OPTIONS.includes(service)) setValue("service", service);
  });

  const onSubmit = async (values: Out) => {
    setServerError("");
    const { status, data } = await postJson("/api/inquiries", values);
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
          <p className="font-semibold">Thank you. Your message has been received.</p>
          <p className="mt-1">
            Our team will review it and get back to you soon.
            {done.emailSent ? " A confirmation has been sent to your email." : ""}
          </p>
        </FormAlert>
        <button type="button" className="btn btn-outline" onClick={() => setDone(null)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <TextField id="c-name" label="Full Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
      <TextField id="c-email" label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField id="c-phone" label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
      <SelectField id="c-service" label="Service" options={SERVICE_OPTIONS} placeholder="Select a service (optional)" error={errors.service?.message} {...register("service")} />
      <TextField id="c-subject" label="Subject" required wrapClassName="sm:col-span-2" error={errors.subject?.message} {...register("subject")} />
      <TextArea id="c-message" label="Message" required wrapClassName="sm:col-span-2" placeholder="Tell us about your home and what you'd like to achieve." error={errors.message?.message} {...register("message")} />
      <Honeypot {...register("website")} />
      {serverError && (
        <div className="sm:col-span-2">
          <FormAlert kind="error">{serverError}</FormAlert>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted/70">We respect your privacy. Your details are used only to respond to your inquiry.</p>
        <SubmitButton loading={isSubmitting}>Send Message</SubmitButton>
      </div>
    </form>
  );
}
