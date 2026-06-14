import * as THREE from "three";
import { SIMPLEX_NOISE_GLSL } from "./noise";

export type ChromeUniforms = {
  uTime: { value: number };
  uAmplitude: { value: number };
};

/**
 * Procedural grayscale "marble" texture: soft overlapping streaks and blobs
 * used as a roughness map so the chrome reads as polished liquid metal with
 * darker, mirror-like veins running through a brighter, softer base — rather
 * than a single uniform reflection.
 */
function createMarbleTexture(size = 512): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#9aa1ad";
  ctx.fillRect(0, 0, size, size);

  // Long, low streaks — the marbled "veins". Kept subtle and sparse so the
  // surface reads as polished metal with gentle variation, not a busy print.
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = size * (0.6 + Math.random() * 0.9);
    const thickness = size * (0.08 + Math.random() * 0.14);
    const angle = Math.random() * Math.PI;
    const dark = Math.random() > 0.4;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    const c = dark ? "10,12,16" : "255,255,255";
    grad.addColorStop(0, `rgba(${c},0)`);
    grad.addColorStop(0.5, `rgba(${c},${dark ? 0.22 : 0.25})`);
    grad.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(-len / 2, -thickness / 2, len, thickness);
    ctx.restore();
  }

  // Soft round blobs for broader variation.
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = (0.1 + Math.random() * 0.25) * size;
    const dark = Math.random() > 0.5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, dark ? "rgba(8,9,12,0.18)" : "rgba(255,255,255,0.2)");
    grad.addColorStop(1, "rgba(154,161,173,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.3 + Math.random() * 0.7), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/**
 * Liquid-mercury / chrome material for a light environment: high-metalness
 * physical material with a marbled roughness map for varied reflections,
 * plus a vertex shader that gently displaces the surface with animated 3D
 * simplex noise so the form never looks perfectly static.
 */
export function createChromeMaterial() {
  const uniforms: ChromeUniforms = {
    uTime: { value: 0 },
    uAmplitude: { value: 0.025 },
  };

  const roughnessMap = createMarbleTexture();
  roughnessMap?.repeat.set(1, 1);

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#c4cdd6"),
    metalness: 1,
    roughness: 0.78,
    roughnessMap: roughnessMap ?? undefined,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    envMapIntensity: 1.6,
    iridescence: 0.35,
    iridescenceIOR: 1.25,
    iridescenceThicknessRange: [100, 400],
    transparent: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uAmplitude = uniforms.uAmplitude;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      uniform float uTime;
      uniform float uAmplitude;
      ${SIMPLEX_NOISE_GLSL}
      `,
    );

    // Inject *after* <morphtarget_vertex> so the noise wobble displaces the
    // already GPU-morphed position/normal, not the pre-morph rest pose.
    shader.vertexShader = shader.vertexShader.replace(
      "#include <morphtarget_vertex>",
      `#include <morphtarget_vertex>
      float n = snoise(transformed * 0.9 + vec3(0.0, 0.0, uTime * 0.12));
      float n2 = snoise(transformed * 2.1 - vec3(uTime * 0.09, uTime * 0.07, 0.0));
      float displacement = (n * 0.7 + n2 * 0.3) * uAmplitude;

      transformed += normalize(objectNormal) * displacement;
      `,
    );
  };

  return { material, uniforms };
}
