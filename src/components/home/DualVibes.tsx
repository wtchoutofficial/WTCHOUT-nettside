"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";

interface VibePanel {
  label: string;
  subtitle: string;
  description: string;
  genres: string[];
  accentColor: string;
  textColor: string;
  bgColor: string;
  video: string;
  gradient: string;
}

const panels: VibePanel[] = [
  {
    label: "Dusk",
    subtitle: "The warm side",
    description:
      "Sunsets, golden tones and groovy rhythms. Dusk is the sound of late summer evenings — house, disco and melodies that make you stay a little longer.",
    genres: ["House", "Disco", "Afro", "Minimal", "Rally House"],
    accentColor: "#ff6b2c",
    textColor: "#d4a574",
    bgColor: "#1e1812",
    video: "/videos/dusk.mp4",
    gradient:
      "linear-gradient(to top, #1e1812cc 0%, #1e181266 50%, #1e181299 100%)",
  },
  {
    label: "Dawn",
    subtitle: "The dark side",
    description:
      "When the lights go out and the bass takes over. Dawn is the raw and unknown — underground techno, deep frequencies and nights that never end.",
    genres: ["Hard House", "UK Garage", "Techno", "Hard Techno", "DnB"],
    accentColor: "#e03c3c",
    textColor: "#d4a0a0",
    bgColor: "#0d0d14",
    video: "/videos/dawn-1.mp4",
    gradient:
      "linear-gradient(to top, #0d0d14cc 0%, #0d0d1466 50%, #0d0d1499 100%)",
  },
];

export default function DualVibes() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mutedState, setMutedState] = useState<boolean[]>([true, true]);

  const toggleMute = useCallback(
    (index: number) => {
      const video = videoRefs.current[index];
      if (!video) return;

      const newState = [...mutedState];
      // Mute all others when unmuting one
      if (newState[index]) {
        videoRefs.current.forEach((v, j) => {
          if (v && j !== index) {
            v.muted = true;
            newState[j] = true;
          }
        });
      }
      video.muted = !video.muted;
      newState[index] = video.muted;
      setMutedState(newState);
    },
    [mutedState],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Mute all videos when section leaves viewport
            videoRefs.current.forEach((v, j) => {
              if (v && !v.muted) {
                v.muted = true;
                setMutedState((prev) => {
                  const next = [...prev];
                  next[j] = true;
                  return next;
                });
              }
            });
          }
        });
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="vibes">
      {/* Header */}
      <div
        className="px-6 py-16 text-center sm:px-12"
        style={{ backgroundColor: "#1a1410" }}
      >
        <GlitchText
          text="Two Sides. One Sound."
          as="h2"
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "#f5efe6" }}
        />
        <p
          className="mx-auto mt-4 max-w-md text-base leading-relaxed"
          style={{ color: "#b8a690" }}
        >
          Every set has two moods. Which one are you feeling?
        </p>
      </div>

      {/* Panels grid */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {panels.map((panel, index) => (
          <div
            key={panel.label}
            className="relative flex min-h-[60vh] items-center justify-center overflow-hidden md:min-h-screen"
            style={{ backgroundColor: panel.bgColor }}
          >
            {/* Video background */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              autoPlay
              muted
              loop
              playsInline
              src={panel.video}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Gradient overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: panel.gradient }}
            />

            {/* Divider line between panels (right edge of Dusk on desktop) */}
            {index === 0 && (
              <div
                className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-px md:block"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.08) 50%, transparent 90%)`,
                }}
              />
            )}

            {/* Text content */}
            <motion.div
              className="relative z-10 flex flex-col items-center px-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: panel.accentColor }}
              >
                {panel.subtitle}
              </span>

              <h3
                className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ color: "#f5efe6" }}
              >
                {panel.label}
              </h3>

              <div
                className="mt-4 h-px w-16"
                style={{ backgroundColor: `${panel.accentColor}60` }}
              />

              <p
                className="mt-6 max-w-sm text-base leading-relaxed sm:text-lg"
                style={{ color: panel.textColor }}
              >
                {panel.description}
              </p>

              {/* Genre tags */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {panel.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${panel.accentColor}20`,
                      color: panel.accentColor,
                      border: `1px solid ${panel.accentColor}40`,
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Mute/unmute button */}
            <button
              onClick={() => toggleMute(index)}
              className="absolute bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200"
              style={{
                backgroundColor: "rgba(10, 10, 15, 0.5)",
                color: panel.accentColor,
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(10, 10, 15, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(10, 10, 15, 0.5)";
              }}
              aria-label={mutedState[index] ? "Unmute audio" : "Mute audio"}
            >
              {mutedState[index] ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
