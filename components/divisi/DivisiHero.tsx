"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { divisiVars } from "@/lib/utils";
import type { Divisi } from "@/data/divisi";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DivisiHero({ d }: { d: Divisi }) {
  return (
    <section
      className="relative flex min-h-[92dvh] flex-col justify-end overflow-hidden"
      style={divisiVars(d)}
    >
      <div className="absolute inset-0 bg-[var(--div-bg)] dark:bg-[var(--div-bg-dark)]" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 [background-size:24px_24px] [background-image:linear-gradient(rgba(212,83,17,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(212,83,17,0.08)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[26rem] w-[26rem] rounded-full"
        style={{ background: `radial-gradient(circle, ${d.warna.terang}33, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-8 h-80 w-80 rounded-full"
        style={{ background: `radial-gradient(circle, ${d.warna.utama}22, transparent 70%)` }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-8 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <Link
            href="/#divisi"
            className="group inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-ink-soft transition-colors hover:text-ember"
          >
            <ArrowLeft
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Kembali ke divisi
          </Link>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-5 sm:gap-8">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="font-display text-[6rem] font-bold leading-none text-transparent sm:text-[9rem]"
              style={{ WebkitTextStroke: "2px var(--div-main)" }}
            >
              {d.angka}
            </motion.span>
            <div className="flex flex-col gap-2 pt-2">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                className="flex items-baseline gap-3 text-sm text-[var(--div-main)]"
              >
                <span className="font-mono">{d.angka}</span>
                <span className="h-px w-6 self-center bg-current opacity-30" aria-hidden />
                <span className="font-medium">{d.namaPanjang}</span>
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
                className="font-display text-6xl font-semibold tracking-tight text-ink sm:text-8xl lg:text-9xl"
              >
                {d.nama}
              </motion.h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="max-w-md lg:mb-3 lg:max-w-sm"
          >
            <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">
              {d.tagline}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-12 flex flex-col gap-8 border-t border-ink/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {d.deskripsi}
          </p>
          <a
            href="#kurikulum"
            className="group inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-[var(--div-main)] px-7 py-4 text-base font-medium text-white transition-transform duration-300 hover:scale-[1.03] lg:self-auto"
          >
            Lihat kurikulum
            <ArrowUpRight
              size={18}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}