"use client";

import { useEffect, useRef, type RefObject } from "react";

// Hero — recreated from the design handoff (design_handoff_hero).
// Full-viewport monochrome portrait on the left melting into pure black on the
// right, oversized WTCHOUT wordmark over the seam, technical label system, a
// living film-grain canvas and a subtle mouse-driven parallax diorama.
// The site's global <Navbar> already provides the top bar, so the handoff's
// own top bar is intentionally omitted here to avoid a duplicate nav.

const BG = "#070706";
const FG = "#f2efe9";
const GRAIN_INTENSITY = 0.07;
const PARALLAX_STRENGTH = 1;
const PHOTO_CONTRAST = 1.14;

export default function HeroSection() {
  const photoRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  // ---------- living film grain ----------
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = grainRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const buf = document.createElement("canvas");
    buf.width = buf.height = 150;
    const bctx = buf.getContext("2d");
    if (!bctx) return;
    const img = bctx.createImageData(150, 150);

    const resize = () => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      // Re-randomize only ~15fps so the grain "crawls" rather than shimmering.
      if (t - last > 66) {
        last = t;
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = d[i + 1] = d[i + 2] = 255; // white; only alpha varies
          d[i + 3] = Math.random() * 255 * GRAIN_INTENSITY;
        }
        bctx.putImageData(img, 0, 0);
        const pat = ctx.createPattern(buf, "repeat");
        if (pat) {
          ctx.clearRect(0, 0, cv.width, cv.height);
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, cv.width, cv.height);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ---------- mouse parallax ----------
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers: Array<[RefObject<HTMLDivElement | null>, number, number]> = [
      [photoRef, -9, 0.55],
      [ghostRef, 30, 0.6],
      [wordRef, 12, 0.5],
      [seamRef, 18, 0.4],
    ];

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const s = PARALLAX_STRENGTH;
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      for (const [ref, fx, fyk] of layers) {
        const el = ref.current;
        if (el) {
          el.style.transform = `translate3d(${cx * fx * s}px,${cy * fx * fyk * s}px,0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const insetRight = "clamp(20px, 4.5vw, 68px)";
  const mono = "var(--font-space-mono), monospace";
  const wordSize = "clamp(56px, 12vw, 210px)";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: "620px",
        background: BG,
        color: FG,
        overflow: "hidden",
        fontFamily: "var(--font-archivo), -apple-system, sans-serif",
      }}
    >
      {/* PHOTO LAYER (parallax target — counter-moves for depth) */}
      <div
        ref={photoRef}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "58%",
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-portrait.jpg"
          alt="WTCHOUT — Oscar André Naas at the decks"
          className="wtc-photo-img"
          fetchPriority="high"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "34% 40%",
            filter: `grayscale(1) contrast(${PHOTO_CONTRAST}) brightness(0.82)`,
            transform: "scale(1.06)",
            animation: "wtcPhoto 1.8s cubic-bezier(.16,.84,.34,1) both",
          }}
        />
        {/* Horizontal fade to black on the right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(7,7,6,0) 30%, rgba(7,7,6,.7) 70%, #070706 100%)",
          }}
        />
        {/* Top & bottom fades */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, #070706 0%, rgba(7,7,6,0) 26%), linear-gradient(180deg, rgba(7,7,6,.55) 0%, rgba(7,7,6,0) 24%)",
          }}
        />
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(130% 95% at 38% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,.5) 100%)",
          }}
        />
      </div>

      {/* SEAM LABEL — vertical technical tag */}
      <div
        ref={seamRef}
        className="wtc-anim"
        style={{
          position: "absolute",
          left: "57%",
          top: "21%",
          writingMode: "vertical-rl",
          fontFamily: mono,
          fontSize: "11px",
          letterSpacing: "0.34em",
          color: "rgba(242,239,233,.4)",
          textTransform: "uppercase",
          willChange: "transform",
          animation: "wtcFade 2s .6s both",
          zIndex: 4,
        }}
      >
        Portrait — 001 / Hustadvika
      </div>

      {/* GHOST WORDMARK — outlined echo, offset +8px right / +9px down */}
      <div
        ref={ghostRef}
        className="wtc-anim"
        style={{
          position: "absolute",
          right: `calc(${insetRight} + 8px)`,
          bottom: `calc(clamp(120px, 20vh, 230px) + 9px)`,
          zIndex: 5,
          willChange: "transform",
          animation: "wtcFade 2.2s .5s both",
        }}
      >
        <span
          style={{
            display: "block",
            fontWeight: 900,
            fontSize: wordSize,
            lineHeight: 0.82,
            letterSpacing: "-0.035em",
            color: "transparent",
            WebkitTextStroke: "1.1px rgba(200,252,42,.32)",
          }}
        >
          WTCHOUT
        </span>
      </div>

      {/* SOLID WORDMARK — headline */}
      <div
        ref={wordRef}
        style={{
          position: "absolute",
          right: insetRight,
          bottom: "clamp(120px, 20vh, 230px)",
          zIndex: 7,
          willChange: "transform",
        }}
      >
        <h1
          className="wtc-anim"
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: wordSize,
            lineHeight: 0.82,
            letterSpacing: "-0.035em",
            color: FG,
            textShadow: "0 2px 40px rgba(0,0,0,.55)",
            animation: "wtcUp 1.2s .45s both",
          }}
        >
          WTCHOUT
        </h1>
      </div>

      {/* TAGLINE + NAME */}
      <div
        className="wtc-anim"
        style={{
          position: "absolute",
          right: insetRight,
          bottom: "clamp(76px, 13vh, 150px)",
          textAlign: "right",
          zIndex: 7,
          maxWidth: "560px",
          animation: "wtcUp 1.2s .62s both",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "clamp(14px, 1.25vw, 18px)",
            lineHeight: 1.5,
            color: "var(--neon-lime)",
            fontWeight: 400,
          }}
        >
          Raw, late-night house &amp; rave from the west coast of Norway.
        </p>
      </div>

      {/* SCROLL INDICATOR (bottom-center) */}
      <div
        className="wtc-anim"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "30px",
          transform: "translateX(-50%)",
          zIndex: 7,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "wtcFade 1.6s 1s both",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(242,239,233,.5)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <span
          style={{
            position: "relative",
            width: "1px",
            height: "30px",
            background: "rgba(242,239,233,.2)",
            overflow: "hidden",
          }}
        >
          <span
            className="wtc-scroll-bar"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "1px",
              height: "14px",
              background: "var(--neon-lime)",
              boxShadow: "0 0 8px rgba(200,252,42,.6)",
              animation: "wtcScroll 1.8s ease-in-out infinite",
            }}
          />
        </span>
      </div>

      {/* LIVING GRAIN */}
      <canvas
        ref={grainRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 20,
          mixBlendMode: "screen",
          opacity: 0.5,
        }}
      />
    </section>
  );
}
