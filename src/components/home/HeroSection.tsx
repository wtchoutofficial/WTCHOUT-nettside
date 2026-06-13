"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMood } from "@/context/MoodContext";
import WordmarkDisintegrate from "@/components/home/WordmarkDisintegrate";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
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
      const id = window.requestIdleCallback(enable, { timeout: 200 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(enable, 120);
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
        // The wordmark canvas disintegrates itself; here we just lift the whole
        // title block a touch and fade the small mono lines as it crumbles.
        const dissolve = Math.max(0, Math.min(1, (p - 0.03) / 0.4));
        titleRef.current.style.transform = `translate(-50%, calc(-50% - ${dissolve * 24}px)) scale(${1 - p * 0.18})`;
        const small = String(Math.max(0, 1 - dissolve * 1.5));
        if (kickerRef.current) kickerRef.current.style.opacity = small;
        if (sublineRef.current) sublineRef.current.style.opacity = small;
        if (panelsRef.current) panelsRef.current.style.opacity = small;
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

  const MOODS = [
    {
      key: "dusk" as const,
      name: "DUSK",
      line: "The warm end — groovy, sun-soaked house.",
      genres: "House · Afro House · Disco-house · Minimal",
      track: "VETLE",
      url: "https://open.spotify.com/track/5vHlkTAnn5vu2sglWlhVhD",
      accent: "#e89a3c",
    },
    {
      key: "dawn" as const,
      name: "DAWN",
      line: "The dark end — raw, late-night rave.",
      genres: "UK Garage · Hard House · Breaks · Techno",
      track: "ELSK",
      url: "https://open.spotify.com/track/7k6nrlQrQzPMA13mPYIIUj",
      accent: "#4fc2ab",
    },
  ];

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
        className="hero-stage"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Dark mood-graded backdrop (no photo) — instant paint + permanent
            fallback. The 3D scene fades in from this same dark tone, so there's
            never a video-looking frame. */}

        {/* Real-time jungle — lazy chunk, fades in over the backdrop. */}
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
            ref={kickerRef}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(246,244,239,0.8)",
              marginBottom: "24px",
            }}
          >
            Oscar André Naas — Hustadvika, NO
          </div>
          {/* Visually-hidden heading for SEO / screen readers; the canvas is
              the visual that disintegrates on scroll. */}
          <h1
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            WTCHOUT
          </h1>
          <WordmarkDisintegrate scrollRef={scrollRef} isMobile={isMobile} />
          <div
            ref={sublineRef}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "12px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(246,244,239,0.85)",
              marginTop: "24px",
            }}
          >
            Norwegian house &amp; rave · two moods, one world
          </div>
        </div>

        {/* DUSK / DAWN identity panels — the dual mood is the hero. Click a
            side to grade the whole scene; each carries its genres + a track. */}
        <div
          ref={panelsRef}
          className="hero-moods"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "44px",
            zIndex: 7,
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 6vw, 90px)",
            padding: "0 40px",
            pointerEvents: "auto",
          }}
        >
          {MOODS.map((m) => {
            const activeMood = mood === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMood(m.key)}
                aria-pressed={activeMood}
                className="hero-mood"
                style={{
                  flex: "0 1 320px",
                  textAlign: m.key === "dusk" ? "right" : "left",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  opacity: activeMood ? 1 : 0.42,
                  transition: "opacity 0.5s ease",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "clamp(22px, 2.6vw, 34px)",
                    letterSpacing: "0.04em",
                    color: activeMood ? m.accent : "var(--bone)",
                    transition: "color 0.5s ease",
                    lineHeight: 1,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-bricolage), sans-serif",
                    fontSize: "13px",
                    color: "var(--bone-dim)",
                    marginTop: "8px",
                    lineHeight: 1.4,
                    maxWidth: "320px",
                  }}
                >
                  {m.line}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(246,244,239,0.55)",
                    marginTop: "10px",
                  }}
                >
                  {m.genres}
                </div>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--neon-lime)",
                    marginTop: "14px",
                    textDecoration: "none",
                  }}
                >
                  ▶ Listen · {m.track}
                </a>
              </button>
            );
          })}
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
