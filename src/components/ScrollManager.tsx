"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { scrollState } from "@/lib/scrollState";
import { FORM_KEYFRAMES } from "@/lib/keyframes";
import { SHATTER_SNAP_POINTS } from "@/lib/shatterTimeline";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollManager() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Lenis intercepts wheel/touch input and eases the page's scroll
    // position toward it every frame, instead of jumping straight to each
    // wheel event's delta. ScrollTrigger then reads that eased position, so
    // the 3D form's target progress changes smoothly instead of in steps.
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Magnetic scroll: once the user stops scrolling, ease toward whichever
    // narrative beat (the same progress values that drive the form's
    // keyframes) is closest, so each shape gets a moment to fully resolve
    // before the next transition begins.
    const snapPoints = Array.from(
      new Set([...FORM_KEYFRAMES.map((k) => k.progress), ...SHATTER_SNAP_POINTS]),
    ).sort((a, b) => a - b);

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.3, max: 0.9 },
        delay: 0.08,
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
}
