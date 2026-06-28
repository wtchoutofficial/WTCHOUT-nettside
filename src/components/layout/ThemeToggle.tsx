"use client";

import { useState } from "react";

type Theme = "dark" | "light";

// Hybrid light/dark toggle. The actual attribute is set pre-paint by an inline
// script in the layout <head> (no flash); this just reflects + flips it.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme === "light"
      ? "light"
      : "dark",
  );

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("wtchout-theme", next);
    } catch {
      /* private mode — just won't persist */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      suppressHydrationWarning
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "34px",
        height: "34px",
        background: "transparent",
        border: "1px solid var(--nav-ink-dim, rgba(var(--bone-rgb), 0.3))",
        borderRadius: 0,
        color: "var(--nav-ink, var(--bone))",
        fontSize: "14px",
        lineHeight: 1,
        cursor: "none",
      }}
    >
      {/* Show the icon of the mode you'll switch TO. */}
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
