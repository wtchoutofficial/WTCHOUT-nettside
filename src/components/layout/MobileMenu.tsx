"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { socials } from "@/data/socials";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      onClose();

      if (href.startsWith("#")) {
        // Hash link — scroll to section
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            const navHeight = 80;
            const top =
              target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 100);
      } else {
        // Route link — navigate
        setTimeout(() => {
          router.push(href);
        }, 100);
      }
    },
    [onClose, router]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ backgroundColor: "#1a1410" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 transition-colors"
            style={{ color: "#f5efe6" }}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          {/* Nav links */}
          <nav className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.07,
                }}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-3xl font-light tracking-wide transition-colors hover:text-[#ff6b2c] active:text-[#ff6b2c]"
                  style={{ color: "#f5efe6" }}
                >
                  {link.label}
                </a>
              </motion.div>
            ))}
          </nav>

          {/* Social icons */}
          <motion.div
            className="absolute bottom-12 flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-[#ff6b2c] active:text-[#ff6b2c]"
                style={{ color: "#b8a690" }}
                aria-label={social.name}
              >
                {social.name}
              </a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
