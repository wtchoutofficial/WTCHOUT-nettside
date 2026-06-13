"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createLeafAtlas, ATLAS_CELLS } from "./leafAtlas";
import { mulberry32, type SharedUniforms } from "./palettes";

interface Band {
  z: number;
  count: number;
  scale: number;
}

const DESKTOP_BANDS: Band[] = [
  { z: -3, count: 60, scale: 2.2 },
  { z: -7, count: 60, scale: 3.0 },
  { z: -12, count: 60, scale: 4.0 },
  { z: -18, count: 60, scale: 5.5 },
  { z: -26, count: 60, scale: 7.0 },
  { z: -36, count: 60, scale: 9.0 },
];

const MOBILE_BANDS: Band[] = [
  { z: -3, count: 35, scale: 2.4 },
  { z: -9, count: 35, scale: 3.6 },
  { z: -18, count: 35, scale: 5.5 },
  { z: -30, count: 35, scale: 8.0 },
];

const VERT = /* glsl */ `
  attribute vec2 aCell;
  attribute float aSeed;
  uniform float uTime;
  varying vec2 vAtlasUv;
  varying float vSeed;
  varying float vViewZ;
  void main() {
    vAtlasUv = aCell + uv * ${(1 / ATLAS_CELLS).toFixed(4)};
    vSeed = aSeed;
    vec3 pos = position;
    // Wind sway, stronger toward the top of each leaf plane
    pos.x += sin(uTime * 0.4 + aSeed) * 0.08 * uv.y;
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    vViewZ = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uDuskLeaf;
  uniform vec3 uDawnLeaf;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uMood;
  varying vec2 vAtlasUv;
  varying float vSeed;
  varying float vViewZ;
  void main() {
    float a = texture2D(uAtlas, vAtlasUv).a;
    if (a < 0.5) discard;
    vec3 leaf = mix(uDuskLeaf, uDawnLeaf, uMood);
    leaf *= 0.85 + 0.3 * fract(vSeed * 0.1031);
    float f = smoothstep(uFogNear, uFogFar, vViewZ);
    gl_FragColor = vec4(mix(leaf, uFogColor, f), 1.0);
  }
`;

export default function FoliageLayers({
  shared,
  isMobile,
}: {
  shared: SharedUniforms;
  isMobile: boolean;
}) {
  const mesh = useMemo(() => {
    const atlas = createLeafAtlas(isMobile);
    const bands = isMobile ? MOBILE_BANDS : DESKTOP_BANDS;
    const frameCount = isMobile ? 0 : 12;
    const total = bands.reduce((n, b) => n + b.count, 0) + frameCount;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uAtlas: { value: atlas },
        uTime: shared.uTime,
        uMood: shared.uMood,
        uFogColor: shared.uFogColor,
        uFogNear: shared.uFogNear,
        uFogFar: shared.uFogFar,
        uDuskLeaf: shared.uDuskLeaf,
        uDawnLeaf: shared.uDawnLeaf,
      },
      side: THREE.DoubleSide,
    });

    const geo = new THREE.PlaneGeometry(1, 1);
    const m = new THREE.InstancedMesh(geo, material, total);
    const cellAttr = new Float32Array(total * 2);
    const seedAttr = new Float32Array(total);
    const dummy = new THREE.Object3D();
    const rng = mulberry32(4242);
    const cellStep = 1 / ATLAS_CELLS;

    let i = 0;
    const place = (
      x: number,
      y: number,
      z: number,
      scale: number,
      rot: number
    ) => {
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, 0, rot);
      dummy.scale.set(scale, scale, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      cellAttr[i * 2] = Math.floor(rng() * ATLAS_CELLS) * cellStep;
      cellAttr[i * 2 + 1] = Math.floor(rng() * ATLAS_CELLS) * cellStep;
      seedAttr[i] = rng() * 100;
      i++;
    };

    for (const band of bands) {
      for (let n = 0; n < band.count; n++) {
        place(
          (rng() * 2 - 1) * 16,
          -22 + rng() * 32,
          band.z + (rng() * 2 - 1) * 1.5,
          band.scale * (0.7 + rng() * 0.7),
          (rng() * 2 - 1) * 0.6
        );
      }
    }
    // Oversized leaves hugging the screen edges for near-field depth
    for (let n = 0; n < frameCount; n++) {
      const side = n % 2 === 0 ? -1 : 1;
      place(
        side * (10 + rng() * 4),
        -20 + rng() * 30,
        -1.5 + (rng() * 2 - 1) * 0.5,
        6 + rng() * 4,
        side * (0.4 + rng() * 0.5)
      );
    }

    geo.setAttribute("aCell", new THREE.InstancedBufferAttribute(cellAttr, 2));
    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seedAttr, 1));
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false; // one mesh spanning the whole descent — never cull
    return m;
  }, [shared, isMobile]);

  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      const mat = mesh.material as THREE.ShaderMaterial;
      (mat.uniforms.uAtlas.value as THREE.Texture).dispose();
      mat.dispose();
      // Frees the per-instance instanceMatrix GPU buffer and unregisters the
      // renderer's dispose listener — geometry.dispose() alone leaks it.
      mesh.dispose();
    };
  }, [mesh]);

  return <primitive object={mesh} />;
}
