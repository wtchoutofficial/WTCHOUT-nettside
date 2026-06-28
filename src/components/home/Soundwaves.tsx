"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Public path to the preview clip, e.g. "/audio/id-preview.mp3". */
  audioSrc?: string;
  /** Hard cap on how many seconds of the track preview before it stops. */
  previewSeconds?: number;
};

// Flowing wave-mesh for the Coming-soon card: a dense band of fine white lines
// warped by a smooth noise field into an organic, rippling terrain. When a
// preview clip is provided, a play button appears and the mesh becomes
// audio-reactive — swelling and brightening with the track via a Web Audio
// analyser. Monochrome, matching the hero's black-and-white aesthetic.
export default function Soundwaves({
  audioSrc,
  previewSeconds = 15,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toggleRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

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

    // --- audio (optional) ---
    let audio: HTMLAudioElement | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let data: Uint8Array<ArrayBuffer> | null = null;
    let level = 0; // smoothed 0..1 loudness, drives amplitude + brightness

    // Touch devices (mobile) skip the Web Audio graph entirely: routing the
    // element through createMediaElementSource + a suspended AudioContext is a
    // common cause of silent playback on iOS. There we just play the plain
    // element (no wave-reactivity, but reliable sound).
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (audioSrc) {
      audio = new Audio(audioSrc);
      audio.preload = "auto";
      const onError = () => setFailed(true);
      const onTime = () => {
        if (audio && audio.currentTime >= previewSeconds) {
          audio.pause();
          audio.currentTime = 0;
          setPlaying(false);
        }
      };
      const onEnded = () => setPlaying(false);
      audio.addEventListener("error", onError);
      audio.addEventListener("timeupdate", onTime);
      audio.addEventListener("ended", onEnded);

      // Sync toggle: play() is called directly inside the tap gesture (no await
      // before it) so iOS accepts it as user-initiated.
      toggleRef.current = () => {
        const a = audio;
        if (!a) return;
        if (!a.paused) {
          a.pause();
          setPlaying(false);
          return;
        }
        // Desktop only: set up the analyser for the audio-reactive mesh.
        if (!isTouch && !audioCtx) {
          try {
            const AC =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            audioCtx = new AC();
            const node = audioCtx.createMediaElementSource(a);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            data = new Uint8Array(new ArrayBuffer(analyser.fftSize));
            node.connect(analyser);
            analyser.connect(audioCtx.destination);
          } catch {
            audioCtx = null;
            analyser = null;
          }
        }
        audioCtx?.resume();
        a.currentTime = 0;
        setPlaying(true);
        a.play().catch(() => setPlaying(false));
      };
    }

    const N = 60; // number of woven lines

    const draw = (t: number) => {
      // Audio level → smoothed; decays to 0 when paused / no audio.
      if (analyser && data && audio && !audio.paused) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let k = 0; k < data.length; k++) {
          const x = (data[k] - 128) / 128;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / data.length);
        level += (Math.min(1, rms * 2.4) - level) * 0.18;
      } else {
        level += (0 - level) * 0.08;
      }

      ctx.clearRect(0, 0, w, h);

      const top = h * 0.4;
      const bottom = h * 1.02;
      const span = bottom - top;
      // Idle: gentle synthetic swell. Playing: amplitude pumps with the track.
      const amp = span * (0.3 + 0.55 * level);
      const pts = Math.max(80, Math.floor(w / 6));

      ctx.lineJoin = "round";
      ctx.lineWidth = 1;

      for (let i = 0; i < N; i++) {
        const q = i / (N - 1); // 0 (top) .. 1 (bottom)
        const baseY = top + q * span;
        const a = Math.min(0.32, (0.04 + 0.12 * q) * (1 + level * 0.9));
        ctx.strokeStyle = `rgba(245,242,235,${a})`;
        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const px = j / pts;
          const x = px * w;
          const env = 0.3 + 0.7 * Math.sin(Math.PI * px);
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
    let startT = 0;
    const loop = (now: number) => {
      if (!startT) startT = now;
      draw((now - startT) / 1000);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      draw(0.8); // single static frame (audio still plays via the button)
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      if (audioCtx) audioCtx.close().catch(() => {});
      toggleRef.current = null;
    };
  }, [audioSrc, previewSeconds]);

  return (
    <>
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

      {audioSrc && !failed && (
        <button
          type="button"
          onClick={() => toggleRef.current?.()}
          aria-label={playing ? "Pause preview" : "Play preview"}
          style={{
            position: "absolute",
            left: "50%",
            top: "60%",
            transform: "translate(-50%, -50%)",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "none",
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: "1px solid var(--neon-lime)",
              background: "rgba(5,13,8,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              boxShadow: playing
                ? "0 0 22px rgba(200,252,42,0.5)"
                : "0 0 12px rgba(200,252,42,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "box-shadow .3s ease",
            }}
          >
            {playing ? (
              // pause
              <span style={{ display: "flex", gap: "5px" }}>
                <span style={{ width: "4px", height: "18px", background: "var(--neon-lime)" }} />
                <span style={{ width: "4px", height: "18px", background: "var(--neon-lime)" }} />
              </span>
            ) : (
              // play triangle
              <span
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: "4px",
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "16px solid var(--neon-lime)",
                }}
              />
            )}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--bone-dim)",
            }}
          >
            {playing ? "Playing…" : "Preview"}
          </span>
        </button>
      )}
    </>
  );
}
