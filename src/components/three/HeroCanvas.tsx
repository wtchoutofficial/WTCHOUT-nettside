"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import JungleScene from "./JungleScene";
import type { Mood } from "@/context/MoodContext";

export default function HeroCanvas({
  scrollRef,
  pointerRef,
  isMobile,
  mood,
  heroRef,
  onContextLost,
}: {
  scrollRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  mood: Mood;
  heroRef: RefObject<HTMLElement | null>;
  onContextLost: () => void;
}) {
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(false);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  // Render only while the hero is on screen and the tab is visible — zero GPU
  // work once you've scrolled past.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let onScreen = true;
    let tabVisible = !document.hidden;
    const sync = () => setActive(onScreen && tabVisible);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "150px" }
    );
    io.observe(hero);

    const onVis = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [heroRef]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, isMobile ? 1.5 : 1.75]}
      flat
      gl={{
        antialias: false,
        alpha: false,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
      }}
      camera={{ fov: 60, near: 0.1, far: 80, position: [0, 6, 9] }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
      onCreated={({ gl }) => {
        glRef.current = gl;
        const canvas = gl.domElement;
        const handleLost = (e: Event) => {
          e.preventDefault();
          onContextLost();
        };
        canvas.addEventListener("webglcontextlost", handleLost, { once: true });
      }}
    >
      <JungleScene
        scrollRef={scrollRef}
        pointerRef={pointerRef}
        isMobile={isMobile}
        mood={mood}
        onFirstFrame={() => setVisible(true)}
      />
    </Canvas>
  );
}
