"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { api, ApiError } from "./api";
import { Btn, Card, Empty, PageHeader, inputCls, useToast } from "./ui";
import { LocalImageField, type UploadFolder } from "./LocalImageField";
import { cn } from "@/lib/utils";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "boolean" | "select" | "lines" | "url";
  options?: string[];
  hint?: string;
  required?: boolean;
  wide?: boolean;
};

type Item = Record<string, unknown> & { _id: string };

export function CollectionManager({
  collection,
  title,
  description,
  fields,
  folder = "misc",
  canCreate = true,
  canDelete = true,
  primary,
  secondary,
  imageField,
  activeField,
  defaults,
  notice,
}: {
  collection: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  folder?: UploadFolder;
  canCreate?: boolean;
  canDelete?: boolean;
  primary: string;
  secondary?: string;
  imageField?: string;
  activeField?: string;
  defaults: Record<string, unknown>;
  notice?: React.ReactNode;
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown> } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const toast = useToast();

  const load = useCallback(() => {
    api<{ items: Item[] }>(`/api/admin/collections/${collection}`)
      .then((r) => setItems(r.items))
      .catch((e) => toast("error", e.message));
  }, [collection, toast]);
  useEffect(load, [load]);

  const pickValues = (src: Record<string, unknown>) => Object.fromEntries(fields.map((f) => [f.name, src[f.name] ?? defaults[f.name]]));

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setErrors({});
    const body = { ...editing.values };
    for (const f of fields) {
      if (f.type !== "lines") continue;
      const raw = body[f.name];
      body[f.name] = (Array.isArray(raw) ? raw.join("\n") : String(raw ?? "")).split("\n").map((s) => s.trim()).filter(Boolean);
    }
    try {
      if (editing.id) await api(`/api/admin/collections/${collection}/${editing.id}`, { method: "PATCH", body });
      else await api(`/api/admin/collections/${collection}`, { method: "POST", body });
      toast("success", "Saved. The website has been updated.");
      setEditing(null);
      load();
    } catch (e) {
      if (e instanceof ApiError && e.fields) setErrors(e.fields);
      toast("error", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Item) => {
    if (!confirm(`Delete "${String(item[primary]).slice(0, 60)}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/collections/${collection}/${item._id}`, { method: "DELETE" });
      toast("success", "Deleted.");
      load();
    } catch (e) {
      toast("error", (e as Error).message);
    }
  };

  const toggle = async (item: Item) => {
    if (!activeField) return;
    try {
      await api(`/api/admin/collections/${collection}/${item._id}`, { method: "PATCH", body: { ...pickValues(item), [activeField]: !item[activeField] } });
      load();
    } catch (e) {
      toast("error", (e as Error).message);
    }
  };

  const move = (i: number, d: number) => {
    if (!items) return;
    const copy = items.slice();
    const [it] = copy.splice(i, 1);
    copy.splice(i + d, 0, it);
    setItems(copy);
    setOrderDirty(true);
  };

  const saveOrder = async () => {
    if (!items) return;
    try {
      await api(`/api/admin/collections/${collection}/reorder`, { method: "POST", body: { ids: items.map((i) => i._id) } });
      setOrderDirty(false);
      toast("success", "Order saved.");
    } catch (e) {
      toast("error", (e as Error).message);
    }
  };

  const setVal = (name: string, v: unknown) => setEditing((e) => (e ? { ...e, values: { ...e.values, [name]: v } } : e));

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {orderDirty && (
              <Btn onClick={saveOrder}>
                <Save className="h-4 w-4" /> Save Order
              </Btn>
            )}
            {canCreate && (
              <Btn onClick={() => setEditing({ id: null, values: { ...defaults } })}>
                <Plus className="h-4 w-4" /> Add New
              </Btn>
            )}
          </>
        }
      />
      {notice && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{notice}</div>}

      {!items ? (
        <Card className="grid place-items-center p-16">
          <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
        </Card>
      ) : items.length === 0 ? (
        <Empty>No items yet.{canCreate && " Click “Add New” to create one."}</Empty>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={item._id}>
              <Card className={cn("flex items-center gap-3 p-3 sm:gap-4", activeField && !item[activeField] && "opacity-60")}>
                <div className="flex flex-col">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                {imageField && (
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item[imageField] ? <img src={String(item[imageField])} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{String(item[primary] ?? "")}</p>
                  {secondary && <p className="truncate text-xs text-slate-500">{String(item[secondary] ?? "")}</p>}
                </div>
                <div className="flex shrink-0 gap-1">
                  {activeField && (
                    <button type="button" onClick={() => toggle(item)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label={item[activeField] ? "Hide from website" : "Show on website"} title={item[activeField] ? "Visible (click to hide)" : "Hidden (click to show)"}>
                      {item[activeField] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  )}
                  <button type="button" onClick={() => setEditing({ id: item._id, values: pickValues(item) })} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  {canDelete && (
                    <button type="button" onClick={() => remove(item)} className="rounded-md p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={editing.id ? "Edit item" : "New item"}>
          <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">{editing.id ? "Edit" : "Add New"}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-md p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {fields.map((f) => {
                const id = `cm-${f.name}`;
                const v = editing.values[f.name];
                const err = errors[f.name];
                if (f.type === "image")
                  return (
                    <div key={f.name}>
                      <LocalImageField id={id} label={f.label + (f.required ? " *" : "")} value={String(v ?? "")} onChange={(x) => setVal(f.name, x)} folder={folder} hint={f.hint} />
                      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
                    </div>
                  );
                if (f.type === "boolean")
                  return (
                    <label key={f.name} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <input type="checkbox" checked={Boolean(v)} onChange={(e) => setVal(f.name, e.target.checked)} className="h-4 w-4 accent-amber-600" />
                      {f.label}
                      {f.hint && <span className="text-xs text-slate-400">· {f.hint}</span>}
                    </label>
                  );
                return (
                  <div key={f.name}>
                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                      {f.label}
                      {f.required && <span className="text-red-500"> *</span>}
                    </label>
                    {f.hint && <p className="mb-1.5 text-xs text-slate-500">{f.hint}</p>}
                    {f.type === "textarea" || f.type === "lines" ? (
                      <textarea
                        id={id}
                        rows={f.type === "lines" ? 6 : 5}
                        className={inputCls}
                        value={Array.isArray(v) ? v.join("\n") : String(v ?? "")}
                        onChange={(e) => setVal(f.name, e.target.value)}
                      />
                    ) : f.type === "select" ? (
                      <select id={id} className={inputCls} value={String(v ?? "")} onChange={(e) => setVal(f.name, e.target.value)}>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o || "None"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input id={id} type={f.type === "url" ? "url" : "text"} className={inputCls} value={String(v ?? "")} onChange={(e) => setVal(f.name, e.target.value)} />
                    )}
                    {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <Btn variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn onClick={save} disabled={saving}>
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
