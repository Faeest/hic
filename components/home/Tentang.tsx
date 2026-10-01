"use client";

import { Target, FlagCheckered } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { club } from "@/data/club";
import type { TentangBlock } from "@/lib/types";

export function Tentang({ block }: { block: TentangBlock }) {
  return (
    <section id={block.id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              index={block.index}
              label={block.label}
              title={block.title}
              accent={block.accent}
            />
            <Reveal delay={0.2} className="mt-8">
              <ul className="flex flex-wrap gap-2.5">
                {block.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-ember/20 bg-peach px-4 py-2 text-sm font-medium text-ember"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="flex flex-col gap-8">
            {block.paragraphs.map((p, i) => (
              <Reveal key={i}>
                <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">
                  {p}
                </p>
              </Reveal>
            ))}

            {/* Visi */}
            <Reveal delay={0.1}>
              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
                <div className="relative flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember text-white">
                    <Target size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {block.visiTitle}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
                      {club.visi[0]}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 7 Pilar Misi */}
            <Reveal delay={0.18}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-peach text-ember">
                    <FlagCheckered size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {block.pilarTitle}
                    </h3>
                    <p className="text-sm text-ink-soft">
                      {block.pilarSubtitle}
                    </p>
                  </div>
                </div>
                <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                  {club.pilarMisi.map((p, i) => (
                    <div
                      key={p.nama}
                      className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream p-4 transition-colors duration-300 hover:border-ember/40 dark:border-white/10 dark:bg-white/[0.03]"
                    >
                      <span className="font-mono text-sm text-ember">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-semibold text-ink">
                          {p.nama}
                        </h4>
                        <p className="mt-0.5 text-xs leading-snug text-ink-soft">
                          {p.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="font-mono text-sm text-ink-faint">
                est. 1996 ·{" "}
                <span className="text-ember">{club.namaLengkap}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
