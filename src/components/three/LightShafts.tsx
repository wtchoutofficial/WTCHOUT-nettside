"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mulberry32, type SharedUniforms } from "./palettes";

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  varying vec2 vUv;
  varying float vSeed;
  void main() {
    vUv = uv;
    vSeed = aSeed;
    vec3 pos = position;
    // Slow, gentle drift — beams pan softly through the canopy, no jitter.
    pos.x += sin(uTime * (0.10 + 0.07 * fract(aSeed)) + aSeed * 6.2831) * 1.3;
    pos.x += sin(uTime * (0.16 + 0.06 * fract(aSeed * 1.7)) + aSeed * 2.3)
             * 1.8 * (1.0 - uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uMood;
  uniform vec3 uShaftDusk;
  uniform vec3 uShaftDawn;
  varying vec2 vUv;
  varying float vSeed;

  const vec3 ACID = vec3(0.937, 0.490, 0.220); // #ff6a1a

  float ripple(float x) {
    return sin(x) * 0.5 + sin(x * 2.7 + 1.3) * 0.25;
  }

  void main() {
    float edge = smoothstep(0.0, 0.32, vUv.x) * smoothstep(1.0, 0.68, vUv.x);
    float vert = pow(vUv.y, 1.5);
    // Steady god-rays — a faint, slow shimmer only, no pulsing or blinking.
    float shimmer = 0.88 + 0.12 * ripple(vUv.y * 5.0 - uTime * 0.18 + vSeed);
    // Strongest mid-descent, but never fully gone at the canopy top
    float desc = smoothstep(0.02, 0.4, uScroll) * smoothstep(1.0, 0.5, uScroll);
    float env = 0.45 + 0.55 * desc;
    // Some beams lean acid-green, some toward the mood accent — multi-light feel,
    // still inside the brand palette (no rainbow).
    vec3 base = mix(uShaftDusk, uShaftDawn, uMood);
    vec3 col = mix(base, ACID, 0.35 * fract(vSeed * 2.3));
    float i = edge * vert * shimmer * env * 0.55;
    gl_FragColor = vec4(col * i, i);
  }
`;

export default function LightShafts({
  shared,
  isMobile,
}: {
  shared: SharedUniforms;
  isMobile: boolean;
}) {
  const mesh = useMemo(() => {
    const count = isMobile ? 6 : 11;
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: shared.uTime,
        uScroll: shared.uScroll,
        uMood: shared.uMood,
        uShaftDusk: shared.uShaftDusk,
        uShaftDawn: shared.uShaftDawn,
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      premultipliedAlpha: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const geo = new THREE.PlaneGeometry(2, 26);
    const m = new THREE.InstancedMesh(geo, material, count);
    const seedAttr = new Float32Array(count);
    const dummy = new THREE.Object3D();
    const rng = mulberry32(777);

    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (rng() * 2 - 1) * 12,
        -4 + (rng() * 2 - 1) * 6,
        -5 - rng() * 15
      );
      dummy.rotation.set(0, 0, (rng() > 0.5 ? 1 : -1) * (0.2 + rng() * 0.12));
      const w = 0.7 + rng() * 0.9;
      dummy.scale.set(w, 1, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      seedAttr[i] = rng() * 10;
    }

    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seedAttr, 1));
    m.instanceMatrix.needsUpdate = true;
    m.renderOrder = 10; // after opaque foliage
    m.frustumCulled = false;
    return m;
  }, [shared, isMobile]);

  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.ShaderMaterial).dispose();
      // Free the per-instance instanceMatrix GPU buffer + dispose listener.
      mesh.dispose();
    };
  }, [mesh]);

  return <primitive object={mesh} />;
}
