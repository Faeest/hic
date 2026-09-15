"use client";

import { motion } from "framer-motion";
import { UserCircle } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { divisiVars } from "@/lib/utils";
import type { Divisi } from "@/data/divisi";

export function MentorSection({ d }: { d: Divisi }) {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32" style={divisiVars(d)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full"
        style={{ background: `radial-gradient(circle, ${d.warna.terang}2e, transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="flex items-baseline gap-3 text-sm">
            <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
            <span className="font-medium text-ink-soft">Mentor</span>
          </p>
          <h2 className="mt-3 max-w-[14ch] font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Dipandu yang pernah di kursi yang sama.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {d.mentor.map((m, i) => (
            <motion.div
              key={m.nama}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              className="glass-panel group rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl text-white"
                style={{ background: i === 0 ? d.warna.utama : d.warna.terang }}
              >
                <UserCircle size={26} weight="fill" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                {m.nama}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-[var(--div-main)]">{m.fokus}</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-mono text-ink-faint">
                <span className="h-px w-6 bg-ink/15" aria-hidden />
                Mentor {d.nama}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}