export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: "var(--jungle-floor)",
        padding: "140px 24px 160px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="reveal about-intro" style={{ marginBottom: "120px" }}>
          <div className="about-editorial">
            <h2
              className="about-title"
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "clamp(48px, 7vw, 120px)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--bone)",
                margin: 0,
              }}
            >
              The artist{" "}
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                }}
              >
                behind
              </em>
              <br />
              the sound
            </h2>

            <div className="about-bio">
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--neon-lime)",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "1px",
                    background: "var(--neon-lime)",
                    display: "inline-block",
                  }}
                />
                — Bio / Hustadvika, NO
              </div>
              <p
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontSize: "18px",
                  lineHeight: 1.6,
                  color: "var(--bone-dim)",
                  marginBottom: "24px",
                }}
              >
                WTCHOUT is{" "}
                <strong style={{ color: "var(--bone)", fontWeight: 600 }}>
                  Oscar André Naas
                </strong>
                , a producer and DJ from Hustadvika on the west coast of Norway.
                Self-taught since 15, he builds house and rave tracks made for the
                floor — bouncy, raw, and built around big club drops. After early
                releases climbed past a few million streams, he&apos;s locked into one
                thing: dark, high-energy dance music with a foot in both UK house and
                rave.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontSize: "18px",
                  lineHeight: 1.6,
                  color: "var(--bone-dim)",
                }}
              >
                WTCHOUT runs on two moods.{" "}
                <strong style={{ color: "var(--bone)", fontWeight: 600 }}>DUSK</strong>{" "}
                is the warm end — groovy, sun-soaked club tracks, rolling basslines,
                golden hour on the floor.{" "}
                <strong style={{ color: "var(--bone)", fontWeight: 600 }}>DAWN</strong>{" "}
                is the dark end — raw, late-night rave energy, UK-leaning drums, deep
                frequencies. Two moods, one world.
              </p>
            </div>

            <figure
              className="about-portrait"
              style={{
                position: "relative",
                margin: 0,
                width: "100%",
                maxWidth: "560px",
                aspectRatio: "4/5",
                overflow: "hidden",
                justifySelf: "end",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/portrait.jpg"
                alt="WTCHOUT — Oscar André Naas"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "saturate(0.95) contrast(1.05)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--neon-lime)",
                  background: "rgba(var(--deep-rgb),0.55)",
                  padding: "6px 10px",
                  backdropFilter: "blur(6px)",
                }}
              >
                — Portrait / 001
              </span>
              <figcaption
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "20px 20px 18px",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(var(--deep-rgb),0.85) 70%)",
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--bone)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <span>Oscar André Naas</span>
                <span style={{ color: "var(--bone-dim)" }}>62.9°N · 7.2°E</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div
          className="reveal"
          style={{
            borderTop: "1px solid rgba(var(--bone-rgb),0.15)",
            borderBottom: "1px solid rgba(var(--bone-rgb),0.15)",
            padding: "60px 0",
            textAlign: "center",
            marginBottom: "120px",
          }}
        >
          <q
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontStyle: "italic",
              fontSize: "clamp(28px, 4vw, 56px)",
              color: "var(--bone)",
              lineHeight: 1.15,
            }}
          >
            I don&apos;t chase every gig — only the ones that feel right.
          </q>
          <div
            style={{
              marginTop: "24px",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--bone-dim)",
            }}
          >
            — WTCHOUT
          </div>
        </div>

        <div
          className="reveal stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            marginBottom: "120px",
          }}
        >
          {[
            { v: "'19", em: "—", l: "Established" },
            { v: "15", em: "yo", l: "Producing since" },
            { v: "2", em: "×", l: "Sides — Dusk & Dawn" },
            { v: "62.9", em: "°N", l: "Hustadvika, Norway" },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                borderLeft: "1px solid rgba(var(--bone-rgb),0.15)",
                padding: "12px 0 12px 24px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "clamp(40px, 5vw, 80px)",
                  lineHeight: 0.95,
                  color: "var(--bone)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
                <em
                  style={{
                    fontFamily: "var(--font-instrument-serif), serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "var(--neon-lime)",
                  }}
                >
                  {s.em}
                </em>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--bone-dim)",
                  marginTop: "8px",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal two-sides"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 0,
            border: "1px solid rgba(var(--bone-rgb),0.15)",
          }}
        >
          <SidePanel kind="dusk" />
          <SidePanel kind="dawn" />
        </div>
      </div>

      <style>{`
        .about-editorial {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .about-title { order: 1; }
        .about-bio { order: 2; }
        .about-portrait { order: 3; }
        @media (min-width: 800px) {
          .about-editorial {
            display: grid;
            flex-direction: initial;
            grid-template-columns: 1fr 0.9fr;
            grid-template-areas:
              "title    portrait"
              "bio      portrait";
            grid-template-rows: auto 1fr;
            row-gap: 64px;
            column-gap: 80px;
            align-items: start;
          }
          .about-title { grid-area: title; order: initial; }
          .about-bio { grid-area: bio; order: initial; }
          .about-portrait { grid-area: portrait; order: initial; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .two-sides { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 700px) {
          .about-intro { margin-bottom: 60px !important; }
          .about-quote { margin-bottom: 60px !important; padding: 36px 0 !important; }
          .stats-grid {
            margin-bottom: 60px !important;
            gap: 12px !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .about-editorial { gap: 28px !important; }
          .about-title { font-size: clamp(40px, 12vw, 72px) !important; }
          .about-bio p { font-size: 16px !important; line-height: 1.5 !important; }
          .about-portrait { max-width: 100% !important; justify-self: stretch !important; }
          .side-dusk, .side-dawn { padding: 36px 22px !important; min-height: 340px !important; }
          .side-dusk h3, .side-dawn h3 { font-size: clamp(64px, 18vw, 100px) !important; margin-bottom: 18px !important; }
          .side-dusk p, .side-dawn p { font-size: 15px !important; margin-bottom: 22px !important; }
        }
      `}</style>
    </section>
  );
}

function SidePanel({ kind }: { kind: "dusk" | "dawn" }) {
  const cfg = {
    dusk: {
      tag: "— The warm side",
      title: "Dusk",
      copy:
        "Sunsets, golden tones and groovy rhythms. Dusk is the sound of late summer evenings — house, disco and melodies that make you stay a little longer.",
      genres: ["House", "Disco", "Afro", "Minimal", "Rally House"],
      titleColor: "var(--gold)",
      borderRight: true,
      // Image is mirrored via scaleX(-1). To show parrot (originally on right of image),
      // anchor object-position to RIGHT — after flip it appears at left of panel.
      objectPosition: "right center",
      flip: true,
      overlay:
        "linear-gradient(160deg, rgba(42,20,8,0.35) 0%, rgba(26,10,5,0.72) 65%, rgba(15,6,3,0.92) 100%)",
      // Mirror of dawn's fade — black out the tiger/owl bleed on the right side
      sideFade:
        "linear-gradient(to left, #1a0a05 0%, #1a0a05 35%, rgba(26,10,5,0.7) 60%, transparent 90%)",
    },
    dawn: {
      tag: "— The dark side",
      title: "Dawn",
      copy:
        "When the lights go out and the bass takes over. Dawn is the raw and unknown — underground techno, deep frequencies and nights that never end.",
      genres: ["Hard House", "UK Garage", "Techno", "Hard Techno", "D&B"],
      titleColor: "var(--neon-lime)",
      borderRight: false,
      // Mirrored back; owl/tiger eye sits on the right of the panel.
      objectPosition: "left center",
      flip: true,
      overlay:
        "linear-gradient(160deg, rgba(10,26,15,0.5) 0%, rgba(var(--deep-rgb),0.82) 65%, rgba(2,6,3,0.95) 100%)",
      // Extra fade: black out the parrot bleed on the left side of the dawn panel.
      sideFade:
        "linear-gradient(to right, var(--jungle-deep) 0%, var(--jungle-deep) 35%, rgba(var(--deep-rgb),0.7) 60%, transparent 90%)",
    },
  }[kind];

  return (
    <div
      className={`side-${kind}`}
      data-theme="dark"
      style={{
        padding: "60px 32px",
        position: "relative",
        overflow: "hidden",
        minHeight: "520px",
        background: "var(--jungle-deep)",
        borderRight: cfg.borderRight ? "1px solid rgba(var(--bone-rgb),0.1)" : undefined,
      }}
    >
      {/* Mirrored image — parrot on dusk side, tiger eye on dawn side */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/upcoming/dusk-to-dawn.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: cfg.objectPosition,
          transform: cfg.flip ? "scaleX(-1)" : undefined,
          pointerEvents: "none",
        }}
      />
      {/* Side fade — masks out bleed from the other half */}
      {cfg.sideFade && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: cfg.sideFade,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Gradient overlay for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: cfg.overlay,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--bone-dim)",
          marginBottom: "16px",
        }}
      >
        {cfg.tag}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-anton), sans-serif",
          fontSize: "clamp(80px, 10vw, 160px)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          marginBottom: "24px",
          color: cfg.titleColor,
        }}
      >
        {cfg.title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: "17px",
          lineHeight: 1.55,
          color: "var(--bone-dim)",
          marginBottom: "32px",
          maxWidth: "420px",
        }}
      >
        {cfg.copy}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {cfg.genres.map((g) => (
          <span
            key={g}
            className="genre-pill"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "8px 14px",
              border: "1px solid rgba(var(--bone-rgb),0.25)",
              color: "var(--bone)",
              transition: "all .25s",
            }}
          >
            {g}
          </span>
        ))}
      </div>
      </div>
    </div>
  );
}
