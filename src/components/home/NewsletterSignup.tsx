"use client";

import { useEffect, useRef, useState } from "react";

const SHARE_URL = "https://wtchoutmusic.com/#coming";
const SHARE_TEXT =
  "WTCHOUT has an unreleased one loading 👀 — get on the list before it drops:";
const STORY_VIDEO = "/share/do-it-story.mp4";
const X_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  SHARE_TEXT,
)}&url=${encodeURIComponent(SHARE_URL)}`;

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    try {
      const probe = new File([], "p.mp4", { type: "video/mp4" });
      setCanShareFiles(
        typeof navigator !== "undefined" &&
          !!navigator.canShare &&
          navigator.canShare({ files: [probe] }),
      );
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  // Hand the branded story video to the OS share sheet (Instagram → Story on
  // mobile); fall back to a direct download where file-sharing isn't supported.
  const shareStory = async () => {
    try {
      const res = await fetch(STORY_VIDEO);
      const blob = await res.blob();
      const file = new File([blob], "wtchout-do-it.mp4", { type: "video/mp4" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "WTCHOUT — DO IT",
          text: SHARE_TEXT,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wtchout-do-it.mp4";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      /* user cancelled or fetch failed */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || email.trim().length < 5) {
      setStatus("error");
      setError("Enter a valid email.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          website: honeypot,
          formStartedAt: startedAt.current,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message || "Could not subscribe.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains), monospace",
    fontSize: "11px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "var(--bone-dim)",
  };

  const shareBtnStyle: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains), monospace",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--neon-lime)",
    background: "transparent",
    border: "1px solid rgba(239,125,56,0.4)",
    padding: "10px 16px",
    cursor: "none",
    textDecoration: "none",
    display: "inline-block",
  };

  if (status === "success") {
    return (
      <div className="nl" style={{ marginTop: "36px" }}>
        <div
          style={{
            fontFamily: "var(--font-anton), sans-serif",
            fontSize: "30px",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--neon-lime)",
            lineHeight: 1,
          }}
        >
          You&apos;re on the list.
        </div>
        <p
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontSize: "15px",
            color: "var(--bone-dim)",
            lineHeight: 1.5,
            margin: "12px 0 22px",
            maxWidth: "420px",
          }}
        >
          You&apos;ll know the second it drops. Pull someone in with you —
          drop the teaser on your story.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <button
            type="button"
            onClick={shareStory}
            style={{
              ...shareBtnStyle,
              background: "var(--neon-lime)",
              color: "var(--on-accent)",
              borderColor: "var(--neon-lime)",
            }}
          >
            {canShareFiles ? "↗ Share to story" : "↓ Save story video"}
          </button>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" style={shareBtnStyle}>
            Post on X
          </a>
          <button type="button" onClick={copyLink} style={shareBtnStyle}>
            {copied ? "✓ Copied" : "Copy link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="nl" onSubmit={submit} noValidate style={{ marginTop: "36px" }}>
      <style>{`
        .nl input.nl-email {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(var(--bone-rgb),0.25);
          color: var(--bone);
          font-family: var(--font-bricolage), sans-serif;
          font-size: 18px;
          padding: 10px 0;
          outline: none;
          transition: border-color .25s;
        }
        .nl input.nl-email::placeholder {
          color: rgba(var(--bone-dim-rgb),0.4);
          font-family: var(--font-instrument-serif), serif;
          font-style: italic;
        }
        .nl input.nl-email:focus { border-bottom-color: var(--neon-lime); }
        .nl button.nl-join {
          background: var(--neon-lime);
          color: var(--on-accent);
          border: 0;
          font-family: var(--font-anton), sans-serif;
          font-size: 18px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          padding: 12px 26px;
          cursor: none;
          white-space: nowrap;
          opacity: 1;
          transition: opacity .2s;
        }
        .nl button.nl-join:disabled { opacity: 0.6; }
      `}</style>

      <div style={labelStyle}>— Get notified when it drops</div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label htmlFor="nl-website">Website</label>
        <input
          id="nl-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "flex-end",
          marginTop: "14px",
          flexWrap: "wrap",
        }}
      >
        <input
          className="nl-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: "1 1 220px" }}
        />
        <button type="submit" className="nl-join" disabled={status === "loading"}>
          {status === "loading" ? "…" : "Join"}
        </button>
      </div>

      {status === "error" && (
        <div
          style={{
            marginTop: "12px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--clay)",
          }}
        >
          {error}
        </div>
      )}
    </form>
  );
}
