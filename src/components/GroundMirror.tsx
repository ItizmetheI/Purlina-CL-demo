"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";

/**
 * A faint emissive plane beneath the form — fades in as the scene develops
 * and gives the dark void a sense of ground/depth without a literal
 * reflection (cheap, and avoids doubling the shatter fragments visually).
 */
export default function GroundMirror() {
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!mat.current) return;
    const opacity = Math.min(scrollState.progress * 3, 1) * 0.02;
    mat.current.opacity = opacity;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, -1]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        ref={mat}
        color="#34d399"
        transparent
        opacity={0}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
