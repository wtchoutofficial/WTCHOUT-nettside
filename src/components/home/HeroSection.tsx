"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText";
import ListenNowModal from "@/components/home/ListenNowModal";

import { releases } from "@/data/releases";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const featuredRelease = releases.find((r) => r.featured) ?? releases[0];

  return (
    <section
      id="hero"
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero/hero-sunset.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #1a1410 0%, #1a1410cc 30%, transparent 60%)",
        }}
      />
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GlitchText
            text="WTCHOUT"
            className="text-5xl font-bold tracking-widest sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ color: "#f5efe6", textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg tracking-wide sm:text-xl md:text-2xl"
          style={{ color: "#b8a690" }}
        >
          Sound beyond boundaries
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="mt-4 rounded px-8 py-3 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm transition-all duration-300"
          style={{
            backgroundColor: "transparent",
            color: "#f5efe6",
            border: "1px solid #d4a574",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(245, 239, 230, 0.1)";
            e.currentTarget.style.borderColor = "#f5efe6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "#d4a574";
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Listen Now
        </motion.button>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={32} style={{ color: "#b8a690" }} />
        </motion.div>
      </motion.div>
      <ListenNowModal
        release={featuredRelease}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
