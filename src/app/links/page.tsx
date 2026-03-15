"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { releases } from "@/data/releases";
import { linkGroups } from "@/data/socials";

const platformIcons: Record<string, React.ReactNode> = {
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.335-2.22-1.178-.26-.52-.246-1.088.03-1.606.34-.637.94-.972 1.66-1.085.334-.052.67-.098 1.006-.144.378-.052.603-.244.674-.623.005-.026.013-.05.013-.076V9.2a.658.658 0 00-.028-.18c-.05-.18-.175-.28-.36-.26-.14.012-.278.04-.416.068l-4.89.96c-.027.006-.054.013-.08.02-.27.07-.385.2-.41.48-.005.063-.003.126-.003.19v7.594c0 .407-.052.81-.23 1.182-.283.59-.757.97-1.39 1.15-.347.1-.702.152-1.062.172-.957.046-1.81-.32-2.235-1.17-.263-.522-.25-1.09.025-1.612.337-.64.945-.977 1.665-1.09.33-.05.66-.097.992-.14.39-.054.618-.25.688-.64.005-.02.01-.04.01-.06V7.63c0-.32.078-.6.33-.82.186-.16.404-.252.64-.304.17-.038.34-.074.51-.11l5.21-1.023c.354-.07.71-.136 1.065-.198.26-.046.39.04.425.306.005.04.007.08.007.12v4.51z" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.282c.013.06.045.094.104.094.057 0 .09-.037.104-.094l.2-1.282-.2-1.332c-.014-.057-.047-.094-.104-.094m1.8-1.16c-.063 0-.105.043-.112.098l-.2 2.388.2 2.373c.007.06.049.104.112.104.063 0 .105-.044.112-.104l.222-2.373-.222-2.388c-.007-.055-.049-.098-.112-.098m.899-.454c-.069 0-.116.048-.121.107l-.178 2.842.178 2.793c.005.063.052.107.121.107.067 0 .116-.044.121-.107l.2-2.793-.2-2.842c-.005-.059-.054-.107-.121-.107m.898-.39c-.078 0-.126.054-.131.116l-.156 3.232.156 3.157c.005.066.053.12.131.12.076 0 .126-.054.131-.12l.175-3.157-.175-3.232c-.005-.062-.055-.116-.131-.116m.9-.264c-.083 0-.135.06-.137.127l-.134 3.496.134 3.387c.002.07.054.127.137.127.08 0 .135-.057.137-.127l.15-3.387-.15-3.496c-.002-.067-.057-.127-.137-.127m.898-.156c-.09 0-.142.065-.145.136l-.112 3.652.112 3.495c.003.075.055.14.145.14.088 0 .142-.065.145-.14l.126-3.495-.126-3.652c-.003-.071-.057-.136-.145-.136m1.8-.327c-.098 0-.152.073-.154.15l-.09 3.979.09 3.542c.002.082.056.15.154.15.096 0 .15-.068.154-.15l.1-3.542-.1-3.979c-.004-.077-.058-.15-.154-.15m.899-.18c-.104 0-.162.077-.163.158l-.068 4.159.068 3.57c.001.085.059.158.163.158.1 0 .16-.073.163-.158l.076-3.57-.076-4.159c-.003-.081-.063-.158-.163-.158m1.352-.24c-.035-.003-.07-.003-.104-.003-.103 0-.158.081-.163.165l-.063 4.399.068 3.58c.005.09.06.165.163.165.1 0 .158-.075.163-.165l.075-3.58-.075-4.399c-.005-.084-.063-.162-.164-.162m.898.024c-.112 0-.168.087-.168.173l-.044 4.202.049 3.563c.005.09.056.173.163.173.104 0 .163-.082.168-.173l.054-3.563-.054-4.202c-.005-.086-.063-.173-.168-.173m.899-.072c-.117 0-.177.09-.177.18l-.022 4.274.027 3.545c.005.094.06.18.172.18.11 0 .172-.086.177-.18l.032-3.545-.032-4.274c-.005-.09-.065-.18-.177-.18m2.252.483c-.22 0-.399.18-.399.399v7.39c0 .22.18.4.399.4h3.249c1.52 0 2.751-1.231 2.751-2.751 0-1.52-1.231-2.751-2.751-2.751-.374 0-.73.075-1.055.21-.262-1.553-1.613-2.737-3.239-2.737-.326 0-.647.046-.955.14m-1.348-.14c-.12 0-.18.093-.18.187v7.642c.005.097.064.187.18.187.114 0 .18-.09.18-.187V11.64c0-.094-.066-.187-.18-.187" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  tidal: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l4.004-4.004L12.012 3.992zM12.012 12l-4.004 4.004L12.012 20.008l4.004-4.004L12.012 12zM20.02 3.992l-4.004 4.004L20.02 12l4.004-4.004-4.004-4.004z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

const latestRelease = releases.find((r) => r.featured);

const streamingPlatforms = [
  { name: "Spotify", key: "spotifyUrl" as const, icon: "spotify" },
  { name: "Apple Music", key: "appleMusicUrl" as const, icon: "apple" },
  { name: "YouTube Music", key: "youtubeMusicUrl" as const, icon: "youtube" },
  { name: "Tidal", key: "tidalUrl" as const, icon: "tidal" },
];

export default function LinksPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center px-4 pb-20 pt-28"
      style={{ backgroundColor: "#1a1410" }}
    >
      {/* Header */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/"
          className="text-4xl font-bold tracking-widest transition-colors duration-300"
          style={{ color: "#f5efe6" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b2c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#f5efe6")}
        >
          WTCHOUT
        </Link>
        <p
          className="mt-2 text-sm tracking-wide"
          style={{ color: "#b8a690" }}
        >
          DJ / Producer from Norway
        </p>
      </motion.div>

      <div className="w-full max-w-[480px]">
        {/* Latest Release */}
        {latestRelease && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#ff6b2c" }}
            >
              Latest Release
            </h2>
            <div
              className="overflow-hidden rounded-xl"
              style={{ backgroundColor: "#2a2118" }}
            >
              <img
                src={latestRelease.coverImage}
                alt={latestRelease.title}
                className="aspect-square w-full object-cover"
              />
              <div className="p-4">
                <h3
                  className="text-lg font-bold tracking-wide"
                  style={{ color: "#f5efe6" }}
                >
                  {latestRelease.title}
                </h3>
                <p
                  className="mt-0.5 text-xs tracking-wide"
                  style={{ color: "#b8a690" }}
                >
                  WTCHOUT
                  {latestRelease.description &&
                    ` \u2022 ${latestRelease.description}`}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {streamingPlatforms.map((platform) => {
                    const url = latestRelease[platform.key];
                    if (!url) return null;
                    return (
                      <a
                        key={platform.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-[rgba(245,239,230,0.15)] active:bg-[rgba(245,239,230,0.2)]"
                        style={{
                          backgroundColor: "rgba(245, 239, 230, 0.08)",
                          color: "#f5efe6",
                        }}
                      >
                        {platformIcons[platform.icon]}
                        {platform.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Link Groups */}
        {linkGroups.map((group, groupIndex) => (
          <motion.section
            key={group.title}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + groupIndex * 0.1 }}
          >
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#ff6b2c" }}
            >
              {group.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              {group.items.map((item) => {
                const isExternal =
                  item.url.startsWith("http") ||
                  item.url.startsWith("mailto:");
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors duration-200 hover:bg-[#352c22] active:bg-[#3d332a]"
                    style={{
                      backgroundColor: "#2a2118",
                      color: "#f5efe6",
                    }}
                  >
                    <span style={{ color: "#ff6b2c" }}>
                      {platformIcons[item.icon] ?? null}
                    </span>
                    <span className="text-sm font-medium tracking-wide">
                      {item.name}
                    </span>
                    {item.description && (
                      <span
                        className="ml-auto text-xs"
                        style={{ color: "#b8a690" }}
                      >
                        {item.description}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
