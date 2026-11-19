"use client";

import { useState } from "react";
import { LoaderCircle, Lock } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-svh place-items-center bg-[#07111D] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={submit} className="rounded-2xl bg-white p-7 shadow-2xl" noValidate>
          <div className="mb-6 flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600" />
            <h1 className="text-lg font-bold text-slate-900">Admin Sign In</h1>
          </div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
          {error && (
            <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading || !email || !password} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />} Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
