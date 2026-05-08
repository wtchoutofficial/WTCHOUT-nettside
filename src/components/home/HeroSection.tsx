"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    let videoReady = false;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let pausedTimer: ReturnType<typeof setTimeout> | null = null;

    const onReady = () => {
      if (videoReady) return;
      videoReady = true;
      setLoaded(true);
      try {
        video.pause();
      } catch {}
    };
    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplay", onReady, { once: true });
    if (video.readyState >= 1) onReady();
    try {
      video.load();
    } catch {}

    const computeProgress = () => {
      const rect = hero.getBoundingClientRect();
      const total = hero.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / total));
    };

    const onScroll = () => {
      if (!videoReady) return;
      const now = performance.now();
      const dy = window.scrollY - lastScrollY;
      const dt = Math.max(1, now - lastScrollTime);
      const velocity = dy / dt;
      lastScrollY = window.scrollY;
      lastScrollTime = now;

      if (!video.duration) return;

      const rate = Math.max(0.3, Math.min(4, Math.abs(velocity) * 2.5));

      if (dy > 0) {
        // Scrolling DOWN: play forward at velocity-driven rate.
        // If we've reached the end of the video, hold there.
        if (video.currentTime >= video.duration - 0.05) {
          try {
            video.pause();
          } catch {}
        } else {
          try {
            video.playbackRate = rate;
            if (video.paused) video.play().catch(() => {});
          } catch {}
        }
      } else if (dy < 0) {
        // Scrolling UP: seek to the time that matches current scroll progress.
        // This way scrolling all the way up brings the video back to frame 0.
        try {
          video.pause();
        } catch {}
        const p = computeProgress();
        const target = video.duration * p;
        try {
          if (Math.abs(video.currentTime - target) > 0.02) {
            video.currentTime = target;
          }
        } catch {}
      }

      if (pausedTimer) clearTimeout(pausedTimer);
      pausedTimer = setTimeout(() => {
        try {
          video.pause();
        } catch {}
        // When scrolling stops, snap currentTime to the exact scroll position
        // so any drift from velocity-based forward play is corrected.
        const p = computeProgress();
        if (video.duration) {
          const target = video.duration * p;
          try {
            if (Math.abs(video.currentTime - target) > 0.05) {
              video.currentTime = target;
            }
          } catch {}
        }
      }, 140);
    };

    let raf = 0;
    const tick = () => {
      const rect = hero.getBoundingClientRect();
      const total = hero.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / total));

      if (titleRef.current) {
        titleRef.current.style.opacity = "1";
        titleRef.current.style.transform = `translate(-50%, -50%) scale(${1 - p * 0.18})`;
      }
      if (tintRef.current) {
        tintRef.current.style.opacity = String(Math.max(0, 1 - p * 1.3));
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - p * 6));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      if (pausedTimer) clearTimeout(pausedTimer);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: "relative",
        height: "300vh",
        minHeight: "300vh",
        background: "#000",
        overflow: "clip",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <video
          ref={videoRef}
          src="/videos/sora-jungle.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            display: "block",
            willChange: "transform, filter",
          }}
        />

        {/* Color grade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%), linear-gradient(180deg, rgba(8,15,12,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
        {/* Warm tint that fades as you descend */}
        <div
          ref={tintRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(217, 119, 87, 0.15) 0%, transparent 50%)",
            mixBlendMode: "overlay",
            pointerEvents: "none",
            willChange: "opacity",
          }}
        />
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.85) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.95' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            mixBlendMode: "overlay",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />

        {/* Title */}
        <div
          ref={titleRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 5,
            willChange: "opacity, transform",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(246,244,239,0.8)",
              marginBottom: "24px",
            }}
          >
            — Above the canopy · scroll to descend —
          </div>
          <h1
            style={{
              fontFamily: "var(--font-anton), sans-serif",
              fontSize: "clamp(80px, 14vw, 220px)",
              fontWeight: 900,
              color: "#f6f4ef",
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
              margin: 0,
              textShadow: "0 4px 40px rgba(0,0,0,0.6)",
              textTransform: "uppercase",
            }}
          >
            WTCHOUT
          </h1>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "12px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(246,244,239,0.85)",
              marginTop: "24px",
            }}
          >
            — sound beyond boundaries —
          </div>
        </div>

        <div
          ref={hintRef}
          style={{
            position: "absolute",
            right: "32px",
            bottom: "32px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(246,244,239,0.6)",
            zIndex: 6,
            willChange: "opacity",
          }}
        >
          scroll ↓
        </div>

        {/* Loading overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: loaded ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(246,244,239,0.5)",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            zIndex: 10,
            background: "#000",
          }}
        >
          loading the canopy…
        </div>
      </div>
    </section>
  );
}
