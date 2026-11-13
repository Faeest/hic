"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { PengurusGroups } from "@/lib/content/pengurus";
import type { Pengurus as PengurusItem, Section, Site } from "@/lib/types";
import { cn } from "@/lib/utils";

const FADE = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/** Year range of a period string, tolerant of 2025/2026 and 2025–2026 alike. */
function periodYears(value?: string): string {
  const years = (value ?? "").match(/\d{4}/g);
  return years ? years.slice(0, 2).join("-") : "";
}

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
        "relative w-full overflow-hidden rounded-sm border border-ink/10 bg-cream dark:bg-white/[0.03]",
        size === "sm" ? "aspect-square" : "aspect-[4/3]"
      )}
    >
      {p.foto ? (
        <Image
          src={p.foto}
          alt={p.nama}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 33vw, 100vw" : "160px"}
          className="object-cover"
        />
      ) : (
        /* Initials are centred: a bottom-left mark reads as a broken layout. */
        <div className="absolute inset-0 grid place-items-center">
          <span
            className={cn(
              "font-display font-semibold tracking-tight text-ember",
              size === "lg" ? "text-4xl" : "text-2xl"
            )}
          >
            {p.inisial}
          </span>
        </div>
      )}
    </div>
  );
}

function PersonCard({
  p,
  delay = 0,
  compact = false,
}: {
  p: PengurusItem;
  delay?: number;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <motion.div
        {...FADE}
        transition={{ duration: 0.4, ease: "easeOut", delay }}
        className="flex items-start gap-4 border-t border-ink/12 pt-4"
      >
        <div className="w-14 shrink-0">
          <Portrait p={p} size="sm" />
        </div>
        <div className="min-w-0">
          <h4 className="font-display text-base font-semibold leading-tight text-ink">
            {p.nama}
          </h4>
          <p className="mt-0.5 text-xs font-medium text-ember">{p.jabatan}</p>
          <p className="mt-1 text-xs leading-snug text-ink-soft">{p.deskripsi}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...FADE} transition={{ duration: 0.5, ease: "easeOut", delay }}>
      <div className="surface overflow-hidden bg-paper">
        <Portrait p={p} />
        <div className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
              {p.nama}
            </h3>
            <span className="shrink-0 whitespace-nowrap text-xs font-medium text-ember">
              {p.jabatan}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.deskripsi}</p>
        </div>
      </div>
    </motion.div>
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
  if (!section.visible) return null;

  const current = periodYears(site.periodeKepengurusan);
  const inPeriod = (p: PengurusItem) => {
    const years = periodYears(p.periode);
    return !years || years === current;
  };

  const pembina = pengurus.pembina && inPeriod(pengurus.pembina) ? pengurus.pembina : null;
  const inti = pengurus.inti.filter(inPeriod);
  const biro = pengurus.biro.filter(inPeriod);
  const koordinator = pengurus.koordinator.filter(inPeriod);

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
          <motion.div {...FADE} className="mt-16">
            <div className="surface flex flex-col items-center gap-6 bg-cream p-8 sm:flex-row sm:p-10">
              <div className="w-28 shrink-0 sm:w-32">
                <Portrait p={pembina} size="sm" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="border border-ember/25 px-2.5 py-1 text-xs font-medium text-ember">
                  {pembina.jabatan}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {pembina.nama}
                </h3>
                <p className="mt-2 max-w-lg text-base leading-relaxed text-ink-soft">
                  {pembina.deskripsi}
                </p>
              </div>
              <span className="shrink-0 text-sm text-ink-faint">
                Periode {site.periodeKepengurusan}
              </span>
            </div>
          </motion.div>
        )}

        {/* BPH */}
        {inti.length > 0 && (
          <>
            <div className="mt-14 flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/12 pt-6">
              <h3 className="text-sm font-medium text-ember">Badan Pengurus Harian</h3>
              <p className="text-sm text-ink-faint">
                Mengurus organisasi: jadwal, kas, dan dokumen.
              </p>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inti.map((p, i) => (
                <PersonCard key={p.nama} p={p} delay={i * 0.05} />
              ))}
            </div>
          </>
        )}

        {/* Biro — data-driven; hidden when the period has none */}
        {biro.length > 0 && (
          <>
            <div className="mt-16 flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/12 pt-6">
              <h3 className="text-sm font-medium text-ember">Biro</h3>
              <p className="text-sm text-ink-faint">
                Mengurus mesin yang menjalankan kelas dan publikasinya.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {biro.map((p, i) => (
                <motion.div
                  key={p.nama}
                  {...FADE}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.04 }}
                  className="flex items-start gap-4 border-t border-ink/12 pt-4"
                >
                  <div className="w-14 shrink-0">
                    <Portrait p={p} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display text-base font-semibold leading-tight text-ink">
                      {p.nama}
                    </h4>
                    <p className="mt-0.5 text-xs font-medium text-ember">{p.jabatan}</p>
                    <p className="mt-1 text-xs leading-snug text-ink-soft">{p.deskripsi}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* PJ Divisi — external to the board */}
        {koordinator.length > 0 && (
          <>
            <Reveal className="mt-20">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/12 pt-6">
                <h3 className="text-sm font-medium text-ember">Penanggung jawab divisi</h3>
                <p className="text-sm text-ink-faint">
                  Diangkat oleh tiap divisi, bukan bagian dari BPH.
                </p>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {koordinator.map((p, i) => (
                <PersonCard key={p.nama} p={p} delay={i * 0.05} compact />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
