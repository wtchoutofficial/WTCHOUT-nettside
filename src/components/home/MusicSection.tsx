import { releases } from "@/data/releases";
import VinylDisc from "@/components/ui/VinylDisc";

const SIDES: Record<string, "Dawn" | "Dusk"> = {
  elsk: "Dawn",
  vetle: "Dusk",
  "right-here": "Dawn",
  mwaki: "Dusk",
  "that-feeling": "Dawn",
  "music-is-my-god": "Dusk",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default function MusicSection() {
  return (
    <section
      id="releases"
      style={{
        background: "var(--jungle-floor)",
        padding: "140px 24px 160px",
        position: "relative",
      }}
    >
      <div
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "80px",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "12px",
                color: "var(--neon-lime)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "16px",
                display: "block",
              }}
            >
              — 01 / Discography
            </span>
            <h2
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "clamp(56px, 9vw, 160px)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--bone)",
                margin: 0,
              }}
            >
              Released
              <br />
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                  letterSpacing: "-0.02em",
                }}
              >
                tracks
              </em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontStyle: "italic",
              fontSize: "20px",
              color: "var(--bone-dim)",
              maxWidth: "360px",
              lineHeight: 1.4,
            }}
          >
            Six singles, two wavelengths. Stream them on every platform that matters.
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(var(--bone-rgb),0.15)" }}>
          {releases.map((r, i) => {
            const side = SIDES[r.slug] ?? "Dawn";
            return (
              <a
                key={r.slug}
                className="release-row reveal"
                href={r.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 80px 1.4fr 1fr 100px 120px 32px",
                  alignItems: "center",
                  gap: "32px",
                  padding: "28px 8px",
                  borderBottom: "1px solid rgba(var(--bone-rgb),0.15)",
                  position: "relative",
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                <span
                  className="r-num"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "13px",
                    color: "var(--bone-dim)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="r-cover-cell" style={{ position: "relative" }}>
                  <VinylDisc />
                  <div
                    className="r-cover"
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "80px",
                      height: "80px",
                      background: "var(--jungle-deep)",
                      overflow: "hidden",
                      transition:
                        "transform .4s cubic-bezier(.7,0,.2,1), box-shadow .4s ease",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.coverImage}
                      alt={`${r.title} cover`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div
                  className="r-title"
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "clamp(28px, 3.5vw, 48px)",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: "var(--bone)",
                  }}
                >
                  {r.title}
                  {r.description && (
                    <span
                      className="r-feat"
                      style={{
                        fontFamily: "var(--font-instrument-serif), serif",
                        fontStyle: "italic",
                        fontSize: "0.5em",
                        color: "var(--bone-dim)",
                        textTransform: "lowercase",
                        marginLeft: "12px",
                        letterSpacing: 0,
                      }}
                    >
                      {r.description}
                    </span>
                  )}
                </div>
                <div
                  className="r-meta"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "12px",
                    color: "var(--bone-dim)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Single · {side}
                </div>
                <div
                  className="r-date"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "12px",
                    color: "var(--bone-dim)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {formatDate(r.releaseDate)}
                </div>
                <div
                  className="r-listen"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--neon-lime)",
                    textAlign: "right",
                  }}
                >
                  {"Listen ↗︎"}
                </div>
                <div
                  className="r-arrow"
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "28px",
                    color: "var(--bone)",
                    textAlign: "right",
                    transform: "rotate(-45deg)",
                    transition: "transform .4s",
                  }}
                >
                  {"↗︎"}
                </div>
              </a>
            );
          })}
        </div>
      </div>

    </section>
  );
}
