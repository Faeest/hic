"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Foto } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Full-screen viewer for one gallery moment. Arrow keys, the on-screen buttons,
 * a horizontal drag and the thumbnail strip all move between that moment's
 * photos; Escape closes.
 *
 * The scrim is a fixed near-black in both themes on purpose: the viewer is a
 * lightbox, not a themed surface, so white chrome stays legible in dark mode.
 */
export function GaleriLightbox({
  item,
  index,
  onIndex,
  onClose,
}: {
  item: Foto;
  index: number;
  onIndex: (next: number) => void;
  onClose: () => void;
}) {
  const images = item.images && item.images.length > 0 ? item.images : [item.src];
  const total = images.length;
  const safeIndex = Math.min(index, total - 1);
  const current = images[safeIndex];

  const reduce = useReducedMotion();
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    if (next === safeIndex) return;
    setDir(next > safeIndex ? 1 : -1);
    onIndex((next + total) % total);
  };

  const step = (delta: number) => go((safeIndex + delta + total) % total);

  // The key handler is registered once; it reads the latest state through refs
  // so moving between photos does not re-bind listeners on every slide.
  const stepRef = useRef(step);
  const closeRef = useRef(onClose);
  useEffect(() => {
    stepRef.current = step;
    closeRef.current = onClose;
  });

  const lenis = useLenis();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "ArrowLeft") stepRef.current(-1);
      if (e.key === "ArrowRight") stepRef.current(1);
    };
    document.addEventListener("keydown", onKey);
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [lenis]);

  const slide = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0b0908]"
      role="dialog"
      aria-modal="true"
      aria-label={item.judul}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold">
            {item.judul}
          </p>
          {item.keterangan && (
            <p className="truncate text-sm text-white/60">{item.keterangan}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {total > 1 && (
            <span className="font-mono text-xs tabular-nums text-white/60">
              {safeIndex + 1} / {total}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-10 w-10 place-items-center rounded-sm border border-white/25 bg-white/5 text-white/80 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {total > 1 && (
          <button
            type="button"
            onClick={() => go((safeIndex - 1 + total) % total)}
            aria-label="Sebelumnya"
            className="absolute left-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white/85 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/20 hover:text-white sm:left-6"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
        )}

        <div className="relative h-full w-full max-w-5xl overflow-hidden">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: reduce ? 0.15 : 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              drag={total > 1 && !reduce ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go((safeIndex + 1) % total);
                else if (info.offset.x > 60) go((safeIndex - 1 + total) % total);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={current}
                alt={`${item.judul} — foto ${safeIndex + 1}`}
                fill
                sizes="100vw"
                className="pointer-events-none object-contain"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => go((safeIndex + 1) % total)}
            aria-label="Berikutnya"
            className="absolute right-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white/85 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/20 hover:text-white sm:right-6"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto px-5 pb-5 pt-1">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => go(i)}
              aria-label={`Foto ${i + 1}`}
              aria-current={i === safeIndex}
              className={cn(
                "relative h-11 w-16 shrink-0 overflow-hidden rounded-xs border transition-all duration-300",
                i === safeIndex
                  ? "border-white opacity-100"
                  : "border-white/20 opacity-50 hover:opacity-90"
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
