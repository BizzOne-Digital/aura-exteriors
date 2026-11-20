import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Mic, Palette, Smartphone, Timer } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import type { HomeContent } from "@/lib/defaults";

/** Roofline outline (two gables) used to place the "bulbs". */
const ROOF: [number, number][] = [
  [8, 78],
  [68, 26],
  [128, 78],
  [168, 46],
  [232, 78],
];

function bulbPoints(count: number) {
  const segs = ROOF.slice(1).map((p, i) => ({ a: ROOF[i], b: p, len: Math.hypot(p[0] - ROOF[i][0], p[1] - ROOF[i][1]) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  return Array.from({ length: count }, (_, i) => {
    let d = (i / (count - 1)) * total;
    for (const s of segs) {
      if (d <= s.len) return [s.a[0] + ((s.b[0] - s.a[0]) * d) / s.len, s.a[1] + ((s.b[1] - s.a[1]) * d) / s.len];
      d -= s.len;
    }
    return ROOF[ROOF.length - 1];
  });
}
const POINTS = bulbPoints(30);

const safeColors = (s: string) =>
  s
    .split(",")
    .map((c) => c.trim())
    .filter((c) => /^#[0-9a-f]{3,8}$/i.test(c));

/** Illustration of a home's roofline lit in a color pattern. Shown until a real photo is added in Admin. */
export function RooflinePattern({ colors, id }: { colors: string[]; id: string }) {
  const palette = colors.length ? colors : ["#ffd9a0"];
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full" role="img" aria-label={`Roofline lights in ${palette.length > 1 ? "a multicolor" : "a single color"} pattern`}>
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <linearGradient id={`sky-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0b1a33" />
          <stop offset="1" stopColor="#050c16" />
        </linearGradient>
      </defs>
      <rect width="240" height="120" fill={`url(#sky-${id})`} />
      {/* house silhouette */}
      <path d="M8 78 L68 26 L128 78 L168 46 L232 78 L232 120 L8 120 Z" fill="#0f1b2c" />
      <path d="M20 78 V120 M116 78 V120 M140 66 V120 M220 74 V120" stroke="#142338" strokeWidth="1" />
      <rect x="52" y="86" width="14" height="14" rx="1" fill="#2a2416" opacity=".9" />
      <rect x="74" y="86" width="14" height="14" rx="1" fill="#2a2416" opacity=".9" />
      <rect x="160" y="84" width="16" height="22" rx="1" fill="#2a2416" opacity=".9" />
      {/* glow layer */}
      <g filter={`url(#glow-${id})`} opacity=".9">
        {POINTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={palette[i % palette.length]} />
        ))}
      </g>
      {/* bulbs */}
      {POINTS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1.9"
          fill={palette[i % palette.length]}
          className="twinkle"
          style={{ animationDelay: `${(i % 7) * 0.35}s` }}
        />
      ))}
    </svg>
  );
}

const SMART_ICONS = [Palette, Smartphone, Timer, Mic];

export function Occasions({ data }: { data: HomeContent["occasions"] }) {
  return (
    <section className="relative overflow-hidden bg-midnight py-24 md:py-32" id="occasions">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="container-lux">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4">{data.label}</p>
          <h2 className="h-display text-[2.4rem] text-ivory sm:text-5xl lg:text-[3.4rem]">{data.heading}</h2>
          <span className="gold-rule mx-auto mt-6" />
          <p className="mt-6 text-[1.05rem] leading-relaxed text-muted">{data.text}</p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((o, i) => {
            const colors = safeColors(o.colors);
            return (
              <StaggerItem key={i}>
                <article className="group card-lux h-full overflow-hidden transition duration-500 hover:-translate-y-1 hover:border-gold/70">
                  <div className="relative aspect-[2/1] overflow-hidden">
                    {o.image ? (
                      <Image src={o.image} alt={`${o.title} lighting`} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <RooflinePattern colors={colors} id={`occ-${i}`} />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-serif text-[1.45rem] leading-tight text-ivory">{o.title}</h3>
                      <span className="flex shrink-0 -space-x-1" aria-hidden="true">
                        {colors.slice(0, 5).map((c) => (
                          <span key={c} className="h-3.5 w-3.5 rounded-full border border-midnight" style={{ background: c }} />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{o.text}</p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-14">
          <div className="grid items-center gap-8 rounded-xl border border-line bg-[linear-gradient(110deg,#0b1a2e_0%,#10294a_50%,#0b1a2e_100%)] p-7 md:p-10 lg:grid-cols-[1fr_1.4fr_auto]">
            <h3 className="h-display text-3xl text-ivory md:text-4xl">{data.smartHeading}</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {data.smartPoints.map((p, i) => {
                const Icon = SMART_ICONS[i] ?? Check;
                return (
                  <li key={p} className="flex items-start gap-3 text-[0.95rem] text-ivory/90">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    {p}
                  </li>
                );
              })}
            </ul>
            <Link href="/services/roofline-lighting" className="btn btn-gold">
              Explore Permanent Lights <ArrowRight className="arrow h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function NeverLadder({ data }: { data: HomeContent["ladder"] }) {
  return (
    <section className="relative bg-night py-24 md:py-32">
      <div className="container-lux">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal direction="left">
            <p className="eyebrow mb-4">{data.label}</p>
            <h2 className="h-display text-[2.6rem] text-ivory sm:text-6xl lg:text-[4rem]">{data.heading}</h2>
            <span className="gold-rule mt-6" />
          </Reveal>
          <Reveal direction="right">
            <p className="text-[1.08rem] leading-relaxed text-muted">{data.text}</p>
          </Reveal>
        </div>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {data.items.map((it, i) => (
            <StaggerItem key={i}>
              <Link href={it.link?.startsWith("/") && !it.link.startsWith("//") ? it.link : "/services"} className="group card-lux block h-full overflow-hidden transition duration-500 hover:-translate-y-1 hover:border-gold">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {it.image && <Image src={it.image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="night-grade object-cover transition duration-[1.2s] group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-gold/70 bg-midnight/70 font-serif text-lg text-champagne backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-[1.6rem] leading-tight text-ivory">{it.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{it.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:text-champagne">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
