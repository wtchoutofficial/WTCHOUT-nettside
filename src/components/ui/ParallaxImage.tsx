"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.3,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.div style={{ y }} className="relative w-full h-[120%] -top-[10%]">
        {hasError ? (
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #2a2118 0%, #1a1410 40%, #ff6b2c20 100%)",
            }}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            onError={() => setHasError(true)}
          />
        )}
      </motion.div>
    </div>
  );
}

export default ParallaxImage;
