const cards = [
  {
    n: "001",
    title: "ID",
    em: "—",
    sub: "1",
    when: "EST. ?",
    meta: "DAWN · TECHNO",
    blob: "var(--neon-lime)",
    blobPos: { top: "-40px", right: "-40px" },
  },
  {
    n: "002",
    title: "ID",
    em: "—",
    sub: "2",
    when: "EST. ?",
    meta: "DUSK · HOUSE",
    blob: "var(--clay)",
    blobPos: { bottom: "-40px", left: "-40px" },
  },
  {
    n: "003",
    title: "ID",
    em: "—",
    sub: "3",
    when: "EST. ?",
    meta: "DAWN · TECHNO",
    blob: "var(--gold)",
    blobPos: { top: "30%", left: "50%" },
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
            Three drops loaded for 26.
          </p>
        </div>

        <div
          className="coming-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "32px",
            marginTop: "60px",
          }}
        >
          {cards.map((c, i) => (
            <div
              key={c.n}
              className="coming-card reveal"
              style={{
                aspectRatio: "3/4",
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(160deg, var(--jungle-mid), var(--jungle-deep))",
                border: "1px solid rgba(245,240,232,0.1)",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url(/images/upcoming/dusk-to-dawn.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "saturate(0.95) contrast(1.05)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(5,13,8,0.35) 0%, rgba(5,13,8,0.55) 55%, rgba(5,13,8,0.92) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  filter: "blur(60px)",
                  opacity: 0.25,
                  background: c.blob,
                  animation: `wtc-blob 12s ease-in-out ${-i * 3}s infinite`,
                  mixBlendMode: "screen",
                  ...c.blobPos,
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
                    <br />
                    {c.sub}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: "var(--neon-lime)",
                      fontSize: "13px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {c.when}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--bone-dim)",
                      lineHeight: 1.8,
                      marginTop: "8px",
                    }}
                  >
                    {c.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
