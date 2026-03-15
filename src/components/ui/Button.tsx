"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ff6b2c] text-[#1a1410] hover:bg-[#ff8a55] font-semibold shadow-lg shadow-[#ff6b2c]/20",
  secondary:
    "border border-[#d4a574] text-[#d4a574] hover:bg-[#d4a574]/10 font-medium",
  ghost:
    "text-[#b8a690] hover:text-[#f5efe6] hover:bg-[#2a2118] font-medium",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm tracking-wide transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-block"
      >
        <Link href={href} className={classes} onClick={onClick}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export default Button;
