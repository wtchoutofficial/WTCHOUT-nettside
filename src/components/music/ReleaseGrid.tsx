"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Release } from "@/types/music";
import { ReleaseCard } from "./ReleaseCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

type FilterKey = "alle" | "single" | "ep" | "album";

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "single", label: "Singler" },
  { key: "ep", label: "EP" },
  { key: "album", label: "Album" },
];

interface ReleaseGridProps {
  releases: Release[];
  initialFilter?: FilterKey;
}

export function ReleaseGrid({
  releases,
  initialFilter = "alle",
}: ReleaseGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>(initialFilter);

  const filtered =
    activeFilter === "alle"
      ? releases
      : releases.filter((r) => r.type === activeFilter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors"
            style={{
              color: activeFilter === tab.key ? "#1a1410" : "#b8a690",
              backgroundColor:
                activeFilter === tab.key ? "#ff6b2c" : "#2a2118",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((release, i) => (
            <RevealOnScroll key={release.slug} delay={i * 0.08}>
              <ReleaseCard release={release} />
            </RevealOnScroll>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-12 text-center" style={{ color: "#b8a690" }}>
          Ingen utgivelser funnet.
        </p>
      )}
    </div>
  );
}

export default ReleaseGrid;
