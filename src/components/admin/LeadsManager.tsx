"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, Mail, Phone, Search, Trash2, X } from "lucide-react";
import { api, fmtDateTime } from "./api";
import { Btn, Card, Empty, PageHeader, StatusBadge, inputCls, useToast } from "./ui";
import { cn } from "@/lib/utils";

type Lead = Record<string, unknown> & { _id: string; status: string; createdAt: string };

export type LeadConfig = {
  collection: "bookings" | "inquiries" | "quotes";
  title: string;
  description: string;
  statuses: string[];
  /** [key, label] rows shown in the detail drawer */
  detail: [string, string][];
  title1: (l: Lead) => string;
  title2: (l: Lead) => string;
  hasNotes?: boolean;
  dateFilter?: boolean;
  /** Mark as read automatically when opened (inquiries) */
  autoRead?: boolean;
};

const fmt12 = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

export function formatBookingWhen(l: Record<string, unknown>) {
  const d = String(l.date ?? "");
  const [y, m, day] = d.split("-").map(Number);
  const date = d ? new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";
  return l.mode === "scheduled" ? `${date} · ${fmt12(String(l.time))}` : `${date} · ${l.timeWindow || "Flexible"} (requested)`;
}

export function LeadsManager({ cfg }: { cfg: LeadConfig }) {
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: Lead[]; total: number; pages: number } | null>(null);
  const [open, setOpen] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const load = useCallback(() => {
    const sp = new URLSearchParams({ status, page: String(page) });
    if (query) sp.set("q", query);
    if (date) sp.set("date", date);
    api<{ items: Lead[]; total: number; pages: number }>(`/api/admin/collections/${cfg.collection}?${sp}`)
      .then(setData)
      .catch((e) => toast("error", e.message));
  }, [cfg.collection, status, page, query, date, toast]);
  useEffect(load, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const update = async (lead: Lead, body: Record<string, unknown>, quiet = false) => {
    setBusy(true);
    try {
      const r = await api<{ item: Lead }>(`/api/admin/collections/${cfg.collection}/${lead._id}`, { method: "PATCH", body });
      setOpen((o) => (o && o._id === lead._id ? { ...o, ...r.item } : o));
      if (!quiet) toast("success", "Updated.");
      load();
    } catch (e) {
      toast("error", (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (lead: Lead) => {
    if (!confirm("Permanently delete this record? This cannot be undone.")) return;
    try {
      await api(`/api/admin/collections/${cfg.collection}/${lead._id}`, { method: "DELETE" });
      toast("success", "Deleted.");
      setOpen(null);
      load();
    } catch (e) {
      toast("error", (e as Error).message);
    }
  };

  const openLead = (l: Lead) => {
    setOpen(l);
    setNotes(String(l.adminNotes ?? ""));
    if (cfg.autoRead && l.status === "new") update(l, { status: "read" }, true);
  };

  return (
    <div>
      <PageHeader title={cfg.title} description={cfg.description} />
      <Card className="mb-4 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by status">
            {["all", ...cfg.statuses].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                aria-pressed={status === s}
                className={cn("rounded-md px-3 py-1.5 text-sm font-medium capitalize transition", status === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100")}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {cfg.dateFilter && (
              <input type="date" aria-label="Filter by date" className={cn(inputCls, "sm:w-44")} value={date} onChange={(e) => (setDate(e.target.value), setPage(1))} />
            )}
            <label className="relative">
              <span className="sr-only">Search</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={cn(inputCls, "pl-9 sm:w-64")} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          </div>
        </div>
      </Card>

      {!data ? (
        <Card className="grid place-items-center p-16">
          <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
        </Card>
      ) : data.items.length === 0 ? (
        <Empty>No records match these filters.</Empty>
      ) : (
        <>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {data.items.map((l) => (
                <li key={l._id}>
                  <button type="button" onClick={() => openLead(l)} className={cn("flex w-full items-center gap-4 px-4 py-3.5 text-left transition hover:bg-slate-50", l.status === "new" && "bg-amber-50/40")}>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm text-slate-900", l.status === "new" ? "font-bold" : "font-semibold")}>{cfg.title1(l)}</p>
                      <p className="truncate text-xs text-slate-500">{cfg.title2(l)}</p>
                    </div>
                    <span className="hidden text-xs text-slate-400 sm:block">{fmtDateTime(l.createdAt)}</span>
                    <StatusBadge status={l.status} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{data.total} total</span>
            <div className="flex items-center gap-2">
              <Btn variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Btn>
              <span>
                Page {page} of {data.pages}
              </span>
              <Btn variant="secondary" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Btn>
            </div>
          </div>
        </>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Record details" onClick={() => setOpen(null)}>
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-900">{cfg.title1(open)}</h2>
                <p className="text-xs text-slate-500">Received {fmtDateTime(open.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="rounded-md p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-2">
                {open.email ? (
                  <a href={`mailto:${String(open.email)}`} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
                {open.phone ? (
                  <a href={`tel:${String(open.phone).replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Phone className="h-4 w-4" /> Call
                  </a>
                ) : null}
              </div>
              <div>
                <label htmlFor="lead-status" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select id="lead-status" className={inputCls} value={open.status} disabled={busy} onChange={(e) => update(open, { status: e.target.value })}>
                  {cfg.statuses.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {cfg.detail.map(([k, label]) => {
                  const v = k === "__when" ? formatBookingWhen(open) : String(open[k] ?? "");
                  if (!v) return null;
                  return (
                    <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[140px_1fr]">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                      <dd className="whitespace-pre-wrap break-words text-sm text-slate-900">{v}</dd>
                    </div>
                  );
                })}
              </dl>
              {cfg.hasNotes && (
                <div>
                  <label htmlFor="lead-notes" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Internal Notes
                  </label>
                  <textarea id="lead-notes" rows={4} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Visible to admins only" />
                  <Btn className="mt-2" variant="secondary" disabled={busy || notes === String(open.adminNotes ?? "")} onClick={() => update(open, { adminNotes: notes })}>
                    Save Notes
                  </Btn>
                </div>
              )}
            </div>
            <div className="flex justify-between border-t border-slate-200 px-5 py-4">
              <Btn variant="danger" onClick={() => remove(open)}>
                <Trash2 className="h-4 w-4" /> Delete
              </Btn>
              <Btn variant="secondary" onClick={() => setOpen(null)}>
                Close
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
