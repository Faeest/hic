"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ChatCircleDots } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import type { Section, Site } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Gabung({
  id,
  site,
  section,
}: {
  id: string;
  site: Site;
  section: Section;
}) {
  if (!section.visible) return null;
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-md bg-ember">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 [background-size:26px_26px] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)]"
          />

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="flex items-baseline gap-3 text-sm text-white/80">
                <span className="font-mono">{section.index}</span>
                <span className="h-px w-6 self-center bg-white/50" aria-hidden />
                <span className="font-medium">{section.label}</span>
              </p>
              <h2 className="mt-4 max-w-[16ch] font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {section.title}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
                {site.ctaGabung.body}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href={site.ctaGabung.primaryHref || `mailto:${site.kontak.email}`}
                className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-8 py-4 text-base font-semibold text-ember transition-colors duration-300 hover:bg-peach"
              >
                {site.ctaGabung.primaryLabel}
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={
                  site.ctaGabung.secondaryHref ||
                  `mailto:${site.kontak.email}?subject=Pendaftaran%20anggota%20HIC`
                }
                className="inline-flex items-center gap-2.5 rounded-sm border border-white/50 px-8 py-4 text-base font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                <ChatCircleDots size={18} weight="duotone" />
                {site.ctaGabung.secondaryLabel}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimoni — one quote or several, same block */}
      {site.testimoni.length > 0 && (
        <Reveal className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
          <div className="border-t border-ink/12 pt-6">
            <p className="text-sm text-ink-faint">Testimoni anggota</p>
            <div
              className={cn(
                "mt-5 grid gap-x-8 gap-y-6",
                site.testimoni.length > 1 && "sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {site.testimoni.map((t, i) => (
                <figure key={`${t.nama}-${i}`} className="border-l-2 border-ember/30 pl-4">
                  <blockquote className="font-display text-lg leading-snug text-ink">
                    “{t.teks}”
                  </blockquote>
                  <figcaption className="mt-2 text-sm text-ink-faint">
                    {t.nama}
                    {t.peran ? ` · ${t.peran}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
