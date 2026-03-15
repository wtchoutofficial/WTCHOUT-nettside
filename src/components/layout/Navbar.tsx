"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          backgroundColor: scrolled
            ? "rgba(26, 20, 16, 0.9)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          {isHome ? (
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-bold tracking-widest text-lg transition-colors duration-300"
              style={{ color: "#f5efe6" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ff6b2c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#f5efe6";
              }}
            >
              <Image
                src="/images/branding/w-logo.png"
                alt="WTCHOUT logo"
                width={28}
                height={28}
                className="inline-block mr-2"
              />
              WTCHOUT
            </a>
          ) : (
            <Link
              href="/"
              className="font-bold tracking-widest text-lg transition-colors duration-300"
              style={{ color: "#f5efe6" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ff6b2c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#f5efe6";
              }}
            >
              <Image
                src="/images/branding/w-logo.png"
                alt="WTCHOUT logo"
                width={28}
                height={28}
                className="inline-block mr-2"
              />
              WTCHOUT
            </Link>
          )}

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-colors duration-300"
            style={{
              color: "#f5efe6",
              border: "1px solid rgba(245, 239, 230, 0.3)",
              borderRadius: "4px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ff6b2c";
              e.currentTarget.style.color = "#ff6b2c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245, 239, 230, 0.3)";
              e.currentTarget.style.color = "#f5efe6";
            }}
            aria-label="Open menu"
          >
            Menu
          </button>
        </nav>
      </motion.header>

      {/* Fullscreen menu overlay */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
