"use client";

import { Highlighter } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { club } from "@/data/club";

export function Tentang({ id }: { id: string }) {
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              index="I"
              label="Tentang HIC"
              title={
                <>
                  Belajar dari yang{" "}
                  <span className="text-ember">baru saja belajar</span>.
                </>
              }
              sub={club.about.intro}
            />
            <Reveal delay={0.2} className="mt-8">
              <ul className="flex flex-wrap gap-2.5">
                {[
                  "Peer mentoring",
                  "Kelas kecil",
                  "Lintas jurusan",
                  "Proyek nyata",
                ].map((tag) => (
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
            {club.about.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-peach p-8 sm:p-10 dark:border-white/10">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-flare/10 blur-2xl" aria-hidden />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember/10 text-ember">
                      <Highlighter size={22} weight="duotone" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">
                        Filosofi kami
                      </h3>
                      <p className="mt-1.5 max-w-md text-base leading-relaxed text-ink-soft">
                        Siapa pun boleh mengajar. Tugas anggota senior adalah
                        menjaga api rasa ingin tahu tetap menyala.
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 font-mono text-sm text-ink-faint">
                    est. 2018 ·{" "}
                    <span className="text-ember">{club.statistik[1].angka} anggota</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}