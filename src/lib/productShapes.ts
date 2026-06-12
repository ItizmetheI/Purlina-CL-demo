import * as THREE from "three";

export interface ProductCloud {
  points: Float32Array; // length count * 3
  color: THREE.Color;
}

const _v = new THREE.Vector3();

/**
 * Surface point cloud for a lipstick: a cylindrical body, a tapered bullet
 * tip, and a slightly wider cap below the body — sampled directly as a
 * surface-of-revolution rather than via the ribbon system, since this is a
 * standalone "reformed" product, not a ribbon morph target.
 */
export function makeLipstickCloud(count: number): ProductCloud {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = Math.random(); // 0 = base of cap, 1 = tip of bullet
    const a = Math.random() * Math.PI * 2;

    let r: number;
    let y: number;
    const capH = 0.32;
    const bodyH = 0.62;
    const tipH = 0.26;
    const totalH = capH + bodyH + tipH;

    if (t < capH / totalH) {
      // Cap: slightly wider cylinder.
      r = 0.46;
      y = -totalH / 2 + (t / (capH / totalH)) * capH;
    } else if (t < (capH + bodyH) / totalH) {
      // Body: narrower cylinder.
      r = 0.32;
      const tt = (t - capH / totalH) / (bodyH / totalH);
      y = -totalH / 2 + capH + tt * bodyH;
    } else {
      // Bullet tip: tapers to a rounded point.
      const tt = (t - (capH + bodyH) / totalH) / (tipH / totalH);
      r = 0.32 * (1 - tt * tt);
      y = -totalH / 2 + capH + bodyH + tt * tipH;
    }

    _v.set(Math.cos(a) * r, y, Math.sin(a) * r);
    _v.toArray(points, i * 3);
  }

  return { points, color: new THREE.Color("#e8857a") };
}

/**
 * Surface point cloud for a small spray bottle: a rectangular body and a
 * narrow cylindrical nozzle/cap on top.
 */
export function makeSprayBottleCloud(count: number): ProductCloud {
  const points = new Float32Array(count * 3);

  const bodyW = 0.62;
  const bodyD = 0.4;
  const bodyH = 0.85;
  const capR = 0.16;
  const capH = 0.32;
  const totalH = bodyH + capH;

  for (let i = 0; i < count; i++) {
    const t = Math.random();

    if (t < bodyH / totalH) {
      // Box body — sample one of six faces.
      const face = Math.floor(Math.random() * 6);
      const u = Math.random() * 2 - 1;
      const v = Math.random() * 2 - 1;
      let x = 0, y = 0, z = 0;
      switch (face) {
        case 0: x = u * bodyW; y = v * bodyH; z = bodyD; break;
        case 1: x = u * bodyW; y = v * bodyH; z = -bodyD; break;
        case 2: x = bodyW; y = v * bodyH; z = u * bodyD; break;
        case 3: x = -bodyW; y = v * bodyH; z = u * bodyD; break;
        case 4: x = u * bodyW; y = bodyH; z = v * bodyD; break;
        default: x = u * bodyW; y = -bodyH; z = v * bodyD; break;
      }
      _v.set(x * 0.5, y * 0.5 - capH * 0.5, z * 0.5);
    } else {
      // Cylindrical nozzle/cap on top.
      const a = Math.random() * Math.PI * 2;
      const tt = (t - bodyH / totalH) / (capH / totalH);
      _v.set(Math.cos(a) * capR, bodyH * 0.5 - capH * 0.5 + tt * capH, Math.sin(a) * capR);
    }

    _v.toArray(points, i * 3);
  }

  return { points, color: new THREE.Color("#7fb3c9") };
}
