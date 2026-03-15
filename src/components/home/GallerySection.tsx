"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { galleryImages, GalleryImage } from "@/data/gallery";

const PARALLAX_SPEEDS: Record<number, number> = {
  1: 80,
  2: 50,
  3: 30,
  4: 15,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

function TimelineCard({
  image,
  index,
}: {
  image: GalleryImage;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Parallax (per layer)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const amount = PARALLAX_SPEEDS[image.layer] ?? 30;
  const yParallax = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  const isLeft = index % 2 === 0;

  // Sticky-stack: each card sticks slightly lower, new cards cover old ones
  const stickyTop = 60 + index * 20;

  return (
    <div
      className="sticky"
      style={{
        top: stickyTop,
        zIndex: index + 1,
        marginTop: index === 0 ? 0 : -80,
      }}
    >
      <motion.div
        ref={ref}
        className={`relative flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"}`}
      >
        {/* Dot on spine */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#ff6b2c] bg-[#1a1410] z-10" />

        {/* Image with parallax */}
        <motion.div
          className="group relative overflow-hidden w-[45%] shrink-0"
          style={{ height: image.height, y: yParallax }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          custom={index}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </motion.div>

        {/* Spine gap */}
        <div className="w-[10%] shrink-0" />

        {/* Caption on opposite side */}
        <div className="w-[45%] shrink-0 flex items-center">
          {image.caption && (
            <motion.p
              className={`text-sm md:text-base lg:text-lg font-medium uppercase tracking-[0.25em] leading-relaxed px-8 w-full ${isLeft ? "text-left" : "text-right"}`}
              style={{ color: "#b8a690" }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={index + 0.3}
            >
              {image.caption}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function GallerySection() {
  return (
    <section
      id="gallery"
      className="px-6 py-24 sm:px-12 lg:px-24 overflow-hidden"
      style={{ backgroundColor: "#1a1410" }}
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Spine — vertical center line */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,107,44,0.3) 5%, rgba(255,107,44,0.3) 95%, transparent)",
          }}
        />

        {/* Desktop: timeline cards */}
        <div className="hidden md:flex flex-col">
          {/* Title */}
          <motion.div
            className="text-center mb-8 relative z-10"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={0}
          >
            <span
              className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "#ff6b2c" }}
            >
              Gallery
            </span>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: "#f5efe6" }}
            >
              Moments
            </h2>
          </motion.div>

          {galleryImages.map((image, i) => (
            <TimelineCard key={image.src} image={image} index={i} />
          ))}
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="mb-8">
            <span
              className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "#ff6b2c" }}
            >
              Gallery
            </span>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#f5efe6" }}
            >
              Moments
            </h2>
          </div>
          {galleryImages.map((image, i) => (
            <motion.div
              key={image.src}
              className="group relative overflow-hidden w-full"
              style={{ height: image.mobileHeight }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              custom={i}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0">
                  <div
                    className="px-6 py-4"
                    style={{ backgroundColor: "rgba(26, 20, 16, 0.85)" }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-[0.25em]"
                      style={{ color: "#b8a690" }}
                    >
                      {image.caption}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
