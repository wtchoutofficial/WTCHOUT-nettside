"use client";

import {
  type ComponentType,
  type ElementType,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

// Props the dynamic tag actually receives. Casting to a concrete ComponentType
// keeps children inference off the (three-augmented) JSX.IntrinsicElements
// union — without it, @react-three/fiber's global JSX types collapse the
// children of a dynamic `ElementType` tag to `never`. Runtime is unchanged.
type TagProps = {
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children?: ReactNode;
};

export function GlitchText({
  text,
  as: TagComponent = "h1",
  className = "",
  style,
}: GlitchTextProps) {
  const Tag = TagComponent as ComponentType<TagProps>;
  return (
    <Tag
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      aria-label={text}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        {text}
      </motion.span>
      <motion.span
        style={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          height: 2,
          backgroundColor: "#ff6b2c",
          transformOrigin: "center",
        }}
        initial={{ width: "100%", x: "-50%", opacity: 1 }}
        animate={{ width: "0%", opacity: 0 }}
        transition={{
          duration: 2,
          delay: 0.6,
          ease: "easeInOut" as const,
        }}
      />
    </Tag>
  );
}

export default GlitchText;
