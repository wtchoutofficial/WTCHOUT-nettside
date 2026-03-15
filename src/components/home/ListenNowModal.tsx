"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Release } from "@/types/music";

interface ListenNowModalProps {
  release: Release;
  isOpen: boolean;
  onClose: () => void;
}

const platforms = [
  {
    name: "Spotify",
    key: "spotifyUrl" as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: "Apple Music",
    key: "appleMusicUrl" as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.335-2.22-1.178-.26-.52-.246-1.088.03-1.606.34-.637.94-.972 1.66-1.085.334-.052.67-.098 1.006-.144.378-.052.603-.244.674-.623.005-.026.013-.05.013-.076V9.2a.658.658 0 00-.028-.18c-.05-.18-.175-.28-.36-.26-.14.012-.278.04-.416.068l-4.89.96c-.027.006-.054.013-.08.02-.27.07-.385.2-.41.48-.005.063-.003.126-.003.19v7.594c0 .407-.052.81-.23 1.182-.283.59-.757.97-1.39 1.15-.347.1-.702.152-1.062.172-.957.046-1.81-.32-2.235-1.17-.263-.522-.25-1.09.025-1.612.337-.64.945-.977 1.665-1.09.33-.05.66-.097.992-.14.39-.054.618-.25.688-.64.005-.02.01-.04.01-.06V7.63c0-.32.078-.6.33-.82.186-.16.404-.252.64-.304.17-.038.34-.074.51-.11l5.21-1.023c.354-.07.71-.136 1.065-.198.26-.046.39.04.425.306.005.04.007.08.007.12v4.51z" />
      </svg>
    ),
  },
  {
    name: "YouTube Music",
    key: "youtubeMusicUrl" as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
      </svg>
    ),
  },
  {
    name: "Tidal",
    key: "tidalUrl" as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l4.004-4.004L12.012 3.992zM12.012 12l-4.004 4.004L12.012 20.008l4.004-4.004L12.012 12zM20.02 3.992l-4.004 4.004L20.02 12l4.004-4.004-4.004-4.004z" />
      </svg>
    ),
  },
];

export default function ListenNowModal({ release, isOpen, onClose }: ListenNowModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl"
            style={{ backgroundColor: "#1a1410" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#f5efe6" }}
            >
              <X size={18} />
            </button>

            {/* Cover image */}
            <img
              src={release.coverImage}
              alt={release.title}
              className="aspect-square w-full object-cover"
            />

            {/* Content */}
            <div className="p-6">
              <h3
                className="text-xl font-bold tracking-wide"
                style={{ color: "#f5efe6" }}
              >
                {release.title}
              </h3>
              <p
                className="mt-1 text-sm tracking-wide"
                style={{ color: "#b8a690" }}
              >
                WTCHOUT
              </p>

              <p
                className="mt-5 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#b8a690" }}
              >
                Listen on
              </p>

              {/* Platform grid */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {platforms.map((platform) => {
                  const url = release[platform.key];
                  if (!url) return null;
                  return (
                    <a
                      key={platform.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: "rgba(245, 239, 230, 0.08)",
                        color: "#f5efe6",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(245, 239, 230, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(245, 239, 230, 0.08)";
                      }}
                    >
                      {platform.icon}
                      {platform.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
