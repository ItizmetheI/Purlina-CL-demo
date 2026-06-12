import * as THREE from "three";
import { FORM_KEYFRAMES } from "./keyframes";
import { POINT_COUNT, sampleShape } from "./shapes";
import { buildRibbonAttributes, buildRibbonTopology } from "./ribbonGeometry";

export const RADIAL_SEGMENTS = 16;

/**
 * Builds the liquid ribbon geometry once at startup: a base pose baked from
 * FORM_KEYFRAMES[0], plus one relative GPU morph target per remaining
 * keyframe. All shape morphing then happens entirely on the GPU by driving
 * `mesh.morphTargetInfluences` — no CPU buffer rebuilds, ever.
 */
export function createLiquidGeometry(): THREE.BufferGeometry {
  const segmentCount = POINT_COUNT - 1;
  const { index, uv, vertexCount } = buildRibbonTopology(segmentCount, RADIAL_SEGMENTS, 4);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < POINT_COUNT; i++) points.push(new THREE.Vector3());

  const positions: Float32Array[] = [];
  const normals: Float32Array[] = [];

  for (const keyframe of FORM_KEYFRAMES) {
    sampleShape(keyframe.shape, points);
    const pos = new Float32Array(vertexCount * 3);
    const norm = new Float32Array(vertexCount * 3);
    buildRibbonAttributes(points, keyframe.radiusA, keyframe.radiusB, RADIAL_SEGMENTS, pos, norm);
    positions.push(pos);
    normals.push(norm);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(index);
  geometry.setAttribute("position", new THREE.BufferAttribute(positions[0], 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals[0], 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

  geometry.morphAttributes.position = [];
  geometry.morphAttributes.normal = [];
  for (let p = 1; p < positions.length; p++) {
    const deltaPos = new Float32Array(vertexCount * 3);
    const deltaNorm = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount * 3; i++) {
      deltaPos[i] = positions[p][i] - positions[0][i];
      deltaNorm[i] = normals[p][i] - normals[0][i];
    }
    geometry.morphAttributes.position.push(new THREE.BufferAttribute(deltaPos, 3));
    geometry.morphAttributes.normal.push(new THREE.BufferAttribute(deltaNorm, 3));
  }
  geometry.morphTargetsRelative = true;

  geometry.computeBoundingSphere();
  return geometry;
}
