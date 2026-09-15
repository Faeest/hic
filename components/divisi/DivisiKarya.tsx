"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Wallet } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { divisiVars } from "@/lib/utils";
import { getProker } from "@/data/proker";
import type { Divisi } from "@/data/divisi";

export function DivisiProker({ d }: { d: Divisi }) {
  const items = getProker(d.slug);

  if (items.length === 0) return null;

  return (
    <section className="relative bg-paper py-24 sm:py-32" style={divisiVars(d)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="flex items-baseline gap-3 text-sm">
                <span className="font-mono text-[var(--div-main)]">{d.angka}</span>
                <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
                <span className="font-medium text-ink-soft">Program kerja divisi</span>
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Agenda yang menyentuh {d.nama}.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.article
              key={p.judul}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              className="group relative block overflow-hidden rounded-3xl"
            >
              <div
                className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-6 sm:p-7"
                style={{ background: p.warna }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1.4' fill='%23ffffff' fill-opacity='0.28'/%3E%3C/svg%3E\")",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/80">
                      {p.kategori} · {p.tahun}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={16} weight="bold" />
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white">
                    {p.judul}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-white/85">
                    {p.deskripsi}
                  </p>
                  <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/70">
                    <Wallet size={13} weight="duotone" />
                    {p.dana}
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