"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#releases", id: "releases", label: "Releases" },
  { href: "#coming", id: "coming", label: "Coming" },
  { href: "#about", id: "about", label: "About" },
  { href: "#gallery", id: "gallery", label: "Gallery" },
  { href: "#tour", id: "tour", label: "Live" },
  { href: "#booking", id: "booking", label: "Booking" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const ids = ["hero", ...links.map((l) => l.id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const compute = () => {
      // Pick the section whose midpoint is closest to viewport top + 30%.
      const anchor = window.scrollY + window.innerHeight * 0.3;
      let bestId = sections[0].id;
      let bestDist = Infinity;
      for (const s of sections) {
        const top = s.offsetTop;
        const bottom = top + s.offsetHeight;
        if (anchor >= top && anchor < bottom) {
          bestId = s.id;
          bestDist = 0;
          break;
        }
        const dist = Math.min(Math.abs(anchor - top), Math.abs(anchor - bottom));
        if (dist < bestDist) {
          bestDist = dist;
          bestId = s.id;
        }
      }
      setActiveId((cur) => (cur === bestId ? cur : bestId));
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 md:px-8"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "12px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          mixBlendMode: "difference",
          color: "var(--bone)",
        }}
      >
        <Link href="/#hero" className="flex items-center gap-2.5 font-bold">
          <Image
            src="/images/branding/w-logo.png"
            alt="WTCHOUT"
            width={22}
            height={22}
            style={{ filter: "brightness(0) invert(1)", height: "22px", width: "auto" }}
          />
          <span>WTCHOUT</span>
        </Link>

        <div className="hidden lg:flex gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`nav-link${activeId === l.id ? " is-active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--neon-lime)",
                boxShadow: "0 0 10px var(--neon-lime)",
                animation: "wtc-pulse 1.4s ease-in-out infinite",
              }}
            />
            EST 2019 · NORWAY
          </span>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{ color: "var(--bone)" }}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-[99] lg:hidden flex flex-col items-center justify-center gap-6"
          style={{
            background: "rgba(5, 13, 8, 0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "44px",
                lineHeight: 0.9,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "var(--bone)",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

    </>
  );
}
