"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { HeroCanvas } from "./HeroCanvas";
import { club } from "@/data/club";
import type { HeroBlock } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

function Word({
  children,
  i,
  progress,
}: {
  children: string;
  i: number;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], [0, 36 + i * 44]);
  return (
    <motion.span style={{ y }} className="inline-block align-bottom">
      <span className="inline-block overflow-hidden align-bottom">
        <motion.span
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease: EASE }}
        >
          {children}
          {"\u00A0"}
        </motion.span>
      </span>
    </motion.span>
  );
}

function renderHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-ember">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

export function Hero({ block }: { block: HeroBlock }) {
  const headline = block.headline;
  const secRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const subY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      id={block.id}
      ref={secRef}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      <div className="mesh-orange absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-60"
      />
      <HeroCanvas />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:pt-36"
      >
        <h1 className="font-display text-[13vw] font-semibold leading-[0.94] tracking-tight text-ink sm:text-[10vw] lg:text-[8.2rem]">
          {headline.map((w, i) => (
            <Word key={w} i={i} progress={scrollYProgress}>
              {w}
            </Word>
          ))}
        </h1>

        <motion.div style={{ y: subY }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
          >
            {renderHighlight(block.subcopy, block.subcopyHighlight)}
          </motion.p>
        </motion.div>

        <motion.div style={{ y: ctaY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
          {block.ctas.map((cta, i) => {
            const primary = cta.style === "primary";
            const Icon = i === 0 ? ArrowDownRight : ArrowUpRight;
            return (
              <a
                key={cta.label}
                href={cta.href}
                className={
                  primary
                    ? "group inline-flex items-center gap-2.5 rounded-full bg-ember px-7 py-4 text-base font-medium text-white shadow-[0_16px_40px_-16px_rgba(212,83,17,0.7)] transition-all duration-300 hover:bg-flare"
                    : "group inline-flex items-center gap-2.5 rounded-full glass-panel shadow-ember px-7 py-4 text-base font-medium text-ink transition-all duration-300 hover:text-ember"
                }
              >
                {cta.label}
                <Icon
                  size={18}
                  weight="bold"
                  className={
                    i === 0
                      ? "transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                      : "transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  }
                />
              </a>
            );
          })}
        </motion.div>
        </motion.div>

        {/* stats strip */}
        <motion.div style={{ y: statsY }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
            className="my-16 grid grid-cols-2 gap-px overflow-hidden rounded-full glass-panel shadow-none! sm:grid-cols-4"
          >
          {club.statistik.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1.5 px-6 py-6 sm:px-8"
            >
              <span className="font-display text-3xl font-semibold text-ember sm:text-4xl">
                {s.angka}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                {s.label}
              </span>
            </div>
          ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}