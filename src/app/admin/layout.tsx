import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Aura Admin" }, robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-slate-50 font-sans text-slate-900">{children}</div>;
}
