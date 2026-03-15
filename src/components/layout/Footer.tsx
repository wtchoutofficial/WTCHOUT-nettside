"use client";

import Image from "next/image";
import { socials, contactEmail } from "@/data/socials";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1a1410",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: "#2a2118",
        color: "#b8a690",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <Image
            src="/images/branding/w-logo.png"
            alt="WTCHOUT logo"
            width={40}
            height={40}
          />
          <span
            className="font-bold tracking-widest text-lg"
            style={{ color: "#f5efe6" }}
          >
            WTCHOUT
          </span>

          {/* Tagline */}
          <p className="text-sm" style={{ color: "#b8a690" }}>
            Music. Culture. Vibes.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors"
                style={{ color: "#b8a690" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ff6b2c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#b8a690";
                }}
              >
                {social.name}
              </a>
            ))}
          </div>

          {/* Contact email */}
          <a
            href={`mailto:${contactEmail}`}
            className="text-sm transition-colors"
            style={{ color: "#d4a574" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff6b2c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#d4a574";
            }}
          >
            {contactEmail}
          </a>
        </div>

        {/* Copyright */}
        <div
          className="mt-12 pt-8 text-center text-xs"
          style={{
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "#2a2118",
            color: "#b8a690",
          }}
        >
          &copy; 2025 WTCHOUT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
