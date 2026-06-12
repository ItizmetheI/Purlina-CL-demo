"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";
import { productRevealAmount, type ShatterEnvelope } from "./ShatterField";

// Lathe profile (radius, height) for the lipstick bullet — traced
// bottom-to-top from where it meets the gold tube up to a rounded,
// angled-off tip, the classic "swiped" lipstick silhouette.
const BULLET_PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.26, 0.0],
  [0.27, 0.1],
  [0.25, 0.28],
  [0.18, 0.46],
  [0.07, 0.56],
  [0.0, 0.58],
];

function buildBulletGeometry(): THREE.BufferGeometry {
  const points = BULLET_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(points, 48);
  geometry.computeVertexNormals();
  return geometry;
}

export type ProductKind = "lipstick" | "spray";

interface ProductMeshProps {
  kind: ProductKind;
  envelope: ShatterEnvelope;
  color: string;
}

/**
 * The solid, recognizable product model that the shattered fragments
 * coalesce into. Fades in only once `productRevealAmount` says the
 * particle field has mostly converged, so the reveal reads as "fragments
 * finishing into a real object" rather than two layers overlapping.
 */
export default function ProductMesh({ kind, envelope, color }: ProductMeshProps) {
  const group = useRef<THREE.Group>(null);

  const bulletGeometry = useMemo(() => (kind === "lipstick" ? buildBulletGeometry() : null), [kind]);

  // Lipstick: warm colored bullet on a polished gold/brass tube.
  const bulletMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.25,
        metalness: 0.05,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        transparent: true,
        opacity: 0,
      }),
    [color],
  );

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#d4af6a",
        roughness: 0.25,
        metalness: 0.9,
        clearcoat: 0.3,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  // Spray bottle: tinted glossy body + matte black pump head/nozzle.
  const bottleMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.15,
        metalness: 0,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0,
      }),
    [color],
  );

  const capMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2b2f36",
        roughness: 0.35,
        metalness: 0.5,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const reveal = productRevealAmount(envelope, scrollState.progress);

    bulletMaterial.opacity = reveal;
    goldMaterial.opacity = reveal;
    bottleMaterial.opacity = reveal;
    capMaterial.opacity = reveal;

    const g = group.current;
    if (!g) return;
    g.visible = reveal > 0.01;
    const s = THREE.MathUtils.lerp(0.85, 1, reveal);
    g.scale.setScalar(s);
    g.rotation.y += delta * 0.15;
  });

  if (kind === "lipstick" && bulletGeometry) {
    return (
      <group ref={group} position={[0, -0.32, 0]}>
        {/* Gold tube */}
        <mesh material={goldMaterial} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.28, 0.62, 32]} />
        </mesh>
        {/* Colored bullet, revealed above the tube */}
        <mesh geometry={bulletGeometry} material={bulletMaterial} position={[0, 0.31, 0]} />
      </group>
    );
  }

  // Spray bottle: cylindrical glass-look body, a black pump collar, and a
  // horizontal nozzle/trigger sticking out — the classic spray-bottle silhouette.
  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <mesh material={bottleMaterial} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.78, 32]} />
      </mesh>
      <mesh material={capMaterial} position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.18, 24]} />
      </mesh>
      <mesh material={capMaterial} position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.14, 16]} />
      </mesh>
      {/* Trigger/nozzle arm */}
      <mesh material={capMaterial} position={[0.16, 0.4, 0.16]} rotation={[0, Math.PI / 4, Math.PI / 2.4]}>
        <cylinderGeometry args={[0.035, 0.05, 0.32, 12]} />
      </mesh>
    </group>
  );
}
