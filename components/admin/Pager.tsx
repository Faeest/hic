"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * Page buttons for admin lists that are already loaded in full.
 *
 * The public blog uses `components/blog/Pagination.tsx` instead: that one is a
 * server component of links, this one needs click handlers.
 */
export function Pager({
  page,
  pages,
  onPage,
  label = "Navigasi halaman",
  className,
}: {
  page: number;
  pages: number;
  onPage: (page: number) => void;
  label?: string;
  className?: string;
}) {
  if (pages <= 1) return null;

  const slots = pageWindow(page, pages);

  const item =
    "grid h-8 min-w-8 place-items-center rounded-sm border px-2 text-xs transition-colors";
  const idle = cn(
    item,
    "border-ink/15 text-ink-soft hover:border-ember/40 hover:text-ember dark:border-white/15"
  );
  const disabled = cn(
    item,
    "border-ink/10 text-ink-faint/60 dark:border-white/10"
  );

  return (
    <nav aria-label={label} className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
        className={page > 1 ? idle : disabled}
      >
        <CaretLeft size={14} weight="bold" />
      </button>

      {slots.map((slot, i) =>
        slot === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-xs text-ink-faint">
            …
          </span>
        ) : slot === page ? (
          <span
            key={slot}
            aria-current="page"
            className={cn(item, "border-ember bg-ember text-white")}
          >
            {slot}
          </span>
        ) : (
          <button
            key={slot}
            type="button"
            onClick={() => onPage(slot)}
            aria-label={`Halaman ${slot}`}
            className={idle}
          >
            {slot}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        aria-label="Halaman berikutnya"
        className={page < pages ? idle : disabled}
      >
        <CaretRight size={14} weight="bold" />
      </button>
    </nav>
  );
}
