"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { divisiVars } from "@/lib/utils";
import { getKarya } from "@/data/karya";
import type { Divisi } from "@/data/divisi";

export function DivisiKarya({ d }: { d: Divisi }) {
  const karya = getKarya(d.slug);

  if (karya.length === 0) return null;

  return (
    <section className="relative bg-paper py-24 sm:py-32" style={divisiVars(d)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="flex items-baseline gap-3 text-sm">
                <span className="font-mono text-[var(--div-main)]">{d.angka}</span>
                <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
                <span className="font-medium text-ink-soft">Contoh karya</span>
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Bukti dari meja belajar.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {karya.map((k, i) => (
            <motion.article
              key={k.judul}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              className="group relative block overflow-hidden rounded-3xl"
            >
              <div
                className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-6 sm:p-7"
                style={{ background: k.gradien }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 [background-size:20px_20px] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,transparent,rgba(0,0,0,0.26))]"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/80">
                      {k.tahun}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={16} weight="bold" />
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white">
                    {k.judul}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-white/85">
                    {k.deskripsi}
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-white/60">
                    {k.tim.join(" · ")}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}