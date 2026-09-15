"use client";

import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  href,
  ...props
}: {
  children: React.ReactNode;
  variant?: "solid" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const controls = useAnimationControls();

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
  };

  const variants = {
    solid:
      "bg-ember text-white shadow-[0_12px_30px_-12px_rgba(212,83,17,0.55)] hover:bg-flare",
    glass:
      "glass-panel text-ink hover:text-ember",
    outline:
      "border-2 border-ink/15 text-ink hover:border-ember hover:text-ember bg-transparent",
  };

  return (
    <motion.a
      href={href}
      onClick={props.onClick}
      type={props.type}
      onHoverStart={() => controls.start({ y: -1 })}
      onHoverEnd={() => controls.start({ y: 0 })}
      animate={controls}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-tight",
        "transition-colors duration-300 will-change-transform",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </motion.a>
  );
}