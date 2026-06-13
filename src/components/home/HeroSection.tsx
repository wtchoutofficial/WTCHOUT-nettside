"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMood } from "@/context/MoodContext";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  // Written by the RAF loop / pointer listener, read by the 3D camera each
  // frame — refs so scrolling never triggers React re-renders.
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const { mood, setMood } = useMood();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Gate the 3D layer: reduced motion / no WebGL / data-saver all fall back to
  // the poster. One idle tick before loading so the poster is the LCP, not the
  // three.js chunk.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    if (!gl) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;

    const enable = () => setShow3D(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(enable, 250);
    return () => clearTimeout(t);
  }, []);

  // Scroll progress + title/tint/hint choreography (unchanged from the video
  // era — the same RAF now also feeds the 3D camera via scrollRef).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduced) return;
    // Synchronous guard: `reduced` state only flips after the first commit, so
    // without this the RAF would run for ~1 frame before the effect re-runs.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      const rect = hero.getBoundingClientRect();
      const total = hero.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      scrollRef.current = p;

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
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Pointer parallax source (desktop only — mobile gets autonomous sway in
  // the camera rig instead of a gyro permission prompt).
  useEffect(() => {
    if (isMobile || reduced) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile, reduced]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-section"
      data-reduced={reduced || undefined}
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
        {/* Poster pair — instant paint, permanent fallback below the canvas.
            Cross-faded by html[data-mood] CSS. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/poster-dusk.jpg"
          alt=""
          fetchPriority="high"
          className="hero-poster hero-poster--dusk"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/poster-dawn.jpg"
          alt=""
          className="hero-poster hero-poster--dawn"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />

        {/* Real-time jungle — lazy chunk, fades in over the poster. */}
        {show3D && (
          <HeroCanvas
            scrollRef={scrollRef}
            pointerRef={pointerRef}
            isMobile={isMobile}
            mood={mood}
            heroRef={heroRef}
            onContextLost={() => setShow3D(false)}
          />
        )}

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
            — norwegian house &amp; rave —
          </div>
        </div>

        {/* Mood toggle */}
        <div
          style={{
            position: "absolute",
            left: "32px",
            bottom: "32px",
            zIndex: 7,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "auto",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          <button
            type="button"
            onClick={() => setMood("dusk")}
            aria-pressed={mood === "dusk"}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              color: mood === "dusk" ? "#e89a3c" : "rgba(246,244,239,0.4)",
              transition: "color 0.4s ease",
            }}
          >
            Dusk
          </button>
          <span style={{ color: "rgba(246,244,239,0.3)" }}>·</span>
          <button
            type="button"
            onClick={() => setMood("dawn")}
            aria-pressed={mood === "dawn"}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              color: mood === "dawn" ? "#4fc2ab" : "rgba(246,244,239,0.4)",
              transition: "color 0.4s ease",
            }}
          >
            Dawn
          </button>
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
          scroll ↓︎
        </div>
      </div>
    </section>
  );
}
