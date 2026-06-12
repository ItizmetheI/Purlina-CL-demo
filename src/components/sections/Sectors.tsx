"use client";

import Reveal from "@/components/Reveal";

export default function Sectors() {
  return (
    <section
      id="sectors"
      className="relative flex min-h-screen flex-col items-end justify-center px-6 py-24 text-right sm:px-12 lg:px-20"
    >
      <Reveal className="max-w-xl rounded-[2rem] bg-background/55 px-5 py-6 backdrop-blur-xl sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <p className="mb-3 font-display text-xs font-medium uppercase tracking-[0.5em] text-accent">
          Uyumluluk
        </p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          900<span className="text-accent">+</span> sektöre
          <br />
          uyumlanabilen yapı
        </h2>
        <p className="mt-6 ml-auto max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Girdiği her sektörün ürününe göre şeklini alır — otomotiv
          lastiğinden ilaca, kozmetikten enerjiye kadar her alanda aynı temel
          prensiple çalışır.
        </p>
      </Reveal>
    </section>
  );
}
