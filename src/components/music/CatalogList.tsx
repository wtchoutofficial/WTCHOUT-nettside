"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CatalogItem } from "@/types/music";

type Filter = "all" | "spotify" | "soundcloud";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "spotify", label: "Releases" },
  { id: "soundcloud", label: "SoundCloud" },
];

const TYPE_LABELS: Record<CatalogItem["type"], string> = {
  single: "Single",
  ep: "EP",
  album: "Album",
};

const platformIcons = {
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.282c.013.06.045.094.104.094.057 0 .09-.037.104-.094l.2-1.282-.2-1.332c-.014-.057-.047-.094-.104-.094m1.8-1.16c-.063 0-.105.043-.112.098l-.2 2.388.2 2.373c.007.06.049.104.112.104.063 0 .105-.044.112-.104l.222-2.373-.222-2.388c-.007-.055-.049-.098-.112-.098m.899-.454c-.069 0-.116.048-.121.107l-.178 2.842.178 2.793c.005.063.052.107.121.107.067 0 .116-.044.121-.107l.2-2.793-.2-2.842c-.005-.059-.054-.107-.121-.107m.898-.39c-.078 0-.126.054-.131.116l-.156 3.232.156 3.157c.005.066.053.12.131.12.076 0 .126-.054.131-.12l.175-3.157-.175-3.232c-.005-.062-.055-.116-.131-.116m.9-.264c-.083 0-.135.06-.137.127l-.134 3.496.134 3.387c.002.07.054.127.137.127.08 0 .135-.057.137-.127l.15-3.387-.15-3.496c-.002-.067-.057-.127-.137-.127m.898-.156c-.09 0-.142.065-.145.136l-.112 3.652.112 3.495c.003.075.055.14.145.14.088 0 .142-.065.145-.14l.126-3.495-.126-3.652c-.003-.071-.057-.136-.145-.136m1.8-.327c-.098 0-.152.073-.154.15l-.09 3.979.09 3.542c.002.082.056.15.154.15.096 0 .15-.068.154-.15l.1-3.542-.1-3.979c-.004-.077-.058-.15-.154-.15m.899-.18c-.104 0-.162.077-.163.158l-.068 4.159.068 3.57c.001.085.059.158.163.158.1 0 .16-.073.163-.158l.076-3.57-.076-4.159c-.003-.081-.063-.158-.163-.158m1.352-.24c-.035-.003-.07-.003-.104-.003-.103 0-.158.081-.163.165l-.063 4.399.068 3.58c.005.09.06.165.163.165.1 0 .158-.075.163-.165l.075-3.58-.075-4.399c-.005-.084-.063-.162-.164-.162m.898.024c-.112 0-.168.087-.168.173l-.044 4.202.049 3.563c.005.09.056.173.163.173.104 0 .163-.082.168-.173l.054-3.563-.054-4.202c-.005-.086-.063-.173-.168-.173m.899-.072c-.117 0-.177.09-.177.18l-.022 4.274.027 3.545c.005.094.06.18.172.18.11 0 .172-.086.177-.18l.032-3.545-.032-4.274c-.005-.09-.065-.18-.177-.18m2.252.483c-.22 0-.399.18-.399.399v7.39c0 .22.18.4.399.4h3.249c1.52 0 2.751-1.231 2.751-2.751 0-1.52-1.231-2.751-2.751-2.751-.374 0-.73.075-1.055.21-.262-1.553-1.613-2.737-3.239-2.737-.326 0-.647.046-.955.14m-1.348-.14c-.12 0-.18.093-.18.187v7.642c.005.097.064.187.18.187.114 0 .18-.09.18-.187V11.64c0-.094-.066-.187-.18-.187" />
    </svg>
  ),
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function matchesFilter(item: CatalogItem, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "spotify") return item.source !== "soundcloud";
  return item.source === "soundcloud" || item.source === "both";
}

export default function CatalogList({ items }: { items: CatalogItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = items.filter((item) => matchesFilter(item, filter));

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter catalog by platform"
        style={{ display: "flex", gap: "28px", marginBottom: "40px" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: filter === f.id ? "var(--neon-lime)" : "var(--bone-dim)",
              borderBottom:
                filter === f.id
                  ? "1px solid var(--neon-lime)"
                  : "1px solid transparent",
              paddingBottom: "6px",
              cursor: "pointer",
              transition: "color .3s, border-color .3s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(var(--bone-rgb),0.15)" }}>
        <AnimatePresence initial={false}>
          {visible.map((item, i) => {
            const primaryUrl = item.spotifyUrl ?? item.soundcloudUrl;
            const bothPlatforms = Boolean(item.spotifyUrl && item.soundcloudUrl);
            return (
              <motion.a
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="release-row"
                href={primaryUrl}
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
                    {item.coverImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.coverImage}
                        alt={`${item.title} cover`}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
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
                  {item.title}
                  {item.description && (
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
                      {item.description}
                    </span>
                  )}
                </div>
                <div
                  className="r-meta"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "12px",
                    color: "var(--bone-dim)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {TYPE_LABELS[item.type]}
                  {item.type !== "single" && ` · ${item.trackCount} tracks`}
                  <span style={{ display: "flex", gap: "10px" }}>
                    {item.spotifyUrl && platformIcons.spotify}
                    {(item.source === "soundcloud" || item.source === "both") &&
                      platformIcons.soundcloud}
                  </span>
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
                  {formatDate(item.releaseDate)}
                </div>
                <div
                  className="r-listen"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--neon-lime)",
                    textAlign: "right",
                  }}
                >
                  {item.durationMs ? formatDuration(item.durationMs) : ""}
                  {bothPlatforms ? (
                    // Row link goes to Spotify — give SoundCloud its own click target.
                    <span
                      role="link"
                      aria-label={`${item.title} on SoundCloud`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(item.soundcloudUrl, "_blank", "noopener");
                      }}
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      SC ↗︎
                    </span>
                  ) : (
                    <span>Listen ↗︎</span>
                  )}
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
              </motion.a>
            );
          })}
        </AnimatePresence>
        {!visible.length && (
          <p
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "13px",
              color: "var(--bone-dim)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "48px 8px",
            }}
          >
            — Nothing here yet
          </p>
        )}
      </div>
    </div>
  );
}
