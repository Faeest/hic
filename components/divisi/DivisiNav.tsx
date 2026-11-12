"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { divisiVars } from "@/lib/utils";
import type { Divisi } from "@/lib/types";

export function DivisiNav({ current, all }: { current: Divisi; all: Divisi[] }) {
  if (all.length < 2) return null;
  const idx = all.findIndex((d) => d.slug === current.slug);
  const nextD = all[(idx + 1) % all.length];
  if (!nextD || nextD.slug === current.slug) return null;

  return (
    <section className="relative overflow-hidden bg-cream" style={divisiVars(nextD)}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-sm text-ink-faint">
            Berikutnya
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
            <span className="inline-flex w-fit items-center gap-2.5 rounded-sm bg-[var(--div-main)] px-6 py-3.5 text-sm font-medium text-white transition-opacity duration-300 group-hover:opacity-90">
              Buka divisi
              <ArrowUpRight size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
