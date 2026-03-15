"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Release } from "@/types/music";
import { formatDate } from "@/lib/utils";

const typeBadgeLabel: Record<Release["type"], string> = {
  single: "Singel",
  ep: "EP",
  album: "Album",
};

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  return (
    <Link href={`/music/${release.slug}`} className="group block">
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-lg"
        style={{ backgroundColor: "#2a2118" }}
      >
        {/* Cover image */}
        <div className="relative aspect-square overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #2a2118 0%, #1a1410 50%, #ff6b2c20 100%)",
            }}
          />
          <motion.div
            className="relative h-full w-full"
            whileHover={{
              scale: 1.05,
              filter: "hue-rotate(15deg) brightness(1.1)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={release.coverImage}
              alt={release.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: "#ff6b2c", color: "#1a1410" }}
            >
              {typeBadgeLabel[release.type]}
            </span>
          </div>

          <h3
            className="mb-1 text-lg font-bold transition-colors group-hover:text-[#ff6b2c]"
            style={{ color: "#f5efe6" }}
          >
            {release.title}
          </h3>

          <p className="text-sm" style={{ color: "#b8a690" }}>
            {formatDate(release.releaseDate)}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

export default ReleaseCard;
