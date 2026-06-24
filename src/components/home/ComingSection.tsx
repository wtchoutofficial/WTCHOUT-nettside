import Soundwaves from "./Soundwaves";

const cards = [
  {
    n: "001",
    title: "ID",
    em: "—",
  },
];

export default function ComingSection() {
  return (
    <section
      id="coming"
      style={{
        padding: "140px 24px 180px",
        background: "var(--jungle-deep)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "60px",
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
              — 02 / On the way
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
              Coming
              <br />
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                }}
              >
                soon
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
            One drop loaded for 26.
          </p>
        </div>

        <div className="coming-feature">
          {cards.map((c, i) => (
            <div
              key={c.n}
              className="coming-card reveal"
              style={{
                aspectRatio: "3/4",
                position: "relative",
                overflow: "hidden",
                background: "var(--jungle-deep)",
                border: "1px solid rgba(245,240,232,0.1)",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <Soundwaves />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(5,13,8,0.72) 0%, rgba(5,13,8,0.15) 30%, rgba(5,13,8,0) 62%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--bone-dim)",
                      lineHeight: 1.8,
                    }}
                  >
                    — UPCOMING / {c.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-anton), sans-serif",
                      fontSize: "56px",
                      lineHeight: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "-0.03em",
                      color: "var(--bone)",
                      marginTop: "16px",
                    }}
                  >
                    {c.title}{" "}
                    <em
                      style={{
                        fontFamily: "var(--font-instrument-serif), serif",
                        fontStyle: "italic",
                        fontWeight: 300,
                        color: "var(--neon-lime)",
                      }}
                    >
                      {c.em}
                    </em>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Teaser beside the single drop so the row stays balanced. */}
          <div className="coming-detail reveal">
            <p
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(28px, 3.4vw, 46px)",
                lineHeight: 1.15,
                color: "var(--bone)",
                margin: 0,
              }}
            >
              One track, fully formed —{" "}
              <span style={{ color: "var(--neon-lime)" }}>
                waiting on the right night to land.
              </span>
            </p>
            <div
              style={{
                marginTop: "28px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(245,240,232,0.15)",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--bone-dim)",
              }}
            >
              — Stay close. It drops when it&apos;s ready.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .coming-feature {
          display: grid;
          grid-template-columns: minmax(0, 400px) 1fr;
          gap: 64px;
          align-items: center;
          margin-top: 60px;
        }
        @media (max-width: 760px) {
          .coming-feature {
            grid-template-columns: 1fr;
            gap: 36px;
            justify-items: center;
          }
          .coming-feature .coming-card { width: 100%; max-width: 340px; }
          .coming-detail { text-align: center; }
        }
      `}</style>
    </section>
  );
}
