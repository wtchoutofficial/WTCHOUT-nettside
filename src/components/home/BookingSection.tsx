"use client";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { contactEmail } from "@/data/socials";
import BookingForm from "@/components/booking/BookingForm";

const bulletItems = [
  "Festivals",
  "Club nights",
  "Beach clubs & pool parties",
  "Private events with the right energy",
];

export default function BookingSection() {
  return (
    <section
      id="booking"
      className="px-6 py-24 sm:px-12 lg:px-24"
      style={{
        background: "linear-gradient(to bottom, #1a1410, #1e1812, #1a1410)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left: copy */}
          <RevealOnScroll direction="left">
            <div>
              <span
                className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "#ff6b2c" }}
              >
                Booking
              </span>
              <h2
                className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{ color: "#f5efe6" }}
              >
                Book WTCHOUT
              </h2>

              <p
                className="mb-8 max-w-md text-base leading-relaxed"
                style={{ color: "#b8a690" }}
              >
                I&apos;m selective about gigs — if your event has the right
                vibe, let&apos;s talk.
              </p>

              <ul className="mb-10 flex flex-col gap-3">
                {bulletItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: "#ff6b2c" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#d4a574" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

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
          </RevealOnScroll>

          {/* Right: form */}
          <RevealOnScroll direction="right" delay={0.15}>
            <BookingForm />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
