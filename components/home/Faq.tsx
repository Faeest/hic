"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { SectionHead } from "@/components/ui/SectionHead";
import { faq } from "@/data/faq";
import { cn } from "@/lib/utils";

export function Faq({ id }: { id: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHead
          index="VI"
          label="FAQ"
          title="Sering ditanya, jawabannya di sini."
          accent="jawabannya di sini"
          align="center"
        />

        <div className="mt-14 flex flex-col">
          {faq.map((f, i) => {
            const active = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
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
                      <p className="pb-7 pl-12 pr-2 text-base leading-relaxed text-ink-soft sm:pl-[3.75rem]">
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