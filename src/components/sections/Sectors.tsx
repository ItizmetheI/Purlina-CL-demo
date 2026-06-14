"use client";

import Reveal from "@/components/Reveal";

export default function Sectors() {
  return (
    <section
      id="sectors"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 sm:px-12 lg:px-20"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-0.05em] top-1/2 -translate-y-1/2 select-none font-display text-[clamp(12rem,28vw,22rem)] font-semibold leading-none tracking-tight text-foreground/[0.03]"
      >
        900+
      </span>

      <Reveal className="relative max-w-xl">
        <p className="mb-4 font-display text-[10px] font-medium uppercase tracking-[0.6em] text-accent">
          Uyumluluk
        </p>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground">
          <span className="text-accent">900+</span> sektöre
          <br />
          uyumlanabilen yapı
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          Girdiği her sektörün ürününe göre şeklini alır — otomotiv
          lastiğinden ilaca, kozmetikten enerjiye kadar her alanda aynı temel
          prensiple çalışır.
        </p>
      </Reveal>
    </section>
  );
}
