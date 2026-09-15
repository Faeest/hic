"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { divisiVars } from "@/lib/utils";
import type { Divisi } from "@/data/divisi";

export function Kurikulum({ d }: { d: Divisi }) {
  const totalPertemuan = d.kurikulum.reduce((a, k) => a + parseInt(k.durasi), 0);
  return (
    <section
      id="kurikulum"
      className="relative scroll-mt-24 bg-paper py-24 sm:py-32"
      style={divisiVars(d)}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="flex items-baseline gap-3 text-sm">
                <span className="font-mono text-[var(--div-main)]">{d.angka}</span>
                <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
                <span className="font-medium text-ink-soft">Kurikulum</span>
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Jalur belajarnya begini.
              </h2>
            </div>
            <span className="hidden shrink-0 items-center gap-2 rounded-full border border-ink/10 px-5 py-2.5 text-sm text-ink-soft sm:inline-flex">
              <GraduationCap size={16} weight="duotone" className="text-[var(--div-main)]" />
              {d.kurikulum.length} tahap · {totalPertemuan} pertemuan
            </span>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col">
          {d.kurikulum.map((k, i) => (
            <motion.div
              key={k.nomor}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              className="group grid gap-4 border-t border-ink/10 py-8 transition-colors duration-300 last:border-b md:grid-cols-[140px_1fr_auto] md:items-center md:gap-8"
            >
              <span className="flex items-baseline gap-3">
                <span className="text-sm text-ink-faint">Tahap</span>
                <span
                  className="font-display text-3xl font-bold text-transparent transition-colors duration-300"
                  style={{ WebkitTextStroke: "1.5px var(--div-main)" }}
                >
                  {k.nomor}
                </span>
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-ember sm:text-3xl">
                  {k.judul}
                </h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft">
                  {k.deskripsi}
                </p>
              </div>
              <span className="w-fit self-start rounded-full bg-[var(--div-bg)] px-4 py-1.5 text-sm text-[var(--div-main)] md:justify-self-end md:self-center dark:bg-[var(--div-bg-dark)]">
                {k.durasi}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}