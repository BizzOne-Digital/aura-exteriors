"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { api, labelize } from "./api";
import { Btn, Card, PageHeader, inputCls, useToast } from "./ui";
import { LocalImageField, type UploadFolder } from "./LocalImageField";
import { cn } from "@/lib/utils";

type Json = string | number | boolean | Json[] | { [k: string]: Json };

const IMAGE_KEY = /(image|logo|Image|Logo|logoUrl)$/;
const LONG_KEY = /(body|description|text|intro|disclaimer|answer|summary|details|note)$/i;

function setIn(obj: Json, path: (string | number)[], value: Json): Json {
  if (!path.length) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const o = obj as Record<string, Json>;
  return { ...o, [head]: setIn(o[head as string], rest, value) };
}

function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x)]));
}

function Field({
  path,
  value,
  onChange,
  hints,
  folder,
  depth,
}: {
  path: (string | number)[];
  value: Json;
  onChange: (path: (string | number)[], v: Json) => void;
  hints: Record<string, string>;
  folder: UploadFolder;
  depth: number;
}) {
  const key = String(path[path.length - 1] ?? "");
  const pathKey = path.filter((p) => typeof p === "string").join(".");
  const id = `f-${path.join("-")}`;
  const hint = hints[pathKey];
  const label = typeof path[path.length - 1] === "number" ? `Item ${(path[path.length - 1] as number) + 1}` : labelize(key);

  if (typeof value === "boolean") {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
        <input id={id} type="checkbox" checked={value} onChange={(e) => onChange(path, e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-amber-600" />
        {label}
        {hint && <span className="text-xs text-slate-400">({hint})</span>}
      </label>
    );
  }
  if (typeof value === "number") {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
        {hint && <p className="mb-1.5 text-xs text-slate-500">{hint}</p>}
        <input id={id} type="number" className={inputCls} value={value} onChange={(e) => onChange(path, Number(e.target.value))} />
      </div>
    );
  }
  if (typeof value === "string") {
    if (IMAGE_KEY.test(key)) return <LocalImageField id={id} label={label} value={value} onChange={(v) => onChange(path, v)} folder={folder} hint={hint} />;
    const long = LONG_KEY.test(key) || value.length > 90;
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
        {hint && <p className="mb-1.5 text-xs text-slate-500">{hint}</p>}
        {long ? (
          <textarea id={id} rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))} className={inputCls} value={value} onChange={(e) => onChange(path, e.target.value)} />
        ) : (
          <input id={id} className={inputCls} value={value} onChange={(e) => onChange(path, e.target.value)} />
        )}
      </div>
    );
  }
  if (Array.isArray(value)) {
    const stringList = value.every((v) => typeof v === "string");
    if (stringList) {
      return (
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
          <p className="mb-1.5 text-xs text-slate-500">{hint ?? "One item per line."}</p>
          <textarea
            id={id}
            rows={Math.max(3, value.length + 1)}
            className={inputCls}
            value={(value as string[]).join("\n")}
            onChange={(e) => onChange(path, e.target.value.split("\n"))}
            onBlur={(e) => onChange(path, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
      );
    }
    const move = (i: number, d: number) => {
      const copy = value.slice();
      const [it] = copy.splice(i, 1);
      copy.splice(i + d, 0, it);
      onChange(path, copy);
    };
    return (
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold text-slate-800">{label}</legend>
        {hint && <p className="-mt-1 text-xs text-slate-500">{hint}</p>}
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Remove item" onClick={() => onChange(path, value.filter((_, j) => j !== i))} className="rounded p-1.5 text-red-500 hover:bg-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Field path={[...path, i]} value={item} onChange={onChange} hints={hints} folder={folder} depth={depth + 1} />
          </div>
        ))}
        {value.length > 0 && (
          <Btn variant="secondary" onClick={() => onChange(path, [...value, blankLike(value[0])])}>
            <Plus className="h-4 w-4" /> Add item
          </Btn>
        )}
      </fieldset>
    );
  }
  // object
  const entries = Object.entries(value);
  const allBool = entries.every(([, v]) => typeof v === "boolean");
  const inner = (
    <div className={cn(allBool ? "flex flex-wrap gap-x-6 gap-y-3" : "grid gap-4 md:grid-cols-2")}>
      {entries.map(([k, v]) => {
        const wide = typeof v !== "string" || LONG_KEY.test(k) || IMAGE_KEY.test(k) || (typeof v === "string" && v.length > 90);
        return (
          <div key={k} className={cn(!allBool && wide && "md:col-span-2")}>
            <Field path={[...path, k]} value={v} onChange={onChange} hints={hints} folder={folder} depth={depth + 1} />
          </div>
        );
      })}
    </div>
  );
  if (depth === 0) return inner;
  if (typeof path[path.length - 1] === "number") return inner;
  return (
    <fieldset className="rounded-lg border border-slate-200 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-800">{label}</legend>
      {hint && <p className="mb-3 text-xs text-slate-500">{hint}</p>}
      {inner}
    </fieldset>
  );
}

/** Generic editor for singleton content (page content, settings, financing, availability). */
export function ObjectEditor({
  endpoint,
  title,
  description,
  hints = {},
  folder = "pages",
  sections,
}: {
  endpoint: string;
  title: string;
  description?: string;
  hints?: Record<string, string>;
  folder?: UploadFolder;
  /** Optional nicer titles for top-level keys. */
  sections?: Record<string, string>;
}) {
  const [data, setData] = useState<Record<string, Json> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api<{ data: Record<string, Json> }>(`/api/admin/singletons/${endpoint}`)
      .then((r) => setData(r.data))
      .catch((e) => toast("error", e.message));
  }, [endpoint, toast]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onChange = (path: (string | number)[], v: Json) => {
    setData((d) => setIn(d as Json, path, v) as Record<string, Json>);
    setDirty(true);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const r = await api<{ data: Record<string, Json> }>(`/api/admin/singletons/${endpoint}`, { method: "PUT", body: data });
      setData(r.data);
      setDirty(false);
      toast("success", "Saved. The website has been updated.");
    } catch (e) {
      toast("error", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const saveBtn = (
    <Btn onClick={save} disabled={!data || saving || !dirty}>
      {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {dirty ? "Save Changes" : "Saved"}
    </Btn>
  );

  return (
    <div>
      <PageHeader title={title} description={description} actions={saveBtn} />
      {!data ? (
        <Card className="grid place-items-center p-16">
          <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
        </Card>
      ) : (
        <div className="space-y-5">
          {Object.entries(data).some(([, v]) => typeof v !== "object") && (
            <Card className="p-5 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(data)
                  .filter(([, v]) => typeof v !== "object")
                  .map(([k, v]) => (
                    <div key={k} className={cn((IMAGE_KEY.test(k) || LONG_KEY.test(k) || (typeof v === "string" && v.length > 90)) && "md:col-span-2")}>
                      <Field path={[k]} value={v} onChange={onChange} hints={hints} folder={folder} depth={1} />
                    </div>
                  ))}
              </div>
            </Card>
          )}
          {Object.entries(data)
            .filter(([, v]) => typeof v === "object")
            .map(([k, v]) => (
              <Card key={k} className="p-5 md:p-6">
                <h2 className="mb-4 text-base font-bold text-slate-900">{sections?.[k] ?? labelize(k)}</h2>
                {hints[k] && Array.isArray(v) === false && <p className="-mt-3 mb-4 text-xs text-slate-500">{hints[k]}</p>}
                <Field path={[k]} value={v} onChange={onChange} hints={hints} folder={folder} depth={0} />
              </Card>
            ))}
          <div className="sticky bottom-4 flex justify-end">
            <div className="rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur">{saveBtn}</div>
          </div>
        </div>
      )}
    </div>
  );
}
