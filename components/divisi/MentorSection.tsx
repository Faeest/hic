"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { divisiVars } from "@/lib/utils";
import type { Divisi } from "@/lib/types";

export function MentorSection({ d }: { d: Divisi }) {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32" style={divisiVars(d)}>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm font-medium text-[var(--div-main)]">
            Mentor
          </p>
          <h2 className="mt-3 max-w-[16ch] font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Diajar kakak tingkat yang tahun lalu duduk di kelas yang sama.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {d.mentor.map((m, i) => (
            <motion.div
              key={m.nama}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
              className="border-t border-ink/12 py-5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {m.nama}
                  </h3>
                  <p className="mt-0.5 text-sm text-ink-soft">{m.fokus}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
