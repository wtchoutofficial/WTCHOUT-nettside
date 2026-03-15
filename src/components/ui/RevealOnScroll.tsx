"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "left" | "right";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
};

export function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default RevealOnScroll;
