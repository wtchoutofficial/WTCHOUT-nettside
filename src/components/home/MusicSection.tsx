"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { releases } from "@/data/releases";
import { artistStats } from "@/data/stats";
import { formatDate } from "@/lib/utils";
import { Release } from "@/types/music";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import ListenNowModal from "@/components/home/ListenNowModal";

/* ─── Animated Counter ─── */
function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const isDecimal = value % 1 !== 0;
    const controls = animate(motionVal, value, {
      duration: 2,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setDisplay(isDecimal ? v.toFixed(2) : Math.round(v).toLocaleString());
      },
    });

    return () => controls.stop();
  }, [isInView, value, delay, motionVal]);

  return (
    <div ref={ref} className="text-center">
      <span className="text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: "#f5efe6" }}>
        {display}
      </span>
      {suffix && (
        <span className="text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: "#ff6b2c" }}>
          {suffix}
        </span>
      )}
      <p
        className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "#b8a690" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ─── Release Card ─── */
const typeBadgeLabel: Record<string, string> = {
  single: "Single",
  ep: "EP",
  album: "Album",
};

function ReleaseCard({ release, onClick }: { release: Release; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group w-full text-left">
      {/* Cover */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={release.coverImage}
          alt={release.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
          style={{
            background: "linear-gradient(to top, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.3) 100%)",
          }}
        >
          <span
            className="rounded px-5 py-2 text-sm font-semibold tracking-wide"
            style={{ backgroundColor: "#ff6b2c", color: "#1a1410" }}
          >
            Listen Now
          </span>
        </div>
        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: "0 0 30px rgba(255, 107, 44, 0.25)" }}
        />
      </div>

      {/* Info */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold tracking-tight" style={{ color: "#f5efe6" }}>
            {release.title}
          </h3>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(255,107,44,0.15)", color: "#ff6b2c" }}
          >
            {typeBadgeLabel[release.type]}
          </span>
        </div>
        {release.description && (
          <p className="mt-0.5 text-sm" style={{ color: "#d4a574" }}>
            {release.description}
          </p>
        )}
        <p className="mt-1 text-xs" style={{ color: "#b8a690" }}>
          {formatDate(release.releaseDate)}
        </p>
      </div>
    </button>
  );
}

/* ─── Main Section ─── */
export default function MusicSection() {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  return (
    <section
      id="music"
      className="relative overflow-hidden px-6 py-16 sm:py-24 sm:px-12 lg:px-24"
      style={{ backgroundColor: "#1a1410" }}
    >
      {/* Floating glow orb */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,107,44,0.08), transparent)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <RevealOnScroll>
          <span
            className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#ff6b2c" }}
          >
            Music
          </span>
          <h2
            className="mb-16 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: "#f5efe6" }}
          >
            Numbers & Releases
          </h2>
        </RevealOnScroll>

        {/* Stats row */}
        <RevealOnScroll delay={0.1}>
          <div className="mb-16 flex items-center justify-center gap-6 sm:gap-12 md:gap-20">
            {artistStats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 0.15}
              />
            ))}
          </div>
        </RevealOnScroll>

        {/* Divider */}
        <div className="mx-auto mb-16 h-px max-w-md" style={{ backgroundColor: "rgba(184,166,144,0.2)" }} />

        {/* Releases grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((release, i) => (
            <RevealOnScroll key={release.slug} delay={0.1 + i * 0.08}>
              <ReleaseCard release={release} onClick={() => setSelectedRelease(release)} />
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedRelease && (
        <ListenNowModal
          release={selectedRelease}
          isOpen={!!selectedRelease}
          onClose={() => setSelectedRelease(null)}
        />
      )}
    </section>
  );
}
