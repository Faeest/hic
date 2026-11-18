"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Crosshair, X } from "@phosphor-icons/react";
import { ImageField } from "./ImageField";
import { cropStyle, DEFAULT_CROP, MAX_ZOOM, parseCrop } from "@/lib/media/focus";
import type { FotoCrop } from "@/lib/types";
import { cn } from "@/lib/utils";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** The frames a pengurus portrait appears in, used when no `frames` is given. */
const PORTRAIT_FRAMES = [
  { className: "aspect-[4/3] w-40", caption: "Kartu BPH" },
  { className: "aspect-square w-24", caption: "Kartu ringkas" },
  { className: "aspect-square w-14", caption: "PJ divisi" },
];

/**
 * Image field with a focal-point editor.
 *
 * The URL is handled by `ImageField` (upload, media picker, paste) and lands in
 * the hidden input named `name`. The crop is a separate hidden input named
 * `cropName`, because it is a separate jsonb column. The editor previews the
 * frames the image actually appears in (`frames`), so what the admin sees is
 * what the page renders.
 */
export function FocusField({
  label,
  name,
  cropName,
  defaultValue,
  defaultCrop,
  folder = "site",
  hint,
  frames = PORTRAIT_FRAMES,
  editorAspect = "aspect-[4/3]",
}: {
  label: string;
  name: string;
  cropName: string;
  defaultValue?: string | null;
  defaultCrop?: unknown;
  folder?: string;
  hint?: string;
  /** Frames previewed under the editor, in the order they should appear. */
  frames?: { className: string; caption: string }[];
  /** Tailwind aspect class of the drag frame. */
  editorAspect?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [crop, setCrop] = useState<FotoCrop>(() => parseCrop(defaultCrop));
  const [draft, setDraft] = useState<FotoCrop>(crop);
  const [open, setOpen] = useState(false);

  // Opening always starts from the saved crop, never from an abandoned drag.
  const openEditor = () => {
    setDraft(crop);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <ImageField
        label={label}
        name={name}
        defaultValue={defaultValue}
        folder={folder}
        hint={hint}
        onChange={setUrl}
      />
      <input type="hidden" name={cropName} value={JSON.stringify(crop)} />

      {url && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
          >
            <Crosshair size={16} weight="bold" />
            Atur fokus
          </button>
          <span className="text-xs text-ink-faint">
            Geser dan perbesar foto agar wajah tetap terlihat di kartu.
          </span>
        </div>
      )}

      <CropDialog
        open={open}
        url={url}
        draft={draft}
        onDraft={setDraft}
        label={label}
        frames={frames}
        editorAspect={editorAspect}
        onSave={(next) => {
          setCrop(next);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

function CropDialog({
  open,
  url,
  draft,
  onDraft,
  label,
  frames,
  editorAspect,
  onSave,
  onClose,
}: {
  open: boolean;
  url: string;
  draft: FotoCrop;
  onDraft: (crop: FotoCrop) => void;
  label: string;
  frames: { className: string; caption: string }[];
  editorAspect: string;
  onSave: (crop: FotoCrop) => void;
  onClose: () => void;
}) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; crop: FotoCrop } | null>(null);

  // Escape closes; Lenis drives the window scroll, so it has to be stopped.
  const lenis = useLenis();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [open, onClose, lenis]);

  /**
   * Drag maps pixels to `object-position` percentages. The image is wider (or
   * taller) than the frame by `overflow`; moving the crop across that whole
   * overflow is 100%. Zoom multiplies the overflow, so the same drag covers
   * fewer percent when zoomed in — which is what makes it feel 1:1.
   */
  const onPointerMove = (e: React.PointerEvent) => {
    const start = drag.current;
    const frame = frameRef.current;
    if (!start || !frame || !natural) return;

    const rect = frame.getBoundingClientRect();
    const ratio = natural.w / natural.h;
    const frameRatio = rect.width / rect.height;
    const coverW = ratio > frameRatio ? rect.height * ratio : rect.width;
    const coverH = ratio > frameRatio ? rect.height : rect.width / ratio;
    const overflowX = Math.max(coverW - rect.width, 0) * start.crop.zoom;
    const overflowY = Math.max(coverH - rect.height, 0) * start.crop.zoom;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    onDraft({
      ...start.crop,
      x:
        overflowX > 1
          ? clamp(start.crop.x - (dx / overflowX) * 100, 0, 100)
          : start.crop.x,
      y:
        overflowY > 1
          ? clamp(start.crop.y - (dy / overflowY) * 100, 0, 100)
          : start.crop.y,
    });
  };

  const nudge = (dx: number, dy: number) => {
    onDraft({
      ...draft,
      x: clamp(draft.x + dx, 0, 100),
      y: clamp(draft.y + dy, 0, 100),
    });
  };

  const style = cropStyle(draft);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="crop-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Atur fokus ${label.toLowerCase()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-sm border border-ink/15 bg-paper shadow-[0_24px_60px_-24px_rgba(28,21,18,0.5)] dark:border-white/15"
          >
            <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4 dark:border-white/10">
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                Atur fokus {label.toLowerCase()}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
              <div
                ref={frameRef}
                tabIndex={0}
                aria-label="Geser foto untuk memilih fokus. Panah untuk menggeser satu persen."
                onPointerDown={(e) => {
                  if (!natural) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = { x: e.clientX, y: e.clientY, crop: draft };
                }}
                onPointerMove={onPointerMove}
                onPointerUp={() => {
                  drag.current = null;
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
                onKeyDown={(e) => {
                  const step = e.shiftKey ? 5 : 1;
                  if (e.key === "ArrowLeft") nudge(-step, 0);
                  else if (e.key === "ArrowRight") nudge(step, 0);
                  else if (e.key === "ArrowUp") nudge(0, -step);
                  else if (e.key === "ArrowDown") nudge(0, step);
                  else return;
                  e.preventDefault();
                }}
                className={cn(
                  "relative w-full cursor-grab touch-none select-none overflow-hidden rounded-sm border border-ink/10 bg-cream outline-none focus-visible:border-ember dark:border-white/10 dark:bg-white/[0.03] active:cursor-grabbing",
                  editorAspect
                )}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 640px, 100vw"
                  className="pointer-events-none object-cover"
                  style={style}
                  draggable={false}
                  unoptimized={!url.startsWith("/")}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
                    }
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex min-w-48 flex-1 items-center gap-3 text-sm text-ink-soft">
                  <span className="shrink-0">Perbesar</span>
                  <input
                    type="range"
                    min={1}
                    max={MAX_ZOOM}
                    step={0.05}
                    value={draft.zoom}
                    onChange={(e) =>
                      onDraft({ ...draft, zoom: Number(e.target.value) })
                    }
                    className="w-full accent-ember"
                  />
                  <span className="w-12 shrink-0 text-right font-mono text-xs text-ink-faint">
                    {draft.zoom.toFixed(2)}x
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onDraft({ ...DEFAULT_CROP })}
                  className="rounded-sm border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
                >
                  Tengahkan
                </button>
              </div>

              <div className="flex flex-wrap items-end gap-5 border-t border-ink/10 pt-4 dark:border-white/10">
                {frames.map((frame) => (
                  <Preview
                    key={frame.caption}
                    url={url}
                    style={style}
                    className={frame.className}
                    caption={frame.caption}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-ink/10 px-5 py-4 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => onSave(draft)}
                className="rounded-sm bg-ember px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flare"
              >
                Simpan fokus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Preview({
  url,
  style,
  className,
  caption,
}: {
  url: string;
  style: React.CSSProperties | undefined;
  className: string;
  caption: string;
}) {
  return (
    <figure className="flex flex-col gap-1.5">
      <div
        className={cn(
          "relative overflow-hidden rounded-sm border border-ink/10 bg-cream dark:border-white/10 dark:bg-white/[0.03]",
          className
        )}
      >
        <Image
          src={url}
          alt=""
          fill
          sizes="160px"
          className="object-cover"
          style={style}
          unoptimized={!url.startsWith("/")}
        />
      </div>
      <figcaption className="text-[11px] text-ink-faint">{caption}</figcaption>
    </figure>
  );
}
