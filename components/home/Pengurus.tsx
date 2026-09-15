"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pengurusInti, koordinatorDivisi, pembina } from "@/data/pengurus";

function Avatar({ inisial, gradien, size = "lg" }: { inisial: string; gradien: string; size?: "sm" | "lg" }) {
  return (
    <div
      className={size === "lg" ? "relative aspect-square w-full overflow-hidden" : "relative aspect-square w-full overflow-hidden rounded-2xl"}
      style={{ background: gradien }}
      aria-hidden
    >
      <div className="absolute inset-0 flex items-end p-5">
        <span
          className={
            size === "lg"
              ? "font-display text-5xl font-bold tracking-tight text-white/90"
              : "font-display text-3xl font-bold tracking-tight text-white/90"
          }
        >
          {inisial}
        </span>
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
      <div className="absolute inset-0 opacity-40 [background-size:18px_18px] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)]" />
    </div>
  );
}

export function Pengurus({ id }: { id: string }) {
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index="III"
          label="Pengurus"
          title={
            <>
              Orang-orang di balik{" "}
              <span className="text-ember">kursi</span>.
            </>
          }
          sub="Struktur inti HIC ramping: pembina mendampingi, tiga kursi utama memimpin, dan penanggung jawab divisi menjaga ritme belajar."
        />

        {/* Dosen Pembina */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <div className="glass-panel flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] p-8 sm:flex-row sm:p-10">
            <div className="w-28 shrink-0 sm:w-32">
              <Avatar inisial={pembina.inisial} gradien={pembina.gradien} size="sm" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="rounded-full bg-ember/10 px-3.5 py-1.5 text-xs font-medium text-ember">
                {pembina.jabatan}
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {pembina.nama}
              </h3>
              <p className="mt-2 max-w-lg text-base leading-relaxed text-ink-soft">
                {pembina.deskripsi}
              </p>
            </div>
            <span className="shrink-0 font-mono text-sm text-ink-faint">Periode 2025–2026</span>
          </div>
        </motion.div>

        {/* Inti pengurus */}
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {pengurusInti.map((p, i) => {
            const isLead = i === 0;
            return (
              <motion.div
                key={p.nama}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className={
                  isLead
                    ? "lg:row-span-2 lg:-mt-6"
                    : "lg:mt-6"
                }
              >
                <div
                  className={
                    isLead
                      ? "glass-panel overflow-hidden rounded-[2rem]"
                      : "glass-panel overflow-hidden rounded-[2rem]"
                  }
                >
                  <Avatar inisial={p.inisial} gradien={p.gradien} />
                  <div className="p-7">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
                        {p.nama}
                      </h3>
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-ember/10 px-3.5 py-1.5 text-xs font-medium text-ember">
                        {p.jabatan}
                      </span>
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">
                      {p.deskripsi}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Koordinator divisi */}
        <Reveal className="mt-20">
          <div className="mb-8 flex items-baseline gap-3">
            <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
            <span className="text-sm font-medium text-ink-faint">Penanggung Jawab Divisi</span>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {koordinatorDivisi.map((k, i) => (
            <motion.div
              key={k.nama}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group flex items-center gap-5 rounded-3xl border border-ink/10 bg-cream p-5 transition-colors duration-300 hover:border-ember/40 hover:bg-peach"
            >
              <div className="w-20 shrink-0">
                <Avatar inisial={k.inisial} gradien={k.gradien} size="sm" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-display text-lg font-semibold text-ink">
                  {k.nama}
                </h4>
                <p className="text-sm font-medium text-ember">{k.jabatan}</p>
                <p className="mt-1 text-xs leading-snug text-ink-soft">
                  {k.deskripsi}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}