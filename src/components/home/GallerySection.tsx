const tiles: { src: string; cap: string }[] = [
  { src: "/images/gallery/moments-7.jpg", cap: "Moldejazz live" },
  { src: "/images/gallery/moments-4.jpg", cap: "Amsterdam · 2024" },
  { src: "/images/gallery/moments-2.jpg", cap: "Kayak · Hustadvika" },
  { src: "/images/gallery/moments-1.jpg", cap: "Fanboy" },
  { src: "/images/gallery/moments-10.jpg", cap: "Studio session" },
  { src: "/images/gallery/deck-mono.jpg", cap: "On the decks" },
];

export default function GallerySection() {
  return (
    <section
      id="gallery"
      style={{
        background: "var(--jungle-deep)",
        padding: "140px 0 160px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
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
              — 03 / Moments
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
              Not genres,
              <br />
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                }}
              >
                feelings.
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
            Studio sessions, sunset hikes, sweaty rooms. The life around the music.
          </p>
        </div>

        <div className="gallery-grid reveal">
          {tiles.map((t, i) => (
            <figure key={t.src} className="g-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt={t.cap} loading="lazy" />
              <figcaption className="g-cap">
                <span className="g-cap-num">
                  {String(i + 1).padStart(2, "0")} /
                </span>
                <span>{t.cap}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .g-tile {
          position: relative;
          overflow: hidden;
          background: var(--jungle-floor);
          aspect-ratio: 4 / 5;
          margin: 0;
        }
        .g-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .g-cap {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 32px 20px 18px;
          background: linear-gradient(180deg, transparent 0%, rgba(5,13,8,0.85) 70%);
          font-family: var(--font-jetbrains), monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--bone);
          display: flex;
          gap: 10px;
          align-items: center;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity .35s cubic-bezier(.7,0,.2,1), transform .35s cubic-bezier(.7,0,.2,1);
          pointer-events: none;
        }
        .g-cap-num { color: var(--neon-lime); }
        .g-tile:hover .g-cap {
          opacity: 1;
          transform: translateY(0);
        }
        @media (min-width: 700px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (min-width: 1000px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
}
