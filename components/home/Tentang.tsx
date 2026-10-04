"use client";

import { Target, FlagCheckered } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Section, Site } from "@/lib/types";

export function Tentang({ id, site, section }: { id: string; site: Site; section: Section }) {
  if (!section.visible) return null;
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              index={section.index}
              label={section.label}
              title={section.title}
              accent={section.accent}
            />
            <Reveal delay={0.2} className="mt-8">
              <ul className="flex flex-wrap gap-2.5">
                {site.tentangTags.map((tag) => (
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
            <Reveal>
              <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">
                {site.tentangIntro}
              </p>
            </Reveal>

            {/* Visi */}
            <Reveal delay={0.1}>
              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
                <div className="relative flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember text-white">
                    <Target size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      Visi
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
                      {site.visi[0]}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Pilar Misi */}
            <Reveal delay={0.18}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-peach text-ember">
                    <FlagCheckered size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {site.pilarMisi.length} Pilar Misi
                    </h3>
                    <p className="text-sm text-ink-soft">
                      Arah kerja kepengurusan periode {site.periodeKepengurusan}
                    </p>
                  </div>
                </div>
                <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                  {site.pilarMisi.map((p, i) => (
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
                est. {site.tahunBerdiri} ·{" "}
                <span className="text-ember">{site.namaLengkap}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
