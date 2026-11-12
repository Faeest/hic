"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { SectionHead } from "@/components/ui/SectionHead";
import type { FaqItem, Section } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Faq({
  id,
  faq,
  section,
}: {
  id: string;
  faq: FaqItem[];
  section: Section;
}) {
  const [open, setOpen] = useState<number | null>(0);

  if (!section.visible) return null;

  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-[68ch] px-5 sm:px-8">
        <SectionHead
          index={section.index}
          label={section.label}
          title={section.title}
          accent={section.accent}
        />

        <div className="mt-12 flex flex-col">
          {faq.map((f, i) => {
            const active = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.03 }}
                className="border-b border-ink/10 first:border-t"
              >
                <button
                  type="button"
                  onClick={() => setOpen(active ? null : i)}
                  aria-expanded={active}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl font-semibold tracking-tight text-ink transition-colors duration-300 sm:text-2xl",
                        active && "text-ember"
                      )}
                    >
                      {f.pertanyaan}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: active ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 text-ink"
                  >
                    <Plus size={16} weight="bold" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[58ch] pb-7 pl-12 pr-2 text-base leading-relaxed text-ink-soft sm:pl-[3.75rem]">
                        {f.jawaban}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
