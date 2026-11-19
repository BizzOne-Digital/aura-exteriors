import Image from "next/image";
import { cn } from "@/lib/utils";
import { IMG } from "@/lib/images";

/** Aura Exteriors logo. Uses the uploaded logo from Admin → Settings when set, otherwise the brand file in /public. */
export function Logo({ logoUrl, className, compact = false }: { logoUrl?: string; className?: string; compact?: boolean }) {
  return (
    <span className={cn("relative block transition-all duration-500", compact ? "h-11 w-[111px]" : "h-14 w-[141px]", className)}>
      <Image src={logoUrl || IMG.logo} alt="Aura Exteriors" fill sizes="141px" className="object-contain object-left" priority />
    </span>
  );
}
