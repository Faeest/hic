"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.3 });

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.button>
  );
}