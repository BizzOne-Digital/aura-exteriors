"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown, Menu, Phone, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn, telHref } from "@/lib/utils";

type NavService = { slug: string; title: string };

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services", dropdown: true },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Header({ phone, logoUrl, tagline, services }: { phone: string; logoUrl: string; tagline: string; services: NavService[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setDropdown(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const openDrop = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(true);
  };
  const closeDrop = () => {
    closeTimer.current = setTimeout(() => setDropdown(false), 160);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-lux)]",
        scrolled ? "bg-midnight/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl" : "bg-midnight/95 lg:bg-midnight/90",
      )}
    >
      <div className={cn("container-lux flex max-w-[1480px] items-center justify-between gap-6 transition-all duration-500", scrolled ? "h-[72px]" : "h-[84px] lg:h-[94px]")}>
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Aura Exteriors home" className="shrink-0">
            <Logo logoUrl={logoUrl} compact={scrolled} className="transition-all duration-500" />
          </Link>
          <span className="hidden h-12 w-px bg-line 2xl:block" aria-hidden="true" />
          <p className="hidden max-w-[190px] text-[0.68rem] font-medium uppercase leading-relaxed tracking-[0.14em] text-ivory/85 2xl:block">{tagline}</p>
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 whitespace-nowrap xl:gap-8">
            {NAV.map((item) =>
              item.dropdown ? (
                <li key={item.href} className="relative" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
                  <div className="flex items-center gap-1">
                    <Link href={item.href} className="nav-link text-[0.92rem] font-medium text-ivory/90 transition-colors hover:text-champagne" aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-label="Show services menu"
                      aria-expanded={dropdown}
                      aria-controls="services-menu"
                      onClick={() => setDropdown((v) => !v)}
                      className="p-1 text-ivory/80 hover:text-champagne"
                    >
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", dropdown && "rotate-180")} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {dropdown && (
                      <motion.div
                        id="services-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-5"
                      >
                        <ul className="card-lux overflow-hidden bg-night/95 p-2 shadow-2xl backdrop-blur-xl">
                          {services.map((s) => (
                            <li key={s.slug}>
                              <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-3 rounded-md px-4 py-3 text-sm text-ivory/90 transition hover:bg-gold/10 hover:text-champagne">
                                {s.title}
                                <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                              </Link>
                            </li>
                          ))}
                          <li className="mt-1 border-t border-line">
                            <Link href="/services" className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:text-champagne">
                              View All Services
                            </Link>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link text-[0.92rem] font-medium text-ivory/90 transition-colors hover:text-champagne" aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/booking" className="btn btn-outline hidden !min-h-11 !px-4 !text-[0.88rem] md:inline-flex">
            <CalendarDays className="h-4 w-4 text-gold" />
            Book a Consultation
          </Link>
          <a href={telHref(phone)} className="hidden items-center gap-2 whitespace-nowrap text-[1.05rem] font-semibold text-ivory transition hover:text-champagne xl:flex">
            <Phone className="h-5 w-5 fill-gold text-gold" />
            {phone}
          </a>
          <a href={telHref(phone)} aria-label={`Call ${phone}`} className="grid h-11 w-11 place-items-center rounded-full border border-line text-gold lg:hidden">
            <Phone className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ivory lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-midnight/98 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Mobile" className="container-lux flex min-h-full flex-col py-8">
              <ul className="flex flex-col">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/5"
                  >
                    <Link
                      href={item.href}
                      className={cn("flex items-center justify-between py-4 font-serif text-[1.9rem] leading-none", isActive(item.href) ? "text-champagne" : "text-ivory")}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                      <ArrowRight className="h-5 w-5 text-gold" />
                    </Link>
                    {item.dropdown && (
                      <ul className="mb-4 ml-1 space-y-1 border-l border-line pl-4">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/services/${s.slug}`} className="block py-2 text-[0.95rem] text-muted hover:text-champagne">
                              {s.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-10">
                <Link href="/booking" className="btn btn-gold w-full">
                  <CalendarDays className="h-4 w-4" /> Book a Consultation
                </Link>
                <a href={telHref(phone)} className="btn btn-outline w-full">
                  <Phone className="h-4 w-4 text-gold" /> {phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
