"use client";

import Reveal from "@/components/Reveal";
import SectorOrbit from "@/components/SectorOrbit";

const SECTORS = ["Otomotiv", "Medikal", "Kozmetik", "Enerji", "Tekstil", "Gıda"];

export default function SectorShowcase() {
  return (
    <section className="relative flex min-h-[170vh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
      <SectorOrbit />

      <Reveal className="relative max-w-lg">
        <p className="mb-3 font-display text-xs font-medium uppercase tracking-[0.5em] text-accent">
          Sektör Örnekleri
        </p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Aynı sıvı yapı,
          <br />
          her sektörde.
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Form sıvı bir şerit gibi akarken, girdiği sektörlerin örneklerine
          göre şekillenir — temel toplama prensibi hiç değişmeden kalır.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-surface/80 px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-muted backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
