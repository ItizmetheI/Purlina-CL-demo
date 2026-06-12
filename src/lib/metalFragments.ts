import * as THREE from "three";
import { SHAPES, POINT_COUNT } from "./shapes";

const _tangent = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _binormal = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const ALT_UP = new THREE.Vector3(0, 0, 1);

/**
 * Sample `count` points scattered across the ribbon's surface for a given
 * baked shape index, in the ribbon's local space. Used as the "shattered
 * metal fragment" origin positions for ShatterField — each fragment starts
 * at a random point on the liquid form's surface and flies off toward a
 * product shape.
 */
export function makeMetalFragmentCloud(count: number, shapeIndex: number, radiusA: number, radiusB: number): Float32Array {
  const points = SHAPES[shapeIndex];
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const ringT = Math.random() * (POINT_COUNT - 1);
    const ring = Math.min(POINT_COUNT - 2, Math.floor(ringT));
    const f = ringT - ring;

    const p0 = points[ring];
    const p1 = points[ring + 1];
    const pPrev = points[Math.max(0, ring - 1)];
    const pNext = points[Math.min(POINT_COUNT - 1, ring + 2)];

    _tangent.subVectors(pNext, pPrev);
    if (_tangent.lengthSq() < 1e-10) _tangent.set(1, 0, 0);
    _tangent.normalize();

    const upRef = Math.abs(_tangent.dot(UP)) > 0.95 ? ALT_UP : UP;
    _normal.crossVectors(_tangent, upRef).normalize();
    _binormal.crossVectors(_tangent, _normal).normalize();

    const angle = Math.random() * Math.PI * 2;
    const cos = Math.cos(angle) * radiusA;
    const sin = Math.sin(angle) * radiusB;

    const x = THREE.MathUtils.lerp(p0.x, p1.x, f) + _normal.x * cos + _binormal.x * sin;
    const y = THREE.MathUtils.lerp(p0.y, p1.y, f) + _normal.y * cos + _binormal.y * sin;
    const z = THREE.MathUtils.lerp(p0.z, p1.z, f) + _normal.z * cos + _binormal.z * sin;

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }

  return out;
}
