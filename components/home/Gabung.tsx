"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={cardRef} className="relative overflow-hidden rounded-[2.5rem] bg-ember">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 [background-size:26px_26px] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)]"
          />
          {/* Growing shape — springs in on in-view, drifts with scroll */}
          <motion.div
            aria-hidden
            style={{ y: blobY }}
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 sm:-right-32 sm:-top-32 sm:h-[30rem] sm:w-[30rem]"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 48, damping: 16 }}
              className="h-full w-full rounded-full bg-mango"
            />
          </motion.div>

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
        <div className="glass-panel shadow-none! flex flex-col items-center justify-between gap-6 rounded-[2rem] px-8 py-10 text-center sm:flex-row sm:text-left">
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
      <div className="my-42 -rotate-[0.6deg] scale-[1.02] border-y border-white/10 bg-flare py-6 sm:py-8">
        <Marquee
          items={marqueeWords}
          stretch
          speed={44}
          itemClassName="font-display text-5xl font-bold tracking-tight text-white sm:text-7xl"
        />
      </div>
    </section>
  );
}