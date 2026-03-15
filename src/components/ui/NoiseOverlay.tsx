"use client";

const noiseStyles = `
@keyframes noise-shift {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -5%); }
  20% { transform: translate(-10%, 5%); }
  30% { transform: translate(5%, -10%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-10%, 5%); }
  60% { transform: translate(15%, 0); }
  70% { transform: translate(0, 10%); }
  80% { transform: translate(-15%, 0); }
  90% { transform: translate(10%, 5%); }
  100% { transform: translate(5%, 0); }
}
@media (max-width: 768px) {
  .noise-layer { display: none !important; }
}
`;

export function NoiseOverlay() {
  return (
    <>
      <style>{noiseStyles}</style>
      <div
        className="noise-layer pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        aria-hidden="true"
      >
        <svg className="hidden">
          <filter id="wtchout-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: "-50%",
            width: "200%",
            height: "200%",
            filter: "url(#wtchout-noise)",
            animation: "noise-shift 0.5s steps(2) infinite",
          }}
        />
      </div>
    </>
  );
}

export default NoiseOverlay;
