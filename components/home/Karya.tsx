"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { karya } from "@/data/karya";

export function Karya({ id }: { id: string }) {
  const [featured, ...rest] = karya;

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden bg-cream py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,150,6,0.14), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="IV"
            label="Karya"
            title={
              <>
                Dibuat bareng,{" "}
                <span className="text-ember">bukan baru digoreskan</span>.
              </>
            }
            sub="Proyek nyata hasil mentoring lintas divisi — dari web, desain, sampai perangkat fisik."
          />
        </div>

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
              className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-8 sm:aspect-[16/10] sm:p-10 lg:aspect-auto lg:min-h-[30rem]"
              style={{ background: featured.gradien }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-50 [background-size:22px_22px] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,transparent,rgba(0,0,0,0.28))]"
              />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="w-fit rounded-full bg-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white backdrop-blur-sm">
                    {featured.divisi} · {featured.tahun}
                  </span>
                  <h3 className="max-w-md font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {featured.judul}
                  </h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={20} weight="bold" />
                </span>
              </div>
              <p className="relative z-10 mt-4 max-w-lg text-base leading-relaxed text-white/90">
                {featured.deskripsi}
              </p>
            </div>
          </motion.a>

          {rest.map((k, i) => (
            <motion.a
              key={k.judul}
              href={`/divisi/${k.divisiSlug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.06 }}
              className="group relative block overflow-hidden rounded-[2rem]"
            >
              <div
                className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-7 sm:p-8"
                style={{ background: k.gradien }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 [background-size:20px_20px] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,transparent,rgba(0,0,0,0.24))]"
                />
                <div className="relative z-10">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/80">
                    {k.divisi} · {k.tahun}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                    {k.judul}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-white/85">{k.deskripsi}</p>
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
            <ArrowUpRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}