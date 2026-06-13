"use client";

import { useEffect, useRef } from "react";

export default function SideRails() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    let raf = 0;
    const tick = () => {
      const hero = document.getElementById("hero");
      const heroHeight = hero?.offsetHeight ?? window.innerHeight;
      // Start fading after hero ends (one viewport past hero start), full out by hero bottom.
      const start = heroHeight - window.innerHeight;
      const end = heroHeight - window.innerHeight * 0.5;
      const y = window.scrollY;
      const opacity =
        y <= start
          ? 1
          : y >= end
          ? 0
          : 1 - (y - start) / (end - start);
      const visibility = opacity < 0.05 ? "hidden" : "visible";
      left.style.opacity = String(opacity);
      right.style.opacity = String(opacity);
      left.style.visibility = visibility;
      right.style.visibility = visibility;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const railStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    transformOrigin: "center",
    fontFamily: "var(--font-jetbrains), monospace",
    fontSize: "10px",
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: "var(--bone-dim)",
    zIndex: 50,
    mixBlendMode: "difference",
    transition: "opacity .25s linear",
    pointerEvents: "none",
  };

  return (
    <>
      <div
        ref={leftRef}
        className="hidden md:block"
        style={{
          ...railStyle,
          left: "-40px",
          transform: "translateY(-50%) rotate(-90deg)",
        }}
      >
        Hustadvika · 62.9N 7.2E
      </div>
      <div
        ref={rightRef}
        className="hidden md:block"
        style={{
          ...railStyle,
          right: "-40px",
          transform: "translateY(-50%) rotate(-90deg)",
        }}
      >
        Norwegian house &amp; rave
      </div>
    </>
  );
}
