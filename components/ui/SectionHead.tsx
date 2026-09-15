"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function AnimatedTitle({
  text,
  accent,
  align,
}: {
  text: string;
  accent?: string;
  align: "left" | "center";
}) {
  const words = text.split(" ").filter(Boolean);

  let accentStart = -1;
  let accentLen = 0;
  if (accent) {
    const idx = text.indexOf(accent);
    if (idx >= 0) {
      accentStart = text.slice(0, idx).split(" ").filter(Boolean).length;
      accentLen = accent.split(" ").filter(Boolean).length;
    }
  }

  return (
    <h2
      className={cn(
        "font-display text-5xl font-semibold leading-[1.0] tracking-tight text-ink sm:text-6xl lg:text-7xl xl:text-[5.5rem]",
        align === "center" ? "max-w-[20ch]" : "max-w-[18ch]"
      )}
    >
      {words.map((w, i) => {
        const isAccent =
          accentStart >= 0 && i >= accentStart && i < accentStart + accentLen;
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={cn("inline-block", isAccent && "text-ember")}
              initial={{ y: "112%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.05 + i * 0.05 }}
            >
              {w}
              {"\u00A0"}
            </motion.span>
          </span>
        );
      })}
    </h2>
  );
}

export function SectionHead({
  index,
  label,
  title,
  accent,
  align = "left",
  className,
}: {
  index?: string;
  label: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="inline-flex items-baseline gap-3 text-sm"
      >
        {index && <span className="font-mono font-medium text-ember">{index}</span>}
        {index && <span className="h-px w-6 self-center bg-ember/40" aria-hidden />}
        <span className="font-medium text-ink-soft">{label}</span>
      </motion.span>

      <AnimatedTitle text={title} accent={accent} align={align} />
    </div>
  );
}