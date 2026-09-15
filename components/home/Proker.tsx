"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Wallet } from "@phosphor-icons/react";
import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { proker } from "@/data/proker";

const dots =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1.4' fill='%23ffffff' fill-opacity='0.28'/%3E%3C/svg%3E\")";

export function Proker({ id }: { id: string }) {
  const [featured, ...rest] = proker;

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden bg-cream py-24 sm:py-32">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-x-0 bottom-0 h-[18rem] opacity-40"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index="IV"
          label="Program Kerja"
          title="Agenda nyata, bukan sekadar rencana."
          accent="bukan sekadar rencana"
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {/* Featured large card */}
          <motion.a
            href={`/divisi/${featured.divisiSlug}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block overflow-hidden rounded-[2rem] lg:col-span-2 lg:row-span-2"
          >
            <div
              className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-8 sm:aspect-[16/10] sm:p-10 lg:aspect-auto lg:h-full"
              style={{ background: featured.warna }}
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundImage: dots, backgroundSize: "20px 20px" }}
              />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="w-fit rounded-full bg-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white backdrop-blur-sm">
                    {featured.kategori} · {featured.tahun}
                  </span>
                  <h3 className="max-w-md font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {featured.judul}
                  </h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#1c1512] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={20} weight="bold" />
                </span>
              </div>
              <p className="relative z-10 mt-4 max-w-lg text-base leading-relaxed text-white/90">
                {featured.deskripsi}
              </p>
              <p className="relative z-10 mt-4 font-mono text-[11px] uppercase tracking-widest text-white/70">
                Perkiraan dana: {featured.dana}
              </p>
            </div>
          </motion.a>

          {rest.map((p, i) => (
            <motion.a
              key={p.judul}
              href={`/divisi/${p.divisiSlug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.06 }}
              className="group relative block overflow-hidden rounded-[2rem]"
            >
              <div
                className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-7 sm:p-8"
                style={{ background: p.warna }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ backgroundImage: dots, backgroundSize: "20px 20px" }}
                />
                <div className="relative z-10">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/80">
                    {p.kategori} · {p.tahun}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                    {p.judul}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-white/85">{p.deskripsi}</p>
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/70">
                    <Wallet size={13} weight="duotone" />
                    {p.dana}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href="#divisi"
            className="inline-flex items-center gap-2 font-medium text-ember transition-colors hover:text-flare"
          >
            Lihat kurikulum tiap divisi
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}