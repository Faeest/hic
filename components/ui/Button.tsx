"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-base",
  lg: "px-9 py-4.5 text-lg",
};

const variants = {
  solid: "bg-ember text-white hover:bg-flare",
  glass: "border border-ink/15 text-ink hover:border-ember hover:text-ember",
  outline: "border border-ink/20 text-ink hover:border-ember hover:text-ember",
};

type Common = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

/**
 * Renders an anchor when `href` is given, a real button otherwise — so
 * `type="submit"` inside a form actually submits (it silently did not when
 * this was always a `motion.a`).
 */
export function Button(
  props: Common &
    (
      | ({ href: string } & React.ComponentPropsWithoutRef<"a">)
      | ({ href?: undefined } & React.ComponentPropsWithoutRef<"button">)
    )
) {
  const { children, variant = "solid", size = "md", className, ...rest } = props;

  const cls = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-sm font-medium tracking-tight",
    "transition-colors duration-300",
    sizes[size],
    variants[variant],
    className
  );

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as React.ComponentPropsWithoutRef<"a"> & {
      href: string;
    };
    return (
      <motion.a
        href={href}
        whileTap={{ scale: 0.98 }}
        className={cls}
        {...(anchorProps as React.ComponentProps<typeof motion.a>)}
      >
        {children}
      </motion.a>
    );
  }

  const buttonProps = rest as React.ComponentPropsWithoutRef<"button">;
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cls}
      {...(buttonProps as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
