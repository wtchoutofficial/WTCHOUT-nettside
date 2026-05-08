"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll(".cursor-dot, .cursor-ring").forEach((el) => el.remove());

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    const hoverSelector =
      "a, button, input, select, textarea, [data-cursor-hover], .release-row, .tour-row, .coming-card, .g-tile";
    const onEnter = () => ring.classList.add("hover");
    const onLeave = () => ring.classList.remove("hover");
    const attach = () => {
      document.querySelectorAll(hoverSelector).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      observer.disconnect();
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
