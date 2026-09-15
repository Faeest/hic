"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ChatCircleDots } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { club } from "@/data/club";

const marqueeWords = [
  "Belajar",
  "Berkarya",
  "Bertumbuh",
  "Mengajar",
  "Bereksperimen",
];

export function Gabung({ id }: { id: string }) {
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ember">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_100%_at_0%_0%,rgba(251,150,6,0.5),transparent_50%),radial-gradient(50%_80%_at_100%_100%,rgba(251,150,6,0.45),transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 [background-size:26px_26px] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)]"
          />

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="flex items-baseline gap-3 text-sm text-white/70">
                <span className="font-mono">VI</span>
                <span className="h-px w-6 self-center bg-white/40" aria-hidden />
                <span className="font-medium">Tertarik gabung?</span>
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Mulai dari langkah kecil yang penasaran.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                Tidak perlu jadi jagoan lebih dulu — di HIC semua orang sedang
                belajar. Datanglah ke sekret, ikut kelas perdana, dan lihat
                sendiri dari dekat.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href={`mailto:${club.kontak.email}`}
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-semibold text-ember transition-transform duration-300 hover:scale-[1.03]"
              >
                Hubungi kami
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={`mailto:${club.kontak.email}?subject=Pendaftaran%20anggota%20HIC`}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                <ChatCircleDots size={18} weight="duotone" />
                Kirim formulir minat
              </a>
            </motion.div>

            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-white/20 pt-8">
              {club.statistik.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2.5">
                  <span className="font-display text-2xl font-semibold text-white">
                    {s.angka}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Opini strip */}
      <Reveal className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
        <div className="glass-panel flex flex-col items-center justify-between gap-6 rounded-[2rem] px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
              “Di sini saya belajar React dari teman sekamar, bukan dari dosen.”
            </p>
            <p className="mt-2 text-sm uppercase tracking-wider text-ink-faint">
              Dimas Arya · Alumnus Divisi Web
            </p>
          </div>
          <div className="shrink-0">
            <p className="text-sm text-ink-faint">Testimoni anggota</p>
          </div>
        </div>
      </Reveal>

      {/* Marquee band — single seamless row */}
      <div className="mt-16 -rotate-[0.6deg] scale-[1.02] border-y border-white/10 bg-flare py-5 sm:py-7">
        <Marquee
          items={marqueeWords}
          squeeze
          speed={44}
          itemClassName="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl"
        />
      </div>
    </section>
  );
}