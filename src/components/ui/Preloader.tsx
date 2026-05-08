"use client";

import { useEffect, useState } from "react";

const SHARED_ASSETS = [
  "/images/about/portrait.jpg",
  "/images/upcoming/dusk-to-dawn.jpg",
  "/images/branding/w-logo.png",
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const isMobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const heroVideo = isMobile ? "/videos/sora-jungle-mobile.mp4" : "/videos/sora-jungle.mp4";
    const assets = [heroVideo, ...SHARED_ASSETS];
    const total = assets.length + 1; // +1 for fonts.ready

    const tick = () => {
      loaded += 1;
      if (cancelled) return;
      setProgress(Math.round((loaded / total) * 100));
      if (loaded >= total) finish();
    };

    const finish = () => {
      if (cancelled) return;
      setDone(true);
      setTimeout(() => {
        if (!cancelled) setHidden(true);
      }, 600);
    };

    const failsafe = setTimeout(finish, 4500);

    document.fonts?.ready.then(tick).catch(tick);

    assets.forEach((src) => {
      if (src.endsWith(".mp4")) {
        const v = document.createElement("video");
        v.preload = "auto";
        v.muted = true;
        v.src = src;
        v.addEventListener("loadeddata", tick, { once: true });
        v.addEventListener("error", tick, { once: true });
      } else {
        const img = new Image();
        img.onload = tick;
        img.onerror = tick;
        img.src = src;
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "var(--jungle-deep)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "32px",
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
        transition: "opacity 0.6s cubic-bezier(.7,0,.2,1)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-anton), sans-serif",
          fontSize: "clamp(56px, 12vw, 140px)",
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
          color: "var(--bone)",
          lineHeight: 1,
        }}
      >
        WTCHOUT
      </div>
      <div
        style={{
          width: "min(220px, 60vw)",
          height: "1px",
          background: "rgba(245,240,232,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            background: "var(--neon-lime)",
            width: `${progress}%`,
            transition: "width 0.3s linear",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "10px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--bone-dim)",
        }}
      >
        — Loading the canopy · {progress}%
      </div>
    </div>
  );
}
