"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { contactEmail } from "@/data/socials";
import BookingForm from "@/components/booking/BookingForm";
import ProductionForm from "@/components/booking/ProductionForm";
import GeneralForm from "@/components/booking/GeneralForm";

type Category = "booking" | "production" | "general";

const categories: {
  id: Category;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    id: "booking",
    icon: "🎧",
    title: "Booking",
    description: "Book me for events, festivals and clubs",
  },
  {
    id: "production",
    icon: "🎹",
    title: "Production",
    description: "Collabs, beats or production help",
  },
  {
    id: "general",
    icon: "✉️",
    title: "General",
    description: "Interviews, labels, invitations and more",
  },
];

export default function BookingSection() {
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <section
      id="booking"
      className="px-6 py-24 sm:px-12 lg:px-24"
      style={{
        background: "linear-gradient(to bottom, #1a1410, #1e1812, #1a1410)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <RevealOnScroll>
          <div className="mb-16 text-center">
            <span
              className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "#ff6b2c" }}
            >
              Contact
            </span>
            <h2
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: "#f5efe6" }}
            >
              Get in Touch
            </h2>
            <p className="text-base" style={{ color: "#b8a690" }}>
              What can I help you with?
            </p>
          </div>
        </RevealOnScroll>

        {/* Category cards */}
        <RevealOnScroll delay={0.1}>
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {categories.map((cat) => {
              const isActive = selected === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelected(isActive ? null : cat.id)}
                  className="group rounded-lg p-6 text-left transition-colors duration-300"
                  style={{
                    backgroundColor: isActive ? "rgba(255, 107, 44, 0.1)" : "#2a2118",
                    border: `1px solid ${isActive ? "#ff6b2c" : "rgba(212, 165, 116, 0.2)"}`,
                    boxShadow: isActive ? "0 0 20px rgba(255, 107, 44, 0.15)" : "none",
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(255, 107, 44, 0.2)",
                    borderColor: "#ff6b2c",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="mb-3 block text-2xl">{cat.icon}</span>
                  <h3
                    className="mb-1 text-lg font-semibold transition-colors group-hover:text-[#ff6b2c]"
                    style={{ color: isActive ? "#ff6b2c" : "#f5efe6" }}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#b8a690" }}>
                    {cat.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Form area */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {selected === "booking" && <BookingForm />}
              {selected === "production" && <ProductionForm />}
              {selected === "general" && <GeneralForm />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direct email fallback */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: "#b8a690" }}>
            Or reach out directly at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="underline transition-colors hover:no-underline"
              style={{ color: "#ff6b2c" }}
            >
              {contactEmail}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
