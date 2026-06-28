"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  // Standalone link-in-bio page renders its own chrome.
  if (usePathname() === "/links") return null;

  return (
    <footer
      style={{
        background: "var(--jungle-deep)",
        padding: "120px 24px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="footer-mega" data-text="WTCHOUT">
          WTCHOUT
        </div>

        <div className="footer-grid">
          <div>
            <h5
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--neon-lime)",
                marginBottom: "18px",
              }}
            >
              — Listen
            </h5>
            <ul style={listStyle}>
              <FooterLink href="https://open.spotify.com/artist/6DeWCj9W2OMshT5sdCJnqa">
                Spotify ↗︎
              </FooterLink>
              <FooterLink href="https://music.apple.com/no/artist/wtchout/1474091682">
                Apple Music ↗︎
              </FooterLink>
              <FooterLink href="https://soundcloud.com/wtchoutmusic">SoundCloud ↗︎</FooterLink>
              <FooterLink href="https://www.beatport.com/artist/wtchout/819182">Beatport ↗︎</FooterLink>
            </ul>
          </div>
          <div>
            <h5 style={h5Style}>— Follow</h5>
            <ul style={listStyle}>
              <FooterLink href="https://www.instagram.com/wtchout.no">Instagram ↗︎</FooterLink>
              <FooterLink href="https://www.facebook.com/wtchoutmusic">Facebook ↗︎</FooterLink>
              <FooterLink href="https://www.tiktok.com/@wtchout">TikTok ↗︎</FooterLink>
              <FooterLink href="https://www.youtube.com/@wtchoutmusic">YouTube ↗︎</FooterLink>
            </ul>
          </div>
          <div>
            <h5 style={h5Style}>— Direct</h5>
            <ul style={listStyle}>
              <FooterLink href="mailto:wtchoutmusic@gmail.com">
                wtchoutmusic@gmail.com
              </FooterLink>
              <li
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontSize: "14px",
                  color: "var(--bone-dim)",
                  lineHeight: 1.6,
                }}
              >
                For booking, please use
                <br />
                the form on this page.
              </li>
            </ul>
          </div>
          <div>
            <h5 style={h5Style}>— Location</h5>
            <p
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontSize: "14px",
                color: "var(--bone-dim)",
                lineHeight: 1.6,
              }}
            >
              Hustadvika, Norway
              <br />
              62.9°N · 7.2°E
              <br />
              <br />
              Available worldwide
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(var(--bone-rgb),0.15)",
            paddingTop: "32px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--bone-dim)",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span>© 2026 WTCHOUT — All rights reserved.</span>
          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--neon-lime)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  gap: "2px",
                  alignItems: "flex-end",
                  height: "12px",
                }}
              >
                {[8, 12, 6, 10].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: "2px",
                      height: `${h}px`,
                      background: "var(--neon-lime)",
                      animation: `wtc-eq 1s ease-in-out ${i * 0.15}s infinite`,
                      display: "inline-block",
                    }}
                  />
                ))}
              </span>
              Now playing — ELSK
            </span>
            <span>Music. Culture. Vibes.</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          border-top: 1px solid rgba(var(--bone-rgb),0.15);
          padding-top: 40px;
          margin-bottom: 80px;
        }
        @media (min-width: 800px) {
          .footer-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </footer>
  );
}

const h5Style: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains), monospace",
  fontSize: "11px",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "var(--neon-lime)",
  marginBottom: "18px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: "16px",
          color: "var(--bone)",
          transition: "color .25s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neon-lime)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--bone)")}
      >
        {children}
      </a>
    </li>
  );
}
