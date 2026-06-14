"use client";

import Reveal from "@/components/Reveal";
import SectorOrbit from "@/components/SectorOrbit";

const SECTORS = ["Otomotiv", "Medikal", "Kozmetik", "Enerji", "Tekstil", "Gıda"];

export default function SectorShowcase() {
  return (
    <section className="relative flex min-h-[140vh] flex-col justify-center overflow-hidden px-6 sm:px-12 lg:px-20">
      <SectorOrbit />

      <Reveal className="relative max-w-lg">
        <p className="mb-4 font-display text-[10px] font-medium uppercase tracking-[0.6em] text-accent">
          Sektör Örnekleri
        </p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground">
          Aynı sıvı yapı,
          <br />
          her sektörde.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Form sıvı bir şerit gibi akarken, girdiği sektörlerin örneklerine
          göre şekillenir — temel toplama prensibi hiç değişmeden kalır.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <span
              key={s}
              className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 py-2 font-display text-[10px] uppercase tracking-[0.2em] text-muted backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
