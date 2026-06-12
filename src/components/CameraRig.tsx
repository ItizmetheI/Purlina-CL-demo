"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";

// Gentle camera dolly per section — the liquid form itself carries most of
// the motion, so the camera only needs a subtle drift to add depth.
const CAMERA_KEYFRAMES: { progress: number; pos: [number, number, number]; fov: number }[] = [
  { progress: 0.0, pos: [0, 0, 6.2], fov: 32 },
  { progress: 0.36, pos: [-0.3, 0.1, 6.4], fov: 33 },
  { progress: 0.55, pos: [0.2, -0.1, 6.8], fov: 34 },
  { progress: 0.72, pos: [0, 0.3, 7.2], fov: 35 },
  { progress: 1.0, pos: [0, 0, 6.6], fov: 33 },
];

const mouse = new THREE.Vector2();

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
}

export default function CameraRig() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 6.2));
  const targetFov = useRef(32);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const progress = scrollState.progress;

    const frames = CAMERA_KEYFRAMES;
    let i = 0;
    while (i < frames.length - 2 && progress > frames[i + 1].progress) i++;
    const k0 = frames[i];
    const k1 = frames[i + 1];
    const span = k1.progress - k0.progress;
    const t = span > 0 ? THREE.MathUtils.clamp((progress - k0.progress) / span, 0, 1) : 0;
    const eased = t * t * (3 - 2 * t);

    targetPos.current.set(
      THREE.MathUtils.lerp(k0.pos[0], k1.pos[0], eased) + mouse.x * 0.2,
      THREE.MathUtils.lerp(k0.pos[1], k1.pos[1], eased) + -mouse.y * 0.15,
      THREE.MathUtils.lerp(k0.pos[2], k1.pos[2], eased),
    );
    targetFov.current = THREE.MathUtils.lerp(k0.fov, k1.fov, eased);

    const lerpFactor = 1 - Math.pow(0.0008, delta);
    camera.position.lerp(targetPos.current, lerpFactor);
    camera.lookAt(0, 0, 0);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, lerpFactor);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
