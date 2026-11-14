"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Foto } from "@/lib/types";

/**
 * Full-screen viewer for one gallery moment. Arrow keys and the on-screen
 * buttons move between that moment's photos; Escape closes.
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
  const current = images[Math.min(index, total - 1)];

  const lenis = useLenis();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index - 1 + total) % total);
      if (e.key === "ArrowRight") onIndex((index + 1) % total);
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
  }, [index, total, onIndex, onClose, lenis]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col bg-ink"
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
            <span className="font-mono text-xs text-white/60">
              {Math.min(index, total - 1) + 1} / {total}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-10 w-10 place-items-center rounded-sm border border-white/20 text-white/80 transition-colors hover:text-white"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
        {total > 1 && (
          <button
            type="button"
            onClick={() => onIndex((index - 1 + total) % total)}
            aria-label="Sebelumnya"
            className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-ink/40 text-white/80 transition-colors hover:text-white sm:left-6"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
        )}

        <div className="relative h-full w-full max-w-5xl">
          <Image
            key={current}
            src={current}
            alt={`${item.judul} — foto ${Math.min(index, total - 1) + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => onIndex((index + 1) % total)}
            aria-label="Berikutnya"
            className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-ink/40 text-white/80 transition-colors hover:text-white sm:right-6"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-5">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => onIndex(i)}
              aria-label={`Foto ${i + 1}`}
              aria-current={i === index}
              className={
                i === index
                  ? "h-1.5 w-6 rounded-full bg-white"
                  : "h-1.5 w-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/70"
              }
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
