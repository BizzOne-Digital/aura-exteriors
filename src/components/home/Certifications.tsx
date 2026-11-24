import Image from "next/image";
import { SectionHeading } from "@/components/shared/sections";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import type { HomeContent } from "@/lib/defaults";

/** Installer and dealer credentials issued by the company's lighting suppliers. */
export function Certifications({ data }: { data: HomeContent["certifications"] }) {
  const items = data.items.filter((i) => i.image);
  if (!items.length) return null;
  return (
    <section className="bg-midnight py-24 md:py-32">
      <div className="container-lux">
        <SectionHeading eyebrow={data.label} title={data.heading} align="center" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-[1.05rem] leading-relaxed text-muted">{data.text}</p>
        <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {items.map((c, i) => (
            <StaggerItem key={i}>
              <figure className="card-lux flex h-full flex-col p-6 text-center sm:p-8">
                <div className="relative h-64 sm:h-72">
                  <Image src={c.image} alt={`${c.title} credential`} fill sizes="(max-width:768px) 100vw, 480px" className="object-contain" />
                </div>
                <figcaption className="mt-7">
                  <h3 className="font-serif text-[1.6rem] leading-tight text-ivory">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
