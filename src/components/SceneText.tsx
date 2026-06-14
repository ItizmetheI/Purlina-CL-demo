"use client";

import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";

interface TextScene {
  position: [number, number, number];
  visibleFrom: number;
  visibleTo: number;
  peakAt: number;
  content: React.ReactNode;
}

const SCENES: TextScene[] = [
  // Scene 1 — Hero
  {
    position: [-1.6, -0.4, 0],
    visibleFrom: 0,
    visibleTo: 0.25,
    peakAt: 0.0,
    content: (
      <div style={{ width: "520px", pointerEvents: "none", userSelect: "none" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: "#0ea374",
            marginBottom: "20px",
            opacity: 0.8,
          }}
        >
          Yeni Nesil Toplama Teknolojisi
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "#f0f2f5",
            margin: 0,
          }}
        >
          Kirliliği
          <br />
          <span style={{ color: "rgba(240,242,245,0.45)" }}>toplayan</span>
          <br />
          sıvı matris.
        </h1>
        <p
          style={{
            marginTop: "24px",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#6b7280",
            maxWidth: "340px",
          }}
        >
          Hidrofobik organik kirleticileri fiziksel olarak bünyesine alır —
          suda dağılmadan Purlina fazında toplanır.
        </p>
      </div>
    ),
  },

  // Scene 2 — Benefits
  {
    position: [-1.8, 1.0, -0.5],
    visibleFrom: 0.2,
    visibleTo: 0.48,
    peakAt: 0.32,
    content: (
      <div style={{ width: "480px", pointerEvents: "none", userSelect: "none" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: "#0ea374",
            marginBottom: "16px",
          }}
        >
          Faydalar
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#f0f2f5",
            margin: "0 0 40px 0",
          }}
        >
          Tek yapı,
          <br />
          <span style={{ color: "rgba(240,242,245,0.35)" }}>dört temel</span>
          <br />
          kazanım.
        </h2>
        {[
          { n: "01", t: "Adaptasyon", d: "Değişen mevzuata anında uyum." },
          { n: "02", t: "Kolaylık", d: "Ek altyapı gerektirmez." },
          { n: "03", t: "Maliyet", d: "Yüksek verim, düşük maliyet." },
          { n: "04", t: "Hız", d: "Anında reaksiyon, anında toplama." },
        ].map((b) => (
          <div
            key={b.n}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "16px",
              paddingBottom: "16px",
              display: "flex",
              gap: "20px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#3d4452", flexShrink: 0, paddingTop: "2px" }}>{b.n}</span>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#f0f2f5", marginBottom: "4px" }}>{b.t}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{b.d}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },

  // Scene 3 — Sectors
  {
    position: [-1.8, 1.0, -1.0],
    visibleFrom: 0.38,
    visibleTo: 0.65,
    peakAt: 0.5,
    content: (
      <div style={{ width: "460px", pointerEvents: "none", userSelect: "none" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: "#0ea374",
            marginBottom: "16px",
          }}
        >
          Uyumluluk
        </p>
        <h2
          style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            fontWeight: 600,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: "#f0f2f5",
            margin: "0 0 20px 0",
          }}
        >
          <span style={{ color: "#0ea374" }}>900+</span> sektöre
          <br />
          uyumlanabilen
          <br />
          yapı
        </h2>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#6b7280", maxWidth: "360px" }}>
          Otomotiv lastiğinden ilaca, kozmetikten enerjiye kadar
          her alanda aynı temel prensiple çalışır.
        </p>
      </div>
    ),
  },

  // Scene 4 — Showcase
  {
    position: [-1.6, 1.0, 0],
    visibleFrom: 0.6,
    visibleTo: 0.88,
    peakAt: 0.7,
    content: (
      <div style={{ width: "420px", pointerEvents: "none", userSelect: "none" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: "#0ea374",
            marginBottom: "16px",
          }}
        >
          Sektör Örnekleri
        </p>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3.8rem)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#f0f2f5",
            margin: "0 0 20px 0",
          }}
        >
          Aynı sıvı yapı,
          <br />
          her sektörde.
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "28px" }}>
          {["Otomotiv", "Medikal", "Kozmetik", "Enerji", "Tekstil", "Gıda"].map((s) => (
            <span
              key={s}
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b7280",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                padding: "7px 14px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    ),
  },

  // Scene 5 — CTA
  {
    position: [-1.2, 0.7, 0.5],
    visibleFrom: 0.85,
    visibleTo: 1.0,
    peakAt: 0.95,
    content: (
      <div style={{ width: "580px", textAlign: "center", pointerEvents: "auto", userSelect: "none" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: "#0ea374",
            marginBottom: "16px",
          }}
        >
          Hemen Başlayın
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#f0f2f5",
            margin: "0 0 40px 0",
          }}
        >
          Sektörünüz için
          <br />
          <span style={{ color: "rgba(240,242,245,0.35)" }}>Purlina Matrix&apos;i</span>
          <br />
          keşfedin
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px",
            padding: "8px 8px 8px 24px",
            backdropFilter: "blur(12px)",
          }}
        >
          <input
            type="text"
            placeholder="Purlina Matrix Oluştur"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "#f0f2f5",
            }}
          />
          <button
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#0ea374",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
        <p style={{ marginTop: "32px", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#3d4452" }}>
          © Purlina — Yeni Nesil Toplama Teknolojisi
        </p>
      </div>
    ),
  },
];

function sceneOpacity(scene: TextScene, progress: number): number {
  const { visibleFrom, visibleTo, peakAt } = scene;
  if (progress < visibleFrom || progress > visibleTo) return 0;
  if (progress <= peakAt) {
    if (peakAt <= visibleFrom) return 1;
    const t = (progress - visibleFrom) / (peakAt - visibleFrom);
    return Math.min(1, t * t * (3 - 2 * t));
  } else {
    const t = (progress - peakAt) / (visibleTo - peakAt || 0.001);
    return Math.max(0, 1 - t * t * (3 - 2 * t));
  }
}

export default function SceneText() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    const p = scrollState.progress;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const opacity = sceneOpacity(SCENES[i], p);
      el.style.opacity = String(opacity);
      const yShift = (1 - opacity) * 18;
      el.style.transform = `translateY(${yShift}px)`;
      el.style.pointerEvents = opacity > 0.05 ? (SCENES[i].peakAt > 0.9 ? "auto" : "none") : "none";
    });
  });

  return (
    <>
      {SCENES.map((scene, i) => (
        <Html key={i} position={scene.position} occlude={false} style={{ pointerEvents: "none" }}>
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{
              opacity: 0,
              willChange: "opacity, transform",
              fontFamily: "var(--font-geist-sans), sans-serif",
            }}
          >
            {scene.content}
          </div>
        </Html>
      ))}
    </>
  );
}
