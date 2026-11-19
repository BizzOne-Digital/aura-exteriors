"use client";

import { forwardRef, useEffect, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { CircleCheck, CircleAlert, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FieldWrap({ id, label, error, required, children, className }: { id: string; label: string; error?: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type Common = { id: string; label: string; error?: string; required?: boolean; wrapClassName?: string };

export const TextField = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { id, label, error, required, wrapClassName, className, ...rest },
  ref,
) {
  return (
    <FieldWrap id={id} label={label} error={error} required={required} className={wrapClassName}>
      <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} aria-required={required} className={cn("field", className)} {...rest} />
    </FieldWrap>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { id, label, error, required, wrapClassName, className, ...rest },
  ref,
) {
  return (
    <FieldWrap id={id} label={label} error={error} required={required} className={wrapClassName}>
      <textarea ref={ref} id={id} rows={5} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} aria-required={required} className={cn("field resize-y", className)} {...rest} />
    </FieldWrap>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, Common & SelectHTMLAttributes<HTMLSelectElement> & { options: string[]; placeholder?: string }>(function SelectField(
  { id, label, error, required, wrapClassName, className, options, placeholder, ...rest },
  ref,
) {
  return (
    <FieldWrap id={id} label={label} error={error} required={required} className={wrapClassName}>
      <select ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} aria-required={required} className={cn("field", className)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
});

/** Hidden from people, tempting to bots. */
export function Honeypot(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="btn btn-gold w-full sm:w-auto">
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {loading ? "Sending…" : children}
    </button>
  );
}

export function FormAlert({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-md border p-4 text-sm leading-relaxed",
        kind === "error" ? "border-[#e07a6a]/50 bg-[#e07a6a]/10 text-[#f6c2b8]" : "border-gold/50 bg-gold/10 text-champagne",
      )}
    >
      {kind === "error" ? <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /> : <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" />}
      <div>{children}</div>
    </div>
  );
}

export type ApiResult = { ok?: boolean; error?: string; fields?: Record<string, string>; emailSent?: boolean; [k: string]: unknown };

export async function postJson(url: string, body: unknown): Promise<{ status: number; data: ApiResult }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as ApiResult;
    return { status: res.status, data };
  } catch {
    return { status: 0, data: { error: "Network error. Please check your connection and try again." } };
  }
}

/** Reads ?key=value from the URL on mount (keeps pages statically renderable instead of reading searchParams on the server). */
export function useQueryPrefill(apply: (params: URLSearchParams) => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => apply(new URLSearchParams(window.location.search)), []);
}
