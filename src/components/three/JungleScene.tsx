"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import DustParticles from "./DustParticles";
import FoliageLayers from "./FoliageLayers";
import LightShafts from "./LightShafts";
import { createSharedUniforms, DUSK, DAWN } from "./palettes";
import type { Mood } from "@/context/MoodContext";

export default function JungleScene({
  scrollRef,
  pointerRef,
  isMobile,
  mood,
  onFirstFrame,
}: {
  scrollRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  mood: Mood;
  onFirstFrame: () => void;
}) {
  const shared = useMemo(() => createSharedUniforms(), []);
  const moodAnim = useRef({ v: mood === "dawn" ? 1 : 0, target: mood === "dawn" ? 1 : 0 });
  const firstFrame = useRef(false);

  useEffect(() => {
    moodAnim.current.target = mood === "dawn" ? 1 : 0;
  }, [mood]);

  useFrame(({ gl, clock }, dt) => {
    shared.uTime.value = clock.elapsedTime;

    // Ease mood toward target — ~1.5s settle, frame-rate independent.
    const a = moodAnim.current;
    a.v += (a.target - a.v) * (1 - Math.exp(-dt / 0.45));
    if (Math.abs(a.target - a.v) < 0.001) a.v = a.target;
    shared.uMood.value = a.v;

    // Fog + clear color track the mood so far foliage dissolves into the bg.
    shared.uFogColor.value.lerpColors(DUSK.fog, DAWN.fog, a.v);
    gl.setClearColor(shared.uFogColor.value, 1);

    if (!firstFrame.current) {
      firstFrame.current = true;
      onFirstFrame();
    }
  });

  return (
    <>
      <CameraRig
        scrollRef={scrollRef}
        pointerRef={pointerRef}
        isMobile={isMobile}
        shared={shared}
      />
      <FoliageLayers shared={shared} isMobile={isMobile} />
      <LightShafts shared={shared} isMobile={isMobile} />
      <DustParticles shared={shared} isMobile={isMobile} />
    </>
  );
}
