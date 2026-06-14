"use client";

import { useEffect, useRef } from "react";
import { scrollState } from "@/lib/scrollState";

// Chapter markers matching FORM_KEYFRAMES progress values — each one is a
// narrative beat the 3D form settles into.
const CHAPTERS = [
  { progress: 0, label: "Giriş" },
  { progress: 0.32, label: "Faydalar" },
  { progress: 0.5, label: "Uyumluluk" },
  { progress: 0.7, label: "Sektörler" },
  { progress: 1.0, label: "Başlayın" },
];

export default function ScrollProgress() {
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      const p = scrollState.progress;

      let nearest = 0;
      let nearestDist = Infinity;
      CHAPTERS.forEach((c, i) => {
        const d = Math.abs(c.progress - p);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      });

      dotsRef.current.forEach((dot, i) => {
        if (dot) dot.dataset.active = i === nearest ? "true" : "false";
      });

      if (fillRef.current) {
        fillRef.current.style.height = `${THREE_CLAMP(p) * 100}%`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = (progress: number) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: progress * max, behavior: "smooth" });
  };

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex lg:right-10">
      <div className="relative flex flex-col items-center gap-6 py-2">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground/8" />
        <div
          ref={fillRef}
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-accent transition-[height] duration-150 ease-out"
        />
        {CHAPTERS.map((c, i) => (
          <button
            key={c.label}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            type="button"
            onClick={() => handleClick(c.progress)}
            aria-label={c.label}
            data-active="false"
            className="pointer-events-auto group relative z-10 flex h-3 w-3 items-center justify-center rounded-full border border-foreground/15 bg-background transition-colors data-[active=true]:border-accent data-[active=true]:bg-accent data-[active=true]:shadow-[0_0_8px_2px_rgba(14,163,116,0.4)]"
          >
            <span className="pointer-events-none absolute right-5 whitespace-nowrap rounded-full bg-surface px-2 py-1 font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {c.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function THREE_CLAMP(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
