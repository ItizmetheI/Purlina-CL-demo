"use client";

import { useState } from "react";
import Experience from "@/components/Experience";
import ScrollManager from "@/components/ScrollManager";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import IntroSequence from "@/components/IntroSequence";
import FilmGrain from "@/components/FilmGrain";
import VignetteOverlay from "@/components/VignetteOverlay";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <IntroSequence onComplete={() => setIntroComplete(true)} />
      <ScrollManager />
      <Experience />
      <VignetteOverlay />
      <FilmGrain />
      {introComplete && <Header />}
      <ScrollProgress />
      <main className="relative z-10 pointer-events-none">
        <div id="top" style={{ height: "100vh" }} />
        <div id="benefits" style={{ height: "100vh" }} />
        <div id="sectors" style={{ height: "100vh" }} />
        <div id="showcase" style={{ height: "140vh" }} />
        <div id="cta" style={{ height: "100vh" }} />
      </main>
    </>
  );
}
