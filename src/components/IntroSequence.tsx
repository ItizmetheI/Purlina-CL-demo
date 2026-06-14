"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    gsap
      .timeline()
      .set(el, { opacity: 1 })
      .to(el, { opacity: 0, duration: 1.8, delay: 0.5, ease: "power2.inOut", onComplete })
      .set(el, { display: "none" });
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#07090d",
        pointerEvents: "none",
      }}
    />
  );
}
