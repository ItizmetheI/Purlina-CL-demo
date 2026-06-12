"use client";

import Reveal from "@/components/Reveal";

const BENEFITS = [
  {
    title: "Yeni regülasyon değişikliğine adaptasyon",
    description: "Değişen mevzuata anında uyum sağlayan esnek yapı.",
  },
  {
    title: "Kolaylık",
    description: "Mevcut sistemlere ek altyapı gerektirmeden entegre olur.",
  },
  {
    title: "Maliyet",
    description: "Düşük işletme maliyetiyle yüksek toplama verimi.",
  },
  {
    title: "Hız",
    description: "Anında reaksiyon, anında kirletici toplama performansı.",
  },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="relative flex min-h-screen flex-col px-6 pb-24 pt-32 sm:px-12 sm:pt-36 lg:px-20"
    >
      <Reveal>
        <p className="mb-3 font-display text-xs font-medium uppercase tracking-[0.5em] text-accent">
          Faydalar
        </p>
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Tek yapı, dört temel kazanım.
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={i * 100}>
            <div className="group h-full bg-surface/90 p-7 backdrop-blur-sm transition-colors hover:bg-white sm:p-9">
              <span className="font-display text-sm text-muted-2">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground sm:text-2xl">
                {b.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                {b.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
