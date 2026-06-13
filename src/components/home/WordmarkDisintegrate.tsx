"use client";

import { useEffect, useRef, type RefObject } from "react";

interface Particle {
  ox: number;
  oy: number;
  size: number;
  off: number; // release jitter so the crumbling edge is ragged
  rise: number;
  wob: number;
  spread: number;
}

/**
 * Renders the WTCHOUT wordmark crisply, then disintegrates it into drifting
 * dust as the shared scroll progress climbs. A dissolve front sweeps across the
 * word: the standing part stays sharp, the dissolving edge sheds particles that
 * fly up/outward and fade — so the letters visibly crumble apart, not fade out.
 */
export default function WordmarkDisintegrate({
  scrollRef,
  isMobile,
  text = "WTCHOUT",
}: {
  scrollRef: RefObject<number>;
  isMobile: boolean;
  text?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const textCanvas = document.createElement("canvas");
    const tctx = textCanvas.getContext("2d");
    if (!tctx) return;

    let W = 0;
    let H = 0;
    let feather = 60;
    let particles: Particle[] = [];
    let raf = 0;
    let active = true;
    let introStart = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INTRO_MS = reduced ? 0 : 1700;

    const fontFamily =
      getComputedStyle(document.body).getPropertyValue("--font-anton").trim() ||
      "Anton";

    const applyFont = (c: CanvasRenderingContext2D, fs: number) => {
      c.font = `${fs}px ${fontFamily}, sans-serif`;
      if ("letterSpacing" in c) {
        (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          `${-0.04 * fs}px`;
      }
    };

    const build = () => {
      const fs = Math.max(80, Math.min(220, window.innerWidth * 0.14));

      tctx.setTransform(1, 0, 0, 1, 0, 0);
      applyFont(tctx, fs);
      const textW = tctx.measureText(text).width;
      const padX = fs * 0.7;
      const padY = fs * 0.9;
      W = Math.ceil(textW + padX * 2);
      H = Math.ceil(fs * 1.1 + padY * 2);
      feather = Math.max(48, fs * 0.5);

      for (const c of [canvas, textCanvas]) {
        c.width = Math.ceil(W * dpr);
        c.height = Math.ceil(H * dpr);
      }
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      canvas.style.marginTop = `${-padY * 0.78}px`;
      canvas.style.marginBottom = `${-padY * 0.7}px`;

      // Crisp master copy of the wordmark
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, W, H);
      applyFont(tctx, fs);
      tctx.fillStyle = "#f6f4ef";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      tctx.fillText(text, W / 2, H / 2);

      // Sample particles from the master copy
      const data = tctx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
      const stride = isMobile ? 4 : 3;
      particles = [];
      for (let y = 0; y < H; y += stride) {
        for (let x = 0; x < W; x += stride) {
          const bx = Math.floor(x * dpr);
          const by = Math.floor(y * dpr);
          if (data[(by * textCanvas.width + bx) * 4 + 3] > 128) {
            particles.push({
              ox: x,
              oy: y,
              size: stride * 1.1,
              off: (Math.random() - 0.5) * feather * 1.3,
              rise: 30 + Math.random() * 90,
              wob: Math.random() * Math.PI * 2,
              spread: (x - W / 2) * 0.01 + (Math.random() - 0.5) * 0.7,
            });
          }
        }
      }
    };

    // Per-particle flight offset (used both for crumble-out and assemble-in).
    const flight = (pt: Particle, t: number) => {
      const ease = t * t;
      return {
        dx: pt.spread * 130 * ease + Math.sin(pt.wob + t * 7) * 16 * ease,
        dy: -(30 + pt.rise) * ease + Math.sin(pt.wob) * 8 * ease,
        size: pt.size * (1 - t * 0.5),
      };
    };

    const draw = (now: number) => {
      if (!active) return;
      if (!introStart) introStart = now;
      const intro =
        INTRO_MS <= 0 ? 1 : Math.min(1, (now - introStart) / INTRO_MS);
      // ease-out so the word snaps into place
      const reveal = 1 - Math.pow(1 - intro, 3);

      const p = scrollRef.current ?? 0;
      const dissolve = Math.max(0, Math.min(1, (p - 0.03) / 0.42));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const span = W + feather;
      const frontReveal = reveal * span; // assembly sweep (left→right)
      const frontDissolve = dissolve * span; // crumble sweep (left→right)

      // Crisp standing letters: revealed but not yet dissolved → [frontDissolve, frontReveal]
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(textCanvas, 0, 0, W, H);
      ctx.globalCompositeOperation = "destination-in";
      if (reveal < 1) {
        const gr = ctx.createLinearGradient(frontReveal - feather, 0, frontReveal, 0);
        gr.addColorStop(0, "rgba(0,0,0,1)");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
      }
      if (dissolve > 0) {
        const gd = ctx.createLinearGradient(frontDissolve - feather, 0, frontDissolve, 0);
        gd.addColorStop(0, "rgba(0,0,0,0)");
        gd.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = gd;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = "source-over";

      // Flying dust — assembling in ahead of the reveal front, crumbling out
      // behind the dissolve front.
      ctx.fillStyle = "#f6f4ef";
      const denom = feather * 1.7;
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const rp = (frontReveal - pt.ox + pt.off) / denom;
        const dp = (frontDissolve - pt.ox + pt.off) / denom;
        if (rp <= 0) continue; // not assembled yet
        if (rp < 1) {
          // assembling: fly in from dispersed → home, fading in
          const t = 1 - rp;
          const f = flight(pt, t);
          ctx.globalAlpha = rp;
          ctx.fillRect(pt.ox + f.dx, pt.oy + f.dy, f.size, f.size);
        } else if (dp > 0) {
          // crumbling: fly out, fading
          const t = Math.min(1, dp);
          const f = flight(pt, t);
          ctx.globalAlpha = 1 - t;
          ctx.fillRect(pt.ox + f.dx, pt.oy + f.dy, f.size, f.size);
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      build();
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) {
          active = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting) {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(canvas);

    let resizeT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(build, 150);
    };
    window.addEventListener("resize", onResize);

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(async () => {
      try {
        await document.fonts.load(`120px ${fontFamily}`);
      } catch {
        // fall back to sans-serif
      }
      if (canvasRef.current) start();
    });

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeT);
    };
  }, [scrollRef, isMobile, text]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "block", margin: "0 auto" }}
    />
  );
}
