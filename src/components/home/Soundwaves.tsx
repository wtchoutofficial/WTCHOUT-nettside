"use client";

import { useEffect, useRef } from "react";

// Flowing wave-mesh for the Coming-soon card: a dense band of many fine white
// lines warped by a smooth noise field so they weave into an organic, rippling
// terrain — bunching into bright ridges where they converge. Monochrome to match
// the hero's black-and-white aesthetic; sits below the "ID" title and fills the
// box down to the floor. Pure synthesis, no audio input.
export default function Soundwaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = 60; // number of woven lines

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Band sits below the "ID" title and fills to the bottom edge.
      const top = h * 0.4;
      const bottom = h * 1.02;
      const span = bottom - top;
      const amp = span * 0.34; // > line spacing, so lines overlap into a mesh
      const pts = Math.max(80, Math.floor(w / 6));

      ctx.lineJoin = "round";
      ctx.lineWidth = 1;

      for (let i = 0; i < N; i++) {
        const q = i / (N - 1); // 0 (top) .. 1 (bottom)
        const baseY = top + q * span;
        // Denser/brighter toward the floor, opening up (fading) toward the top.
        const a = 0.04 + 0.12 * q;
        ctx.strokeStyle = `rgba(245,242,235,${a})`;
        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const px = j / pts;
          const x = px * w;
          // Taper amplitude at the left/right edges so the band converges there.
          const env = 0.3 + 0.7 * Math.sin(Math.PI * px);
          // Smooth multi-octave field shared across lines (q couples neighbours,
          // so they bunch into ridges instead of staying parallel).
          const n =
            Math.sin(px * 6 + q * 4 + t * 0.8) +
            0.6 * Math.sin(px * 11 - q * 3 - t * 1.1) +
            0.4 * Math.sin(px * 3 + q * 7 + t * 0.5) +
            0.3 * Math.sin(px * 17 + q * 2 + t * 1.4);
          const y = baseY + (n / 2.3) * amp * env;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    let raf = 0;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      draw(0.8); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
