"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleHelp,
  ExternalLink,
  FileText,
  Images,
  Landmark,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Receipt,
  Settings,
  Sparkles,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Leads",
    items: [
      { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
      { href: "/admin/availability", label: "Availability", icon: Clock },
      { href: "/admin/inquiries", label: "Contact Inquiries", icon: Mail },
      { href: "/admin/quotes", label: "Quote Requests", icon: Receipt },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/content", label: "Page Content", icon: FileText },
      { href: "/admin/services", label: "Services", icon: Sparkles },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/financing", label: "Financing", icon: Landmark },
      { href: "/admin/suppliers", label: "Supplier Links", icon: Link2 },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar({ email, counts }: { email: string; counts: Record<string, number> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#07111D] font-serif text-lg text-[#F0D18A]">A</span>
        <div>
          <p className="text-sm font-bold text-white">Aura Exteriors</p>
          <p className="text-xs text-slate-400">Admin Portal</p>
        </div>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mb-1 px-3 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname.startsWith(it.href);
                const count = counts[it.href];
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active ? "bg-white/10 font-semibold text-white" : "text-slate-300 hover:bg-white/5 hover:text-white")}
                    >
                      <it.icon className={cn("h-4 w-4", active ? "text-[#D9AD57]" : "")} />
                      <span className="flex-1">{it.label}</span>
                      {count ? <span className="rounded-full bg-[#D9AD57] px-2 py-0.5 text-[0.68rem] font-bold text-[#07111D]">{count}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View Website
        </a>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </form>
        <p className="truncate px-3 pt-1 text-xs text-slate-500">{email}</p>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <p className="font-bold text-slate-900">Aura Admin</p>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 hover:bg-slate-100">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#0b1524] lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="relative h-full w-72 bg-[#0b1524]" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-5 rounded-md p-1.5 text-slate-300 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
