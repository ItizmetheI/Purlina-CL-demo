"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scrollState";
import type { ProductCloud } from "@/lib/productShapes";

function smoothstep(t: number) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

export interface ShatterEnvelope {
  shatterStart: number; // metal -> begins flying apart
  reformed: number; // fully reformed into the product
  holdEnd: number; // product holds this pose until here
  shatterEnd: number; // fully back to metal fragments (≈ ribbon reforms)
}

/**
 * progress -> { t, opacity }. t=0 is the metal-fragment pose, t=1 is the
 * fully-reformed product. opacity ramps up as fragments separate from the
 * ribbon and back down once they've reformed into the ribbon again.
 */
export function shatterEnvelope({ shatterStart, reformed, holdEnd, shatterEnd }: ShatterEnvelope, progress: number) {
  let t: number;
  let opacity: number;

  if (progress <= shatterStart) {
    t = 0;
    opacity = 0;
  } else if (progress <= reformed) {
    t = smoothstep((progress - shatterStart) / (reformed - shatterStart));
    opacity = smoothstep((progress - shatterStart) / (reformed - shatterStart));
  } else if (progress <= holdEnd) {
    t = 1;
    opacity = 1;
  } else if (progress <= shatterEnd) {
    const f = (progress - holdEnd) / (shatterEnd - holdEnd);
    t = 1 - smoothstep(f);
    opacity = 1 - smoothstep(f);
  } else {
    t = 0;
    opacity = 0;
  }

  return { t, opacity };
}

/**
 * How much of the solid product mesh should be visible (0-1). Only ramps up
 * in the final stretch of reforming (t > 0.82), so fragments are still
 * visibly coalescing before the solid model fades in over them.
 */
export function productRevealAmount(envelope: ShatterEnvelope, progress: number) {
  const { t } = shatterEnvelope(envelope, progress);
  return smoothstep((t - 0.82) / 0.18);
}

interface ShatterFieldProps {
  metalPoints: Float32Array;
  product: ProductCloud;
  productScale: number;
  envelope: ShatterEnvelope;
  metalColor?: string;
}

/**
 * A swarm of small particles that lives on top of the liquid ribbon. Each
 * particle starts at a point sampled from the ribbon's surface (a "shattered
 * metal fragment"), flies outward, and reforms into a point on a product's
 * surface (lipstick, spray bottle, ...) — then reverses on the way out of
 * the scroll window so the product shatters back into metal.
 */
export default function ShatterField({ metalPoints, product, productScale, envelope, metalColor = "#c4cdd6" }: ShatterFieldProps) {
  const points = useRef<THREE.Points>(null);
  const count = metalPoints.length / 3;

  const { geometry, material, seeds, explodeDir, productPoints, metalCol, productCol } = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geom.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));

    const seeds = new Float32Array(count);
    const explodeDir = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      const dir = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
      explodeDir[i * 3] = dir.x;
      explodeDir[i * 3 + 1] = dir.y;
      explodeDir[i * 3 + 2] = dir.z;
    }

    const mat = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    return {
      geometry: geom,
      material: mat,
      seeds,
      explodeDir,
      productPoints: product.points,
      metalCol: new THREE.Color(metalColor),
      productCol: product.color,
    };
  }, [count, product, metalColor]);

  useFrame(() => {
    const p = points.current;
    if (!p) return;

    const { t, opacity } = shatterEnvelope(envelope, scrollState.progress);
    const reveal = productRevealAmount(envelope, scrollState.progress);
    material.opacity = opacity * (1 - reveal);
    p.visible = material.opacity > 0.001;
    if (!p.visible) return;

    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const colors = geometry.attributes.color as THREE.BufferAttribute;
    const posArr = positions.array as Float32Array;
    const colArr = colors.array as Float32Array;

    const explodeMag = 0.7;

    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const tp = smoothstep(THREE.MathUtils.clamp(t * 1.35 - seed * 0.35, 0, 1));
      const bump = Math.sin(THREE.MathUtils.clamp(t * 1.35 - seed * 0.35, 0, 1) * Math.PI) * explodeMag;

      const mx = metalPoints[i * 3];
      const my = metalPoints[i * 3 + 1];
      const mz = metalPoints[i * 3 + 2];
      const px = productPoints[i * 3] * productScale;
      const py = productPoints[i * 3 + 1] * productScale;
      const pz = productPoints[i * 3 + 2] * productScale;

      posArr[i * 3] = THREE.MathUtils.lerp(mx, px, tp) + explodeDir[i * 3] * bump;
      posArr[i * 3 + 1] = THREE.MathUtils.lerp(my, py, tp) + explodeDir[i * 3 + 1] * bump;
      posArr[i * 3 + 2] = THREE.MathUtils.lerp(mz, pz, tp) + explodeDir[i * 3 + 2] * bump;

      colArr[i * 3] = THREE.MathUtils.lerp(metalCol.r, productCol.r, tp);
      colArr[i * 3 + 1] = THREE.MathUtils.lerp(metalCol.g, productCol.g, tp);
      colArr[i * 3 + 2] = THREE.MathUtils.lerp(metalCol.b, productCol.b, tp);
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}
