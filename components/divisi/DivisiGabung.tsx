"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { divisiVars } from "@/lib/utils";
import type { Divisi } from "@/data/divisi";

export function DivisiGabung({ d }: { d: Divisi }) {
  return (
    <section className="relative bg-paper py-24 sm:py-28" style={divisiVars(d)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-[var(--div-main)] px-6 py-16 sm:px-12 sm:py-20 lg:px-16"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_100%_at_0%_0%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(50%_80%_at_100%_100%,rgba(251,150,6,0.55),transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 [background-size:24px_24px] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)]"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-baseline gap-3 text-sm text-white/70">
                <span className="font-mono">{d.angka}</span>
                <span className="h-px w-6 self-center bg-white/40" aria-hidden />
                <span className="font-medium">Divisi {d.nama}</span>
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Tertarik nyoba {d.nama}?
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
                Kelas perdana terbuka untuk siapa pun, tanpa syarat apa pun.
                Cukup datang dan penasaran.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3.5">
              <Link
                href="/#gabung"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-semibold text-ember transition-transform duration-300 hover:scale-[1.03]"
              >
                Hubungi HIC
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/#divisi"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                Semua divisi
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}