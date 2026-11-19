"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Toasts ---------- */
type Toast = { id: number; kind: "success" | "error"; message: string };
const ToastCtx = createContext<(kind: Toast["kind"], message: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast["kind"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 7000 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} role={t.kind === "error" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg border bg-white p-4 text-sm shadow-lg", t.kind === "error" ? "border-red-200 text-red-800" : "border-emerald-200 text-emerald-800")}>
            {t.kind === "error" ? <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />}
            <p className="flex-1 whitespace-pre-line">{t.message}</p>
            <button type="button" aria-label="Dismiss" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>
              <X className="h-4 w-4 opacity-60" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Primitives ---------- */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function Btn({
  children,
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-slate-900 text-white hover:bg-slate-700",
        variant === "secondary" && "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
        variant === "danger" && "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

export function Label({ children, htmlFor, hint }: { children: ReactNode; htmlFor?: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {children}
      </label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-sky-100 text-sky-800",
  cancelled: "bg-slate-200 text-slate-600",
  new: "bg-amber-100 text-amber-800",
  read: "bg-sky-100 text-sky-800",
  archived: "bg-slate-200 text-slate-600",
  contacted: "bg-sky-100 text-sky-800",
  quoted: "bg-violet-100 text-violet-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-700",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700")}>{status}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">{children}</div>;
}
