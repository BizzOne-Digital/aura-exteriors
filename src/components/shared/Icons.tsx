import type { SVGProps } from "react";

export function LaurelBadge({ value = "40", label = "YEARS", ...props }: SVGProps<SVGSVGElement> & { value?: string; label?: string }) {
  const leaves = Array.from({ length: 6 });
  return (
    <svg viewBox="0 0 100 64" fill="none" aria-hidden="true" {...props}>
      {[1, -1].map((dir) => (
        <g key={dir} transform={dir === -1 ? "translate(100 0) scale(-1 1)" : undefined} stroke="#D9AD57" strokeWidth="1.6">
          <path d="M22 58 C 8 48, 6 26, 16 6" strokeLinecap="round" />
          {leaves.map((_, i) => {
            const t = i / 5;
            const y = 52 - t * 42;
            const x = 14 - Math.sin(t * Math.PI) * 5 + t * 2;
            return <ellipse key={i} cx={x - 4} cy={y} rx="5.5" ry="2.4" transform={`rotate(${-35 - t * 25} ${x - 4} ${y})`} fill="#D9AD57" fillOpacity="0.85" stroke="none" />;
          })}
        </g>
      ))}
      <text x="50" y="36" textAnchor="middle" fill="#F8F7F3" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 30, fontWeight: 600 }}>
        {value}
      </text>
      <text x="50" y="50" textAnchor="middle" fill="#F8F7F3" style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 7.5, letterSpacing: "0.18em", fontWeight: 600 }}>
        {label}
      </text>
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
