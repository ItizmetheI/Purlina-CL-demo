"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createChromeMaterial } from "@/lib/chromeMaterial";
import { createLiquidGeometry } from "@/lib/morphGeometry";
import { createFormTarget, sampleFormKeyframes, sampleMorphInfluences } from "@/lib/keyframes";
import { scrollState } from "@/lib/scrollState";
import { makeMetalFragmentCloud } from "@/lib/metalFragments";
import { makeLipstickCloud, makeSprayBottleCloud } from "@/lib/productShapes";
import ShatterField, { shatterEnvelope } from "./ShatterField";
import ProductMesh from "./ProductMesh";
import { LIPSTICK_ENVELOPE, SPRAY_ENVELOPE } from "@/lib/shatterTimeline";

const FRAGMENT_COUNT = 1000;

export default function LiquidForm() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  const { material, uniforms } = useMemo(() => {
    const created = createChromeMaterial();
    created.material.side = THREE.DoubleSide;
    return created;
  }, []);

  const geometry = useMemo(() => createLiquidGeometry(), []);

  const lipstickFragments = useMemo(() => makeMetalFragmentCloud(FRAGMENT_COUNT, 1, 1.05, 0.46), []);
  const sprayFragments = useMemo(() => makeMetalFragmentCloud(FRAGMENT_COUNT, 2, 0.92, 0.38), []);
  const lipstickCloud = useMemo(() => makeLipstickCloud(FRAGMENT_COUNT), []);
  const sprayCloud = useMemo(() => makeSprayBottleCloud(FRAGMENT_COUNT), []);

  const target = useRef(createFormTarget());
  const targetInfluences = useRef([0, 0, 0, 0]);
  const prevInfluences = useRef([0, 0, 0, 0]);

  // Underlying scroll-driven pose, tracked separately from the group's
  // actual transform so the idle bob/spin (added on top each frame) never
  // feeds back into the lerp. Mutating g.position/g.rotation directly with
  // `+=` and then lerping THAT toward the target on the next frame causes
  // the bob to compound frame after frame — an unbounded vertical drift
  // that reads as jitter.
  const basePosition = useRef(new THREE.Vector3());
  const baseRotationY = useRef(0);

  useEffect(() => {
    sampleFormKeyframes(0, target.current);
    sampleMorphInfluences(0, targetInfluences.current);

    const g = group.current;
    if (g) {
      g.position.copy(target.current.position);
      g.rotation.copy(target.current.rotation);
      g.scale.setScalar(target.current.scale);
      basePosition.current.copy(target.current.position);
      baseRotationY.current = target.current.rotation.y;
    }

    const m = mesh.current;
    if (m) {
      m.updateMorphTargets();
      const influences = m.morphTargetInfluences;
      if (influences) {
        for (let i = 0; i < influences.length; i++) influences[i] = targetInfluences.current[i];
      }
    }

    uniforms.uAmplitude.value = target.current.noise;
  }, [uniforms]);

  useFrame((state, rawDelta) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // Slow shimmer: gently animate the iridescent film thickness so the
    // chrome's color highlights drift over time, reading as a liquid sheen
    // without disturbing the surface texture or geometry.
    const physMat = material as THREE.MeshPhysicalMaterial;
    physMat.iridescenceThicknessRange = [
      100 + Math.sin(state.clock.elapsedTime * 0.25) * 60,
      400 + Math.cos(state.clock.elapsedTime * 0.18) * 100,
    ];

    sampleFormKeyframes(scrollState.progress, target.current);
    sampleMorphInfluences(scrollState.progress, targetInfluences.current);

    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;

    // Clamp delta so a stutter (tab switch, GC pause, slow frame) doesn't
    // turn into a single huge lerp step — i.e. a visible "snap" — on the
    // next frame. Without this, every dropped frame reads as jank.
    const delta = Math.min(rawDelta, 1 / 30);
    const lerpFactor = 1 - Math.pow(0.001, delta);

    basePosition.current.lerp(target.current.position, lerpFactor);
    baseRotationY.current = THREE.MathUtils.lerp(baseRotationY.current, target.current.rotation.y, lerpFactor);
    // Continuous idle spin layered on top of the scroll-driven pose.
    baseRotationY.current += delta * 0.06;

    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.rotation.x, lerpFactor);
    g.rotation.y = baseRotationY.current;
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, target.current.rotation.z, lerpFactor);

    // Idle vertical bob, applied on top of the lerped base position without
    // ever being written back into it.
    g.position.copy(basePosition.current);
    g.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.035;

    const nextScale = THREE.MathUtils.lerp(g.scale.x, target.current.scale, lerpFactor);
    g.scale.setScalar(nextScale);

    // Liquid surge: while the morph-target weights are actively changing,
    // boost the displacement amplitude so the surface visibly ripples as it
    // reshapes, rather than only changing pose.
    let morphDelta = 0;
    for (let i = 0; i < targetInfluences.current.length; i++) {
      morphDelta += Math.abs(targetInfluences.current[i] - prevInfluences.current[i]);
      prevInfluences.current[i] = targetInfluences.current[i];
    }
    const morphBoost = Math.min(morphDelta * 3, 0.07);

    uniforms.uAmplitude.value = THREE.MathUtils.lerp(
      uniforms.uAmplitude.value,
      target.current.noise + morphBoost,
      lerpFactor,
    );

    // GPU-side morph: blend between baked poses by lerping influence weights.
    const influences = m.morphTargetInfluences;
    if (influences) {
      for (let i = 0; i < influences.length; i++) {
        influences[i] = THREE.MathUtils.lerp(influences[i], targetInfluences.current[i], lerpFactor);
      }
    }

    // While a shatter field is active, the ribbon itself fades out so the
    // fragments read as "this surface" flying apart, not a separate layer.
    const lipstickShatter = shatterEnvelope(LIPSTICK_ENVELOPE, scrollState.progress).opacity;
    const sprayShatter = shatterEnvelope(SPRAY_ENVELOPE, scrollState.progress).opacity;
    const ribbonOpacity = 1 - Math.max(lipstickShatter, sprayShatter);
    (material as THREE.MeshPhysicalMaterial).opacity = THREE.MathUtils.lerp(
      (material as THREE.MeshPhysicalMaterial).opacity,
      ribbonOpacity,
      lerpFactor,
    );

  });

  return (
    <group ref={group}>
      <mesh ref={mesh} args={[geometry, material]} />
      <ShatterField
        metalPoints={lipstickFragments}
        product={lipstickCloud}
        productScale={1.9}
        envelope={LIPSTICK_ENVELOPE}
      />
      <ShatterField
        metalPoints={sprayFragments}
        product={sprayCloud}
        productScale={1.7}
        envelope={SPRAY_ENVELOPE}
      />
      <ProductMesh kind="lipstick" envelope={LIPSTICK_ENVELOPE} color="#e8857a" />
      <ProductMesh kind="spray" envelope={SPRAY_ENVELOPE} color="#7fb3c9" />
    </group>
  );
}
