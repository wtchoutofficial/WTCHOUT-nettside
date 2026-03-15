"use client";

import { artist } from "@/data/artist";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export default function AboutSection() {
  return (
    <section id="about" className="relative">
      {/* Top gradient: dark → light */}
      <div
        className="absolute top-0 left-0 right-0 h-32 -z-0"
        style={{
          background: "linear-gradient(to bottom, #1a1410, #f5efe6)",
        }}
      />

      {/* Main content */}
      <div
        className="relative px-6 pt-32 pb-32 sm:px-12 lg:px-24"
        style={{ backgroundColor: "#f5efe6" }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Two column layout */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: stacked images */}
            <RevealOnScroll direction="left">
              <ParallaxImage
                src={artist.images.studio1}
                alt="WTCHOUT in the studio"
                className="h-[600px]"
              />
            </RevealOnScroll>

            {/* Right: bio text */}
            <div className="flex flex-col justify-center">
              <RevealOnScroll>
                <span
                  className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "#ff6b2c" }}
                >
                  About
                </span>
                <h2
                  className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                  style={{ color: "#1a1410" }}
                >
                  {artist.name}
                </h2>
              </RevealOnScroll>

              {artist.bio.map((paragraph, i) => (
                <RevealOnScroll key={i} delay={0.1 * (i + 1)}>
                  <p
                    className="mb-6 text-base leading-relaxed"
                    style={{ color: "#5a4030" }}
                  >
                    {paragraph}
                  </p>
                </RevealOnScroll>
              ))}

              {/* Pull quote */}
              <RevealOnScroll delay={0.4}>
                <blockquote
                  className="my-8 py-4 pl-6 text-xl font-light italic leading-relaxed sm:text-2xl"
                  style={{
                    color: "#1a1410",
                    borderLeftWidth: "3px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "#ff6b2c",
                  }}
                >
                  &ldquo;{artist.quote}&rdquo;
                </blockquote>
              </RevealOnScroll>

              {/* Stats grid */}
              <RevealOnScroll delay={0.5}>
                <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {artist.highlights.map((stat) => (
                    <div key={stat.label}>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "#ff6b2c" }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: "#1a1410" }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient: light → dark */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 -z-0"
        style={{
          background: "linear-gradient(to bottom, #f5efe6, #1a1410)",
        }}
      />
    </section>
  );
}
