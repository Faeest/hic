"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Warning } from "@phosphor-icons/react";

/**
 * Styled confirmation dialog. Replaces `window.confirm` so destructive actions
 * match the admin panel instead of the browser's native alert.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  busy = false,
  destructive = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-sm border border-ink/15 bg-paper p-6 shadow-[0_24px_60px_-24px_rgba(28,21,18,0.55)] dark:border-white/15 dark:bg-[#181512] sm:p-7"
          >
            <div className="flex items-start gap-3">
              <span
                className={
                  destructive
                    ? "grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-red-500/10 text-red-600 dark:text-red-400"
                    : "grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-ember/10 text-ember"
                }
              >
                <Warning size={20} weight="bold" />
              </span>
              <div className="min-w-0">
                <h2
                  id="confirm-title"
                  className="font-display text-xl font-semibold tracking-tight text-ink"
                >
                  {title}
                </h2>
                {description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="rounded-sm border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink disabled:opacity-50 dark:border-white/15"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className={
                  destructive
                    ? "rounded-sm bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                    : "rounded-sm bg-ember px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
                }
              >
                {busy ? "Memproses…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
