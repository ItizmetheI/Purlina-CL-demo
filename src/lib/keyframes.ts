import * as THREE from "three";

export interface FormKeyframe {
  progress: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  shape: number; // continuous index into SHAPES (lerps between consecutive entries)
  noise: number; // displacement amplitude — how "alive" the surface looks
  radiusA: number; // ribbon cross-section width
  radiusB: number; // ribbon cross-section thickness
}

// Five narrative beats matching the storyboard:
// 1. Hero            — compact twisted loop, upper right
// 2. Benefits        — drifts down/left as it gently re-twists
// 3. 900+ sectors    — grows into a larger, more complex loop, takes center stage
// 4. Sector showcase — unrolls into a descending spiral behind the icons; this
//                       is also where the form shatters and reforms into the
//                       sector's product (see ShatterField)
// 5. CTA             — spiral fully extended, settles low and center; shatters
//                       once more into the final product reveal
export const FORM_KEYFRAMES: FormKeyframe[] = [
  { progress: 0.0, position: [0.8, 0.2, 0], rotation: [0.15, -0.5, 0.05], scale: 0.72, shape: 0, noise: 0.045, radiusA: 1.0, radiusB: 0.42 },
  { progress: 0.32, position: [0.6, -0.2, -0.3], rotation: [0.35, 0.6, -0.08], scale: 0.58, shape: 0.5, noise: 0.06, radiusA: 1.02, radiusB: 0.44 },
  { progress: 0.5, position: [0.2, 0.1, 0.5], rotation: [0.15, 1.8, 0.05], scale: 0.8, shape: 1, noise: 0.09, radiusA: 1.05, radiusB: 0.46 },
  { progress: 0.7, position: [0.2, 0.0, -0.4], rotation: [0.05, 3.0, 0], scale: 0.55, shape: 2, noise: 0.1, radiusA: 0.92, radiusB: 0.38 },
  { progress: 1.0, position: [0.0, 0.0, -0.8], rotation: [0.0, 4.4, 0], scale: 0.42, shape: 3, noise: 0.06, radiusA: 0.85, radiusB: 0.34 },
];

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _ra = new THREE.Euler();
const _rb = new THREE.Euler();

export interface FormTarget {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  noise: number;
}

export function createFormTarget(): FormTarget {
  return {
    position: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    scale: 1,
    noise: 0.02,
  };
}

export function sampleFormKeyframes(progress: number, out: FormTarget) {
  const frames = FORM_KEYFRAMES;
  let i = 0;
  while (i < frames.length - 2 && progress > frames[i + 1].progress) i++;

  const k0 = frames[i];
  const k1 = frames[i + 1];
  const span = k1.progress - k0.progress;
  const t = span > 0 ? THREE.MathUtils.clamp((progress - k0.progress) / span, 0, 1) : 0;
  const eased = t * t * (3 - 2 * t); // smoothstep

  _a.set(...k0.position);
  _b.set(...k1.position);
  out.position.lerpVectors(_a, _b, eased);

  _ra.set(...k0.rotation);
  _rb.set(...k1.rotation);
  out.rotation.set(
    THREE.MathUtils.lerp(_ra.x, _rb.x, eased),
    THREE.MathUtils.lerp(_ra.y, _rb.y, eased),
    THREE.MathUtils.lerp(_ra.z, _rb.z, eased),
  );

  out.scale = THREE.MathUtils.lerp(k0.scale, k1.scale, eased);
  out.noise = THREE.MathUtils.lerp(k0.noise, k1.noise, eased);
}

const MORPH_TARGET_COUNT = FORM_KEYFRAMES.length - 1;

/**
 * Morph-target influence weights for `progress`. `out[m]` is the blend
 * weight for the GPU pose baked from FORM_KEYFRAMES[m + 1], relative to the
 * base geometry baked from FORM_KEYFRAMES[0]. At most two adjacent weights
 * are ever non-zero, so the GPU is always blending between exactly the two
 * baked poses surrounding the current scroll progress.
 */
export function sampleMorphInfluences(progress: number, out: number[]) {
  const frames = FORM_KEYFRAMES;
  let i = 0;
  while (i < frames.length - 2 && progress > frames[i + 1].progress) i++;

  const k1 = frames[i + 1];
  const k0 = frames[i];
  const span = k1.progress - k0.progress;
  const t = span > 0 ? THREE.MathUtils.clamp((progress - k0.progress) / span, 0, 1) : 0;
  const eased = t * t * (3 - 2 * t); // smoothstep

  for (let m = 0; m < MORPH_TARGET_COUNT; m++) out[m] = 0;

  if (i === 0) {
    out[0] = eased;
  } else {
    out[i - 1] = 1 - eased;
    out[i] = eased;
  }
}
