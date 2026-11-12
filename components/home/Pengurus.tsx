"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { PengurusGroups } from "@/lib/content/pengurus";
import type { Pengurus as PengurusItem, Section, Site } from "@/lib/types";
import { cn } from "@/lib/utils";

function Portrait({
  p,
  size = "lg",
}: {
  p: PengurusItem;
  size?: "sm" | "lg";
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-sm border border-ink/10 bg-cream dark:bg-white/[0.03]"
      )}
    >
      {p.foto ? (
        <Image
          src={p.foto}
          alt={p.nama}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 33vw, 100vw" : "128px"}
          className="object-cover"
        />
      ) : (
        /* No photo yet — typographic, not a gradient placeholder */
        <div className="absolute inset-0 flex items-end p-5">
          <span
            className={cn(
              "font-display font-semibold tracking-tight text-ember",
              size === "lg" ? "text-5xl" : "text-3xl"
            )}
          >
            {p.inisial}
          </span>
        </div>
      )}
    </div>
  );
}

export function Pengurus({
  id,
  pengurus,
  section,
  site,
}: {
  id: string;
  pengurus: PengurusGroups;
  section: Section;
  site: Site;
}) {
  const { pembina, inti: pengurusInti, koordinator: koordinatorDivisi } = pengurus;
  if (!section.visible) return null;

  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index={section.index}
          label={section.label}
          title={section.title}
          accent={section.accent}
        />

        {/* Dosen Pembina */}
        {pembina && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-16"
          >
            <div className="surface flex flex-col items-center gap-6 bg-cream p-8 sm:flex-row sm:p-10">
              <div className="w-28 shrink-0 sm:w-32">
                <Portrait p={pembina} size="sm" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="rounded-sm border border-ember/25 px-2.5 py-1 text-xs font-medium text-ember">
                  {pembina.jabatan}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {pembina.nama}
                </h3>
                <p className="mt-2 max-w-lg text-base leading-relaxed text-ink-soft">
                  {pembina.deskripsi}
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm text-ink-faint">
                Periode {site.periodeKepengurusan}
              </span>
            </div>
          </motion.div>
        )}

        {/* Inti pengurus */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pengurusInti.map((p, i) => (
            <motion.div
              key={p.nama}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
            >
              <div className="surface overflow-hidden bg-paper">
                <Portrait p={p} />
                <div className="p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                      {p.nama}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap text-xs text-ember">
                      {p.jabatan}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {p.deskripsi}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Koordinator divisi */}
        <Reveal className="mt-20">
          <div className="mb-8 flex items-baseline gap-3 border-t border-ink/12 pt-6">
            <span className="text-sm text-ink-faint">
              Penanggung jawab divisi
            </span>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {koordinatorDivisi.map((k, i) => (
            <motion.div
              key={k.nama}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
              className="group flex items-center gap-4 border-t border-ink/12 pt-4"
            >
              <div className="w-16 shrink-0">
                <Portrait p={k} size="sm" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-display text-base font-semibold text-ink">
                  {k.nama}
                </h4>
                <p className="text-xs text-ember">
                  {k.jabatan}
                </p>
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
