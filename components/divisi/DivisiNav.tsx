"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { divisiVars } from "@/lib/utils";
import { getDivisi, type Divisi } from "@/data/divisi";

export function DivisiNav({ current }: { current: Divisi }) {
  const all = ["web", "uiux", "iot"] as const;
  const next = all[(all.indexOf(current.slug as (typeof all)[number]) + 1) % all.length];
  const nextD = getDivisi(next);
  if (!nextD) return null;

  return (
    <section className="relative overflow-hidden bg-cream" style={divisiVars(nextD)}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="flex items-baseline gap-3 text-sm">
            <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
            <span className="font-medium text-ink-faint">Jelajahi divisi berikutnya</span>
          </p>
          <Link
            href={`/divisi/${nextD.slug}`}
            className="group mt-4 flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-5">
              <span className="font-display text-3xl font-bold text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--div-main)" }}
              >
                {nextD.angka}
              </span>
              <span className="font-display text-5xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-ember sm:text-6xl">
                {nextD.nama}
              </span>
            </div>
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-[var(--div-main)] px-6 py-3.5 text-sm font-medium text-white transition-transform duration-300 group-hover:scale-[1.03]">
              Buka divisi
              <ArrowUpRight size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}