"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mulberry32, type SharedUniforms } from "./palettes";

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uCamY;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.12 + aSeed * 6.28) * 0.4;
    pos.y += cos(uTime * 0.09 + aSeed * 4.0) * 0.3;
    // Wrap vertically around the camera so the field follows the descent
    pos.y = mod(pos.y - uCamY + 15.0, 30.0) + uCamY - 15.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float size = 2.0 + 4.0 * fract(aSeed * 7.13);
    gl_PointSize = size * (180.0 / max(1.0, -mv.z));
    vAlpha = 0.2 + 0.45 * fract(aSeed * 3.7);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uMood;
  uniform vec3 uDustDusk;
  uniform vec3 uDustDawn;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.1, length(c)) * vAlpha;
    vec3 col = mix(uDustDusk, uDustDawn, uMood);
    gl_FragColor = vec4(col * a, a);
  }
`;

export default function DustParticles({
  shared,
  isMobile,
}: {
  shared: SharedUniforms;
  isMobile: boolean;
}) {
  const points = useMemo(() => {
    const count = isMobile ? 250 : 600;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const rng = mulberry32(99);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() * 2 - 1) * 14;
      positions[i * 3 + 1] = -20 + rng() * 28;
      positions[i * 3 + 2] = -2 - rng() * 28;
      seeds[i] = rng() * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: shared.uTime,
        uCamY: shared.uCamY,
        uMood: shared.uMood,
        uDustDusk: shared.uDustDusk,
        uDustDawn: shared.uDustDawn,
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      premultipliedAlpha: true,
      depthWrite: false,
    });

    const p = new THREE.Points(geo, material);
    p.renderOrder = 11;
    p.frustumCulled = false;
    return p;
  }, [shared, isMobile]);

  useEffect(() => {
    return () => {
      points.geometry.dispose();
      (points.material as THREE.ShaderMaterial).dispose();
    };
  }, [points]);

  return <primitive object={points} />;
}
