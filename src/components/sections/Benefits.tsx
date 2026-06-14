"use client";

import Reveal from "@/components/Reveal";

const BENEFITS = [
  { n: "01", title: "Adaptasyon", desc: "Değişen mevzuata anında uyum sağlayan esnek yapı." },
  { n: "02", title: "Kolaylık", desc: "Mevcut sistemlere ek altyapı gerektirmeden entegre olur." },
  { n: "03", title: "Maliyet", desc: "Düşük işletme maliyetiyle yüksek toplama verimi." },
  { n: "04", title: "Hız", desc: "Anında reaksiyon, anında kirletici toplama performansı." },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="relative flex min-h-screen flex-col justify-center px-6 sm:px-12 lg:px-20"
    >
      <Reveal>
        <p className="mb-4 font-display text-[10px] font-medium uppercase tracking-[0.6em] text-accent">
          Faydalar
        </p>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1] tracking-[-0.02em] text-foreground">
          Tek yapı,
          <br />
          <span className="text-foreground/40">dört temel</span>
          <br />
          kazanım.
        </h2>
      </Reveal>

      <div className="mt-16 grid max-w-2xl grid-cols-1 gap-0 sm:grid-cols-2">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.n} delay={i * 80}>
            <div className="border-t border-foreground/8 py-8 pr-12">
              <span className="font-display text-xs text-muted-2">{b.n}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
