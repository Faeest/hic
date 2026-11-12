"use client";

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
            <Reveal delay={0.1} className="mt-8">
              <p className="text-sm leading-relaxed text-ink-soft">
                {site.tentangTags.join(" · ")}
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-10">
            <Reveal>
              <p className="max-w-[62ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
                {site.tentangIntro}
              </p>
            </Reveal>

            {/* Visi — a statement with a rule, not a card */}
            <Reveal delay={0.06}>
              <div className="border-t border-ink/12 pt-6">
                <h3 className="text-sm font-medium text-ember">
                  Visi
                </h3>
                <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-soft sm:text-lg">
                  {site.visi[0]}
                </p>
              </div>
            </Reveal>

            {/* Pilar Misi — ruled list, numbers in the margin */}
            <Reveal delay={0.1}>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/12 pt-6">
                  <h3 className="text-sm font-medium text-ember">
                    {site.pilarMisi.length} pilar misi
                  </h3>
                  <p className="text-sm text-ink-soft">
                    Periode {site.periodeKepengurusan}
                  </p>
                </div>
                <div className="mt-4 grid gap-x-8 gap-y-0 sm:grid-cols-2">
                  {site.pilarMisi.map((p, i) => (
                    <div
                      key={p.nama}
                      className="flex items-baseline gap-3 border-b border-ink/10 py-3"
                    >
                      <span className="font-mono text-xs text-ink-faint">
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

            <Reveal delay={0.14}>
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
