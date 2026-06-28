"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type NavLink = {
  href: string;
  id: string;
  label: string;
  /** True for real routes (rendered with next/link); others are in-page hashes. */
  route?: boolean;
};

const links: NavLink[] = [
  { href: "#releases", id: "releases", label: "Releases" },
  { href: "#coming", id: "coming", label: "Coming" },
  { href: "#about", id: "about", label: "About" },
  { href: "#gallery", id: "gallery", label: "Gallery" },
  { href: "#tour", id: "tour", label: "Live" },
  { href: "#booking", id: "booking", label: "Booking" },
  { href: "/links", id: "links", label: "Links", route: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("hero");
  // The nav floats over the dark hero at the top and over (possibly light)
  // content below — track which so its ink can adapt without a blend mode.
  const [overDark, setOverDark] = useState(true);

  useEffect(() => {
    const ids = ["hero", ...links.map((l) => l.id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const heroEl = document.getElementById("hero");

    const compute = () => {
      setOverDark(
        !heroEl || window.scrollY < heroEl.offsetHeight - 72,
      );
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

  // Keep the URL clean (no #hash). On load, honour a deep-link hash by scrolling
  // to it, then strip it so the address bar reads just "/". The active section
  // is shown by the nav highlight instead of the URL.
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    requestAnimationFrame(() => {
      el?.scrollIntoView({ block: "start" });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    });
  }, []);

  // Smooth-scroll in-page nav links without writing a #hash to the URL.
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Standalone link-in-bio page renders its own chrome.
  if (pathname === "/links") return null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 md:px-8"
        style={
          {
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--nav-ink)",
            "--nav-ink": overDark ? "#f5f0e8" : "var(--bone)",
            "--nav-ink-dim": overDark
              ? "rgba(245,240,232,0.55)"
              : "rgba(var(--bone-dim-rgb),0.55)",
          } as React.CSSProperties
        }
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold"
          onClick={(e) => {
            // Already on home → smooth-scroll to top instead of a no-op nav.
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "26px",
              height: "26px",
              background: "var(--nav-ink)",
              WebkitMaskImage: "url(/images/branding/w-logo.png)",
              maskImage: "url(/images/branding/w-logo.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <span style={{ fontSize: "19px", fontWeight: 800, letterSpacing: "0.03em" }}>
            WTCHOUT
          </span>
        </Link>

        <div className="hidden lg:flex gap-7">
          {links.map((l) =>
            l.route ? (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollToSection(e, l.id)}
                className={`nav-link${activeId === l.id ? " is-active" : ""}`}
              >
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-2">
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

          <ThemeToggle />

          <button
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              color: "var(--nav-ink)",
              padding: "8px 12px",
              border: "1px solid var(--nav-ink-dim)",
              borderRadius: 0,
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              minHeight: "40px",
            }}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-[99] lg:hidden flex flex-col items-start justify-center gap-5 px-12"
          style={{
            background: "rgba(var(--deep-rgb), 0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {links.map((l) => {
            const mobileStyle = {
              fontFamily: "var(--font-anton), sans-serif",
              fontSize: "clamp(36px, 12vw, 54px)",
              lineHeight: 0.95,
              textTransform: "uppercase" as const,
              letterSpacing: "-0.02em",
              color: "var(--bone)",
            };
            return l.route ? (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={mobileStyle}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  scrollToSection(e, l.id);
                  setOpen(false);
                }}
                style={mobileStyle}
              >
                {l.label}
              </a>
            );
          })}
        </div>
      )}

    </>
  );
}
