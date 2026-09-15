"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { HeroCanvas } from "./HeroCanvas";
import { club } from "@/data/club";

const EASE = [0.16, 1, 0.3, 1] as const;

function Word({ children, i }: { children: string; i: number }) {
  return (
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
  );
}

export function Hero() {
  const headline = ["Hardware", "Interactive", "Club"];

  return (
    <section
      id="beranda"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      <div className="mesh-orange absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-60"
      />
      <HeroCanvas />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:pt-36">
        <h1 className="font-display text-[13vw] font-semibold leading-[0.94] tracking-tight text-ink sm:text-[10vw] lg:text-[8.2rem]">
          {headline.map((w, i) => (
            <Word key={w} i={i}>
              {w}
            </Word>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
        >
          Ruang belajar keilmuan di mana mahasiswa menjadi{" "}
          <span className="font-semibold text-ember">mentor bagi satu sama lain</span> —
          melalui kelas kecil untuk Web, UI/UX, dan IoT.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#divisi"
            className="group inline-flex items-center gap-2.5 rounded-full bg-ember px-7 py-4 text-base font-medium text-white shadow-[0_16px_40px_-16px_rgba(212,83,17,0.7)] transition-all duration-300 hover:bg-flare"
          >
            Jelajahi Divisi
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
            />
          </a>
          <a
            href="#tentang"
            className="group inline-flex items-center gap-2.5 rounded-full glass-panel shadow-ember px-7 py-4 text-base font-medium text-ink transition-all duration-300 hover:text-ember"
          >
            Tentang HIC
            <ArrowUpRight
              size={18}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </motion.div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
          className="my-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl glass-panel sm:grid-cols-4"
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
      </div>
    </section>
  );
}