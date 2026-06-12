import * as THREE from "three";

const UP = new THREE.Vector3(0, 1, 0);
const ALT_UP = new THREE.Vector3(0, 0, 1);

const _tangent = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _binormal = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _vertexNormal = new THREE.Vector3();
const _pos = new THREE.Vector3();

export interface RibbonTopology {
  index: number[];
  uv: Float32Array;
  vertexCount: number;
}

/**
 * Index + UV layout for a ribbon with `segmentCount` rings along its length
 * and `radialSegments` verts per ring. Identical across every morph pose, so
 * it's built once and shared by the base geometry.
 */
export function buildRibbonTopology(segmentCount: number, radialSegments: number, uvRepeat = 3): RibbonTopology {
  const ringCount = segmentCount + 1;
  const vertsPerRing = radialSegments + 1;
  const vertexCount = ringCount * vertsPerRing;

  const uv = new Float32Array(vertexCount * 2);
  for (let i = 0; i < ringCount; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      const idx = i * vertsPerRing + j;
      uv[idx * 2] = (i / segmentCount) * uvRepeat;
      uv[idx * 2 + 1] = j / radialSegments;
    }
  }

  const index: number[] = [];
  for (let i = 0; i < segmentCount; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * vertsPerRing + j;
      const b = (i + 1) * vertsPerRing + j;
      const c = (i + 1) * vertsPerRing + (j + 1);
      const d = i * vertsPerRing + (j + 1);
      index.push(a, b, d, b, c, d);
    }
  }

  return { index, uv, vertexCount };
}

/**
 * Sweep a flattened ellipse cross-section along `points`, writing the
 * resulting vertex positions/normals into `positions`/`normals`. Pure and
 * allocation-free in its inner loop — called once per pose at startup to
 * bake morph targets, never per-frame.
 */
export function buildRibbonAttributes(
  points: THREE.Vector3[],
  radiusA: number,
  radiusB: number,
  radialSegments: number,
  positions: Float32Array,
  normals: Float32Array,
) {
  const vertsPerRing = radialSegments + 1;
  const segmentCount = points.length - 1;

  // Tangents at every ring, computed once up front.
  const tangents: THREE.Vector3[] = [];
  for (let i = 0; i <= segmentCount; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(segmentCount, i + 1)];
    const t = new THREE.Vector3().subVectors(next, prev);
    if (t.lengthSq() < 1e-10) t.set(1, 0, 0);
    t.normalize();
    tangents.push(t);
  }

  // Rotation-minimizing frame (double-reflection method, Wang et al. 2008).
  // Propagating the cross-section orientation from ring to ring this way
  // avoids the abrupt UP/ALT_UP flips of a per-ring Frenet frame, which
  // otherwise pinch/twist the ribbon at different points for each baked
  // shape and read as jitter when morphing between them.
  const frameNormals: THREE.Vector3[] = [];
  {
    const t0 = tangents[0];
    const upRef = Math.abs(t0.dot(UP)) > 0.95 ? ALT_UP : UP;
    const n0 = new THREE.Vector3().crossVectors(t0, upRef).normalize();
    frameNormals.push(n0);

    for (let i = 1; i <= segmentCount; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];
      const prevT = tangents[i - 1];
      const currT = tangents[i];
      const prevN = frameNormals[i - 1];

      const v1 = new THREE.Vector3().subVectors(currPoint, prevPoint);
      const c1 = v1.dot(v1);
      let rL = prevN.clone();
      let tL = prevT.clone();
      if (c1 > 1e-12) {
        rL.addScaledVector(v1, (-2 / c1) * v1.dot(prevN));
        tL.addScaledVector(v1, (-2 / c1) * v1.dot(prevT));
      }

      const v2 = new THREE.Vector3().subVectors(currT, tL);
      const c2 = v2.dot(v2);
      const rNext = rL.clone();
      if (c2 > 1e-12) {
        rNext.addScaledVector(v2, (-2 / c2) * v2.dot(rL));
      }
      rNext.normalize();
      frameNormals.push(rNext);
    }
  }

  for (let i = 0; i <= segmentCount; i++) {
    _tangent.copy(tangents[i]);
    _normal.copy(frameNormals[i]);
    _binormal.crossVectors(_tangent, _normal).normalize();

    const center = points[i];

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const cos = Math.cos(v);
      const sin = Math.sin(v);

      _offset.copy(_normal).multiplyScalar(cos * radiusA).addScaledVector(_binormal, sin * radiusB);
      _pos.copy(center).add(_offset);

      _vertexNormal
        .copy(_normal)
        .multiplyScalar(cos / radiusA)
        .addScaledVector(_binormal, sin / radiusB)
        .normalize();

      const idx = i * vertsPerRing + j;
      positions[idx * 3] = _pos.x;
      positions[idx * 3 + 1] = _pos.y;
      positions[idx * 3 + 2] = _pos.z;
      normals[idx * 3] = _vertexNormal.x;
      normals[idx * 3 + 1] = _vertexNormal.y;
      normals[idx * 3 + 2] = _vertexNormal.z;
    }
  }
}
