"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Wallet } from "@phosphor-icons/react";
import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import type { Proker as ProkerItem, Section } from "@/lib/types";

const dots =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1.4' fill='%23ffffff' fill-opacity='0.28'/%3E%3C/svg%3E\")";

export function Proker({
  id,
  proker,
  section,
}: {
  id: string;
  proker: ProkerItem[];
  section: Section;
}) {
  if (!section.visible) return null;
  const [featured, ...rest] = proker;
  if (!featured) return null;

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
          index={section.index}
          label={section.label}
          title={section.title}
          accent={section.accent}
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {/* Featured large card */}
          <motion.a
            href={`/divisi/${featured.divisiSlug}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative block overflow-hidden rounded-sm lg:col-span-2 lg:row-span-2"
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
                  <span className="w-fit bg-black/20 px-2.5 py-1 text-xs text-white">
                    {featured.kategori} · {featured.tahun}
                  </span>
                  <h3 className="max-w-md font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {featured.judul}
                  </h3>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#1c1512] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight size={20} weight="bold" />
                </span>
              </div>
              <p className="relative z-10 mt-4 max-w-lg text-base leading-relaxed text-white/90">
                {featured.deskripsi}
              </p>
              <p className="relative z-10 mt-4 text-xs text-white/70">
                Perkiraan dana: {featured.dana}
              </p>
            </div>
          </motion.a>

          {rest.map((p, i) => (
            <motion.a
              key={p.judul}
              href={`/divisi/${p.divisiSlug}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 + i * 0.05 }}
              className="group relative block overflow-hidden rounded-sm"
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
                  <span className="text-xs text-white/85">
                    {p.kategori} · {p.tahun}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                    {p.judul}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-white/85">{p.deskripsi}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-white/70">
                    <Wallet size={13} weight="duotone" />
                    {p.dana}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <Reveal className="mt-12">
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
