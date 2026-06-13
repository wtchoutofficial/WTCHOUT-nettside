"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import * as THREE from "three";
import type { SharedUniforms } from "./palettes";

export default function CameraRig({
  scrollRef,
  pointerRef,
  isMobile,
  shared,
}: {
  scrollRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  shared: SharedUniforms;
}) {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }, dt) => {
    const p = scrollRef.current ?? 0;
    const e = p * p * (3 - 2 * p); // smoothstep ease on descent

    const camY = THREE.MathUtils.lerp(6, -14, e); // above canopy → floor
    const camZ = THREE.MathUtils.lerp(9, 6.5, e); // gentle dolly-in

    // Desktop: pointer parallax. Mobile: autonomous sway (no gyro prompt).
    const t = clock.elapsedTime;
    const px = isMobile
      ? Math.sin(t * 0.18) * 0.25
      : (pointerRef.current?.x ?? 0) * 0.7;
    const py = isMobile
      ? Math.cos(t * 0.13) * 0.15
      : (pointerRef.current?.y ?? 0) * 0.4;

    // Frame-rate-independent damping
    const k = 1 - Math.exp(-4 * Math.min(dt, 0.05));
    camera.position.x += (px - camera.position.x) * k;
    camera.position.y += (camY - py - camera.position.y) * k;
    camera.position.z += (camZ - camera.position.z) * k;

    target.set(0, camera.position.y - 2.5, -12); // downward pitch while descending
    camera.lookAt(target);

    shared.uScroll.value = p;
    shared.uCamY.value = camera.position.y;
  });

  return null;
}
