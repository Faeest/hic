"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { SectionHead } from "@/components/ui/SectionHead";
import { divisi, type Divisi } from "@/data/divisi";
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
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
        <span
          className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--div-bg)] text-[var(--div-main)] sm:h-14 sm:w-14 dark:bg-[var(--div-bg-dark)]"
        >
          <span className="relative z-10 font-display text-lg font-bold sm:text-xl">
            {d.akronim}
          </span>
        </span>
        <span className="flex-1">
          <span className="block font-display text-3xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-ember sm:text-4xl lg:text-5xl">
            {d.nama}
          </span>
        </span>
        <span className="hidden md:block md:max-w-[24ch] text-sm leading-relaxed text-ink-soft">
          {d.tagline}
        </span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-white">
          <motion.span animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
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
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                    Kurikulum · {d.kurikulum.length} tahap
                  </p>
                  <Link
                    href={`/divisi/${d.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-colors duration-300 bg-[var(--div-main)]"
                  >
                    Buka divisi
                    <ArrowUpRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {d.kurikulum.map((k) => (
                  <div
                    key={k.nomor}
                    className="rounded-2xl border bg-[var(--div-bg)] p-5 transition-colors duration-300 border-[var(--div-border)] dark:bg-[var(--div-bg-dark)] dark:border-[var(--div-border-dark)]"
                  >
                    <span className="font-mono text-[11px] text-[var(--div-main)]">
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

export function DivisiIndex({ id }: { id: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden bg-cream py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_100%_at_30%_0%,rgba(251,150,6,0.1),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="II"
            label="Divisi"
            title={
              <>
                Tiga jalur, satu{" "}
                <span className="text-ember">cara belajar</span>.
              </>
            }
            sub="Setiap divisi punya kurikulum bertahap yang dipandu mentor dari anggota senior."
          />
        </div>

        <div className="mt-14 sm:mt-20">
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