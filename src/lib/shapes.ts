import * as THREE from "three";

// Resolution of the ribbon along its length. Every keyframe shape below is
// sampled at exactly this many points so they can be lerped 1:1 per-vertex.
export const TUBULAR_SEGMENTS = 220;
export const POINT_COUNT = TUBULAR_SEGMENTS + 1;

interface BlobOptions {
  scale: number;
  twist: number;
  freq: number;
  phase: number;
  squash: number;
}

// A closed, organic, twisted loop — point[0] and point[N] coincide so the
// ribbon reads as a continuous folded band rather than an open tube.
function makeBlob({ scale, twist, freq, phase, squash }: BlobOptions): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const a = (i / TUBULAR_SEGMENTS) * Math.PI * 2;
    const r =
      scale *
      (1 + 0.27 * Math.sin(freq * a + phase) + 0.15 * Math.cos((freq + 1) * a - phase * 0.6));
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * squash;
    const z = twist * Math.sin(2 * a + phase) + 0.22 * Math.cos(a - phase * 0.5);
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

interface SpiralOptions {
  turns: number;
  radiusStart: number;
  radiusEnd: number;
  height: number;
  phase: number;
  wobble: number;
}

// An open, descending helix — the ribbon "unrolls" into this from the blob.
function makeSpiral({ turns, radiusStart, radiusEnd, height, phase, wobble }: SpiralOptions): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const t = i / TUBULAR_SEGMENTS;
    const a = phase + t * Math.PI * 2 * turns;
    const r = THREE.MathUtils.lerp(radiusStart, radiusEnd, t) + Math.sin(a * 1.5) * wobble;
    const x = Math.cos(a) * r;
    const y = height / 2 - t * height;
    const z = Math.sin(a) * r;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

interface RingOptions {
  radius: number;
  wobbleFreq: number;
  wobbleAmp: number;
  zFreq: number;
  zAmp: number;
  phase: number;
}

// An open, near-circular ring with a gentle out-of-plane wave — the knot
// "unties" into this before unrolling into the spiral shapes.
function makeRing({ radius, wobbleFreq, wobbleAmp, zFreq, zAmp, phase }: RingOptions): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const a = (i / TUBULAR_SEGMENTS) * Math.PI * 2;
    const r = radius + wobbleAmp * Math.sin(wobbleFreq * a + phase);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    const z = zAmp * Math.sin(zFreq * a + phase);
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

// Four narrative shapes the ribbon morphs through across the whole page,
// each deliberately distinct in silhouette so the morph reads as a liquid
// transformation rather than a pose change:
//  0 — Hero: compact twisted knot
//  1 — 900+ sectors: the knot opens into a wide ring
//  2 — Sector showcase: the ring unrolls into a descending spiral
//  3 — CTA: spiral fully extended, more turns
export const SHAPES: THREE.Vector3[][] = [
  makeBlob({ scale: 1.5, twist: 0.5, freq: 2, phase: 0.4, squash: 0.86 }),
  makeRing({ radius: 1.55, wobbleFreq: 3, wobbleAmp: 0.18, zFreq: 2, zAmp: 0.4, phase: 0.6 }),
  makeSpiral({ turns: 2.2, radiusStart: 1.35, radiusEnd: 0.95, height: 5.2, phase: Math.PI / 2, wobble: 0.08 }),
  makeSpiral({ turns: 3.3, radiusStart: 1.3, radiusEnd: 0.6, height: 7.4, phase: Math.PI / 2, wobble: 0.05 }),
];

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

/**
 * Sample the ribbon's centerline at a continuous shape index (e.g. 1.4 means
 * 40% morphed from SHAPES[1] toward SHAPES[2]). Writes into `out` in place.
 */
export function sampleShape(shapeT: number, out: THREE.Vector3[]) {
  const max = SHAPES.length - 1;
  const clamped = THREE.MathUtils.clamp(shapeT, 0, max);
  const i0 = Math.min(max, Math.floor(clamped));
  const i1 = Math.min(max, i0 + 1);
  const f = clamped - i0;

  const a = SHAPES[i0];
  const b = SHAPES[i1];

  for (let i = 0; i < out.length; i++) {
    _a.copy(a[i]);
    _b.copy(b[i]);
    out[i].lerpVectors(_a, _b, f);
  }
}

export function createWorkingPoints(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < POINT_COUNT; i++) pts.push(new THREE.Vector3());
  sampleShape(0, pts);
  return pts;
}
