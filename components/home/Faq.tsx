"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { SectionHead } from "@/components/ui/SectionHead";
import { faq } from "@/data/faq";
import { cn } from "@/lib/utils";
import type { FaqBlock } from "@/lib/types";

export function Faq({ block }: { block: FaqBlock }) {
  const [open, setOpen] = useState<number | null>(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id={block.id} className="relative scroll-mt-24 overflow-hidden bg-paper py-24 sm:py-32">
      <div ref={wrapRef} className="relative mx-auto max-w-4xl px-5 sm:px-8">
        {/* Growing shape — soft sun blooming behind the headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 sm:h-96 sm:w-96"
        >
          <motion.div style={{ y: blobY }} className="h-full w-full">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 50, damping: 17 }}
              className="h-full w-full rounded-full bg-mango/30 blur-2xl dark:bg-mango/20"
            />
          </motion.div>
        </div>
        <SectionHead
          index={block.index}
          label={block.label}
          title={block.title}
          accent={block.accent}
          align="center"
          className="relative"
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