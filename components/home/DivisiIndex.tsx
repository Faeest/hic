"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Divisi, Section } from "@/lib/types";
import { divisiVars } from "@/lib/utils";

function DivisiRow({
  d,
  index,
  active,
  onToggle,
}: {
  d: Divisi;
  index: number;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
      className="group border-t border-ink/10 last:border-b"
      style={divisiVars(d)}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        className="flex w-full items-center gap-4 py-8 text-left sm:gap-8 sm:py-10"
      >
        <span className="font-mono text-xs text-ink-faint sm:text-sm">
          {d.angka}
        </span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-[var(--div-bg)] text-[var(--div-main)] sm:h-12 sm:w-12 dark:bg-[var(--div-bg-dark)]">
          <span className="relative z-10 font-display text-base font-bold sm:text-lg">
            {d.akronim}
          </span>
        </span>
        <span className="flex-1">
          <span className="block font-display text-3xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-ember sm:text-4xl lg:text-5xl">
            {d.nama}
          </span>
        </span>
        <span className="hidden max-w-[24ch] text-sm leading-relaxed text-ink-soft md:block">
          {d.tagline}
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-ink/15 text-ink transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-white">
          <motion.span
            animate={{ rotate: active ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArrowUpRight size={18} weight="bold" />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 pl-16 sm:pl-24">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                  {d.deskripsi}
                </p>
                <div className="flex shrink-0 flex-col gap-3">
                  <p className="text-xs text-ink-faint">
                    Kurikulum · {d.kurikulum.length} tahap
                  </p>
                  <Link
                    href={`/divisi/${d.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium text-white transition-colors duration-300 bg-[var(--div-main)]"
                  >
                    Buka divisi
                    <ArrowUpRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                {d.kurikulum.map((k) => (
                  <div
                    key={k.nomor}
                    className="bg-paper p-5 dark:bg-[var(--div-bg-dark)]"
                  >
                    <span className="font-mono text-xs text-[var(--div-main)]">
                      Tahap {k.nomor}
                    </span>
                    <h4 className="mt-1.5 font-display text-base font-semibold text-ink">
                      {k.judul}
                    </h4>
                    <p className="mt-1 text-xs text-ink-soft">{k.durasi}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DivisiIndex({
  id,
  divisi,
  section,
}: {
  id: string;
  divisi: Divisi[];
  section: Section;
}) {
  const [open, setOpen] = useState<number | null>(0);
  if (!section.visible) return null;

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden bg-cream py-14 sm:py-16">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40"
        style={{
          maskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index={section.index}
            label={section.label}
            title={section.title}
            accent={section.accent}
          />
        </div>

        <div className="mt-12 sm:mt-14">
          {divisi.map((d, i) => (
            <DivisiRow
              key={d.slug}
              d={d}
              index={i}
              active={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
