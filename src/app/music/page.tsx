import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import CatalogList from "@/components/music/CatalogList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Music",
  description:
    "The full WTCHOUT catalog — singles, EPs, remixes and bootlegs on Spotify and SoundCloud.",
  alternates: { canonical: "/music" },
  openGraph: {
    title: "Music | WTCHOUT",
    description:
      "The full WTCHOUT catalog — singles, EPs, remixes and bootlegs on Spotify and SoundCloud.",
  },
};

const DEGRADED_NOTICE: Record<string, string> = {
  spotify: "— live Spotify data unavailable · showing SoundCloud only",
  soundcloud: "— live SoundCloud data unavailable · showing releases only",
  all: "— live data unavailable · showing cached releases",
};

export default async function MusicPage() {
  const { items, degraded } = await getCatalog();

  return (
    <section
      style={{
        background: "var(--jungle-deep)",
        padding: "180px 24px 160px",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "64px",
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
              — Full catalog
            </span>
            <h1
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
              Every
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
                track
              </em>
            </h1>
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
            Releases, remixes and bootlegs — pulled live from Spotify and
            SoundCloud.
          </p>
        </div>

        {degraded !== "none" && (
          <p
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              color: "var(--bone-dim)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            {DEGRADED_NOTICE[degraded]}
          </p>
        )}

        <div className="reveal" style={{ transitionDelay: "0.1s" }}>
          <CatalogList items={items} />
        </div>
      </div>
    </section>
  );
}
