"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";
import { shatterEnvelope, productRevealAmount, type ShatterEnvelope } from "./ShatterField";

function smoothstep(t: number) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

// How far off-screen each product flies in from / out to, and which way it
// spins while travelling — lipstick arrives from the left and exits further
// left, the spray bottle arrives from the right and exits further right, so
// the two products never cross paths.
const FLIGHT: Record<ProductKind, { enter: THREE.Vector3; exit: THREE.Vector3; spins: number }> = {
  lipstick: { enter: new THREE.Vector3(-3.4, -0.8, -1.4), exit: new THREE.Vector3(-3.8, 1.6, 0.8), spins: 1.5 },
  spray: { enter: new THREE.Vector3(3.4, 0.9, -1.2), exit: new THREE.Vector3(3.8, -1.4, 0.9), spins: -1.5 },
};

const _offset = new THREE.Vector3();

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
  const idleSpin = useRef(0);

  const basePosition = useMemo(
    () => (kind === "lipstick" ? new THREE.Vector3(0, -0.32, 0) : new THREE.Vector3(0, -0.05, 0)),
    [kind],
  );
  const flight = FLIGHT[kind];

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
    const progress = scrollState.progress;
    const { shatterStart, reformed, holdEnd, shatterEnd } = envelope;

    // entryFactor: 0 (off-screen) -> 1 (arrived at center) as the form
    // shatters and reforms into this product. exitFactor: 0 (still centered)
    // -> 1 (flown off to its exit side) as it shatters back into the ribbon.
    const entryFactor =
      progress <= shatterStart ? 0 : smoothstep((progress - shatterStart) / (reformed - shatterStart));
    const exitFactor = progress <= holdEnd ? 0 : smoothstep((progress - holdEnd) / (shatterEnd - holdEnd));

    const envOpacity = shatterEnvelope(envelope, progress).opacity;

    bulletMaterial.opacity = envOpacity;
    goldMaterial.opacity = envOpacity;
    bottleMaterial.opacity = envOpacity;
    capMaterial.opacity = envOpacity;

    const g = group.current;
    if (!g) return;
    g.visible = envOpacity > 0.001;

    // Fly in from `enter` as entryFactor rises, then fly out toward `exit`
    // as exitFactor rises. The two never overlap (exitFactor is 0 until
    // after the entry is complete), so they can simply be summed.
    _offset.copy(flight.enter).multiplyScalar(1 - entryFactor);
    _offset.addScaledVector(flight.exit, exitFactor);

    g.position.set(basePosition.x + _offset.x, basePosition.y + _offset.y, basePosition.z + _offset.z);

    // Shrink toward the viewer while travelling, then grow past full size
    // once fully reformed — paired with CameraRig's dolly-in, this turns
    // the moment of arrival into a hero shot rather than a small object
    // drifting to rest.
    const reveal = productRevealAmount(envelope, progress);
    const flightScale =
      THREE.MathUtils.lerp(0.4, 1, entryFactor) *
      THREE.MathUtils.lerp(1, 0.4, exitFactor) *
      THREE.MathUtils.lerp(1, 1.35, reveal);
    g.scale.setScalar(flightScale);

    // Gentle continuous idle spin, plus an extra "swirl" burst that unwinds
    // on arrival and winds back up on departure.
    idleSpin.current += delta * 0.15;
    const swirl = flight.spins * Math.PI * 2 * ((1 - entryFactor) + exitFactor);
    g.rotation.y = idleSpin.current + swirl;
  });

  if (kind === "lipstick" && bulletGeometry) {
    return (
      <group ref={group}>
        {/* Gold tube — open-ended so its top doesn't z-fight with the
            bullet's flat bottom cap sitting flush on top of it. */}
        <mesh material={goldMaterial} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.28, 0.62, 32, 1, true]} />
        </mesh>
        {/* Colored bullet, revealed above the tube */}
        <mesh geometry={bulletGeometry} material={bulletMaterial} position={[0, 0.31, 0]} />
      </group>
    );
  }

  // Spray bottle: cylindrical glass-look body, a black pump collar, and a
  // horizontal nozzle/trigger sticking out — the classic spray-bottle silhouette.
  return (
    <group ref={group}>
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
