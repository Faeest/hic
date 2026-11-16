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

function Nrp({ p }: { p: PengurusItem }) {
  if (!p.nrp) return null;
  return (
    <p className="mt-0.5 font-mono text-[11px] tracking-tight text-ink-faint">
      {p.nrp}
    </p>
  );
}

function Portrait({
  p,
  size = "lg",
  zoom = false,
}: {
  p: PengurusItem;
  size?: "sm" | "lg";
  zoom?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-ink/10 bg-cream dark:bg-white/[0.03]",
        size === "sm" ? "aspect-square" : "aspect-[4/3]"
      )}
    >
      {p.foto ? (
        <Image
          src={p.foto}
          alt={p.nama}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 33vw, 100vw" : "160px"}
          className={cn(
            "object-cover",
            zoom &&
              "transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:scale-100 motion-reduce:transition-none"
          )}
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
        className="group flex items-start gap-4 border-t border-ink/12 pt-4 transition-colors duration-300 hover:border-ink/30"
      >
        <div className="w-14 shrink-0">
          <Portrait p={p} size="sm" zoom />
        </div>
        <div className="min-w-0">
          <h4 className="font-display text-base font-semibold leading-tight text-ink">
            {p.nama}
          </h4>
          <p className="mt-0.5 text-xs font-medium text-ember">{p.jabatan}</p>
          <Nrp p={p} />
          <p className="mt-1 text-xs leading-snug text-ink-soft">{p.deskripsi}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...FADE}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group"
    >
      <div className="overflow-hidden border border-ink/13 bg-paper transition-colors duration-300 group-hover:border-ember/40">
        <Portrait p={p} zoom />
        <div className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
              {p.nama}
            </h3>
            <span className="shrink-0 whitespace-nowrap text-xs font-medium text-ember">
              {p.jabatan}
            </span>
          </div>
          <Nrp p={p} />
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.deskripsi}</p>
        </div>
      </div>
    </motion.div>
  );
}

/** Group heading: label and description come from data, never from the code. */
function GroupHead({
  label,
  deskripsi,
  first = false,
}: {
  label: string;
  deskripsi: string;
  first?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/12 pt-6",
        first ? "mt-14" : "mt-16"
      )}
    >
      <h3 className="text-sm font-medium text-ember">{label}</h3>
      {deskripsi && <p className="text-sm text-ink-faint">{deskripsi}</p>}
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
  if (!section.visible) return null;

  const { pembina, inti, grup } = pengurus;

  if (pembina.length === 0 && inti.anggota.length === 0 && grup.length === 0) {
    return null;
  }

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
        {pembina.length > 0 && (
          <div className="mt-16 flex flex-col gap-4">
            {pembina.map((p) => (
              <motion.div {...FADE} key={p.nama} className="group">
                <div className="flex flex-col items-center gap-6 border border-ink/13 bg-cream p-8 transition-colors duration-300 group-hover:border-ember/30 sm:flex-row sm:p-10">
                  <div className="w-28 shrink-0 sm:w-32">
                    <Portrait p={p} size="sm" zoom />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="border border-ember/25 px-2.5 py-1 text-xs font-medium text-ember">
                      {p.jabatan}
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {p.nama}
                    </h3>
                    <p className="mt-2 max-w-lg text-base leading-relaxed text-ink-soft">
                      {p.deskripsi}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-ink-faint">
                    Periode {site.periodeKepengurusan}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* BPH — fixed group, copy comes from the database */}
        {inti.anggota.length > 0 && (
          <>
            <GroupHead
              label={inti.label}
              deskripsi={inti.deskripsi}
              first
            />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inti.anggota.map((p, i) => (
                <PersonCard key={p.nama} p={p} delay={i * 0.05} />
              ))}
            </div>
          </>
        )}

        {/* Admin-defined groups */}
        {grup.map((g, gi) => (
          <Reveal key={g.slug}>
            <GroupHead
              label={g.label}
              deskripsi={g.deskripsi}
              first={gi === 0 && inti.anggota.length === 0}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.anggota.map((p, i) => (
                <PersonCard
                  key={`${p.nama}-${p.jabatan}`}
                  p={p}
                  delay={i * 0.04}
                  compact
                />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
