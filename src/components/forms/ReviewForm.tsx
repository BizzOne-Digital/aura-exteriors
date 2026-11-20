"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Star } from "lucide-react";
import { reviewSchema } from "@/lib/validations";
import { TextField, TextArea, Honeypot, SubmitButton, FormAlert, postJson } from "./FormKit";
import { cn } from "@/lib/utils";

type In = z.input<typeof reviewSchema>;
type Out = z.output<typeof reviewSchema>;

export function ReviewForm() {
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(0);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { name: "", location: "", email: "", rating: 0, quote: "", website: "" },
  });
  const rating = watch("rating");

  const onSubmit = async (values: Out) => {
    setServerError("");
    const { status, data } = await postJson("/api/reviews", values);
    if (status >= 200 && status < 300 && data.ok) return setDone(true);
    if (data.fields) for (const [k, v] of Object.entries(data.fields)) setError(k as keyof In, { message: v });
    setServerError(data.error || "Something went wrong. Please try again.");
  };

  if (done) {
    return (
      <FormAlert kind="success">
        <p className="font-semibold">Thank you for your feedback!</p>
        <p className="mt-1">Your review has been received and will appear on this page once it has been reviewed by our team.</p>
      </FormAlert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="field-label">
          Your Rating <span className="text-gold">*</span>
        </legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(n)}
              onClick={() => setValue("rating", n, { shouldValidate: true })}
              className="p-1"
            >
              <Star className={cn("h-8 w-8 transition", (hover || rating) >= n ? "fill-gold text-gold" : "text-muted/40")} strokeWidth={1.4} />
            </button>
          ))}
        </div>
        {errors.rating && <p className="field-error" role="alert">{errors.rating.message}</p>}
      </fieldset>
      <TextField id="r-name" label="Your Name" required autoComplete="name" placeholder="e.g. Sarah M." error={errors.name?.message} {...register("name")} />
      <TextField id="r-location" label="City / Neighborhood" error={errors.location?.message} {...register("location")} />
      <TextField id="r-email" label="Email (not published)" type="email" required autoComplete="email" wrapClassName="sm:col-span-2" error={errors.email?.message} {...register("email")} />
      <TextArea id="r-quote" label="Your Review" required wrapClassName="sm:col-span-2" placeholder="Tell us about your experience with Aura Exteriors." error={errors.quote?.message} {...register("quote")} />
      <label className="flex items-start gap-3 text-sm text-muted sm:col-span-2">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[#D9AD57]" {...register("consent")} />
        I agree that Aura Exteriors may publish my review with my name and city on this website.
      </label>
      {errors.consent && <p className="field-error -mt-3 sm:col-span-2" role="alert">{errors.consent.message}</p>}
      <Honeypot {...register("website")} />
      {serverError && (
        <div className="sm:col-span-2">
          <FormAlert kind="error">{serverError}</FormAlert>
        </div>
      )}
      <div className="sm:col-span-2">
        <SubmitButton loading={isSubmitting}>Submit Review</SubmitButton>
      </div>
    </form>
  );
}
