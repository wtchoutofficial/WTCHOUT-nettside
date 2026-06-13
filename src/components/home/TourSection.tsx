type Side = "Dusk" | "Dawn";
type Row = {
  date: string;
  day: string;
  venue: string;
  city: string;
  side: Side;
  sold?: boolean;
};

const dates: Row[] = [];

export default function TourSection() {
  return (
    <section
      id="tour"
      style={{
        background: "var(--jungle-floor)",
        padding: "140px 24px 160px",
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
              — 04 / Live
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
              On the
              <br />
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                }}
              >
                road
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
            Selected dates only — every gig hand-picked for the right room.
          </p>
        </div>

        {dates.length === 0 ? (
          <div
            className="reveal"
            style={{
              borderTop: "1px solid rgba(245,240,232,0.15)",
              borderBottom: "1px solid rgba(245,240,232,0.15)",
              padding: "100px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--neon-lime)",
              }}
            >
              — No dates announced
            </span>
            <h3
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "clamp(40px, 6vw, 96px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "var(--bone)",
                margin: 0,
                maxWidth: "900px",
              }}
            >
              Between rooms.{" "}
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                }}
              >
                Book the next one.
              </em>
            </h3>
            <p
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontSize: "17px",
                lineHeight: 1.55,
                color: "var(--bone-dim)",
                maxWidth: "520px",
                margin: 0,
              }}
            >
              No gigs on the calendar right now — but if your room, festival or
              basement needs the right sound, that&apos;s the whole point.
            </p>
            <a
              href="#booking"
              style={{
                marginTop: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                background: "var(--neon-lime)",
                color: "var(--jungle-deep)",
                padding: "18px 32px",
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "22px",
                letterSpacing: 0,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Book the booth →︎
            </a>
          </div>
        ) : (
          <div style={{ borderTop: "1px solid rgba(245,240,232,0.15)" }}>
          {dates.map((r, i) => (
            <a
              key={`${r.date}-${r.venue}`}
              className={`tour-row reveal${r.sold ? " sold" : ""}`}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1.4fr 1fr 1fr 140px 32px",
                alignItems: "center",
                gap: "24px",
                padding: "32px 8px",
                borderBottom: "1px solid rgba(245,240,232,0.15)",
                opacity: r.sold ? 0.45 : 1,
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "32px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "var(--bone)",
                }}
              >
                {r.date}
                <small
                  style={{
                    display: "block",
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    color: "var(--bone-dim)",
                    marginTop: "4px",
                  }}
                >
                  {r.day}
                </small>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "28px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "var(--bone)",
                }}
              >
                {r.venue}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--bone-dim)",
                }}
              >
                {r.city}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    border:
                      r.side === "Dusk"
                        ? "1px solid var(--gold)"
                        : "1px solid var(--neon-lime)",
                    color: r.side === "Dusk" ? "var(--gold)" : "var(--neon-lime)",
                    marginRight: "6px",
                  }}
                >
                  {r.side}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textAlign: "right",
                  color: r.sold ? "var(--bone-dim)" : "var(--neon-lime)",
                  textDecoration: r.sold ? "line-through" : undefined,
                }}
              >
                {r.sold ? "Sold out" : "Tickets ↗︎"}
              </div>
              <div
                className="arrow"
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "28px",
                  textAlign: "right",
                  transform: "rotate(-45deg)",
                  transition: "transform .4s",
                  color: "var(--bone)",
                }}
              >
                {r.sold ? "×" : "↗︎"}
              </div>
            </a>
          ))}
        </div>
        )}
      </div>

      <style>{`
        @media (max-width: 800px) {
          .tour-row {
            grid-template-columns: 80px 1fr !important;
            gap: 16px !important;
            padding: 20px 4px !important;
          }
          .tour-row > *:nth-child(n+3) { display: none !important; }
        }
      `}</style>
    </section>
  );
}
