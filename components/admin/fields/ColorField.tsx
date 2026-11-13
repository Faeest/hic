"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { FieldWrap, inputClass } from "./FieldWrap";
import { cn } from "@/lib/utils";

/** Brand-adjacent swatches; the hex field still accepts anything. */
const SWATCHES = [
  "#d45311",
  "#fb9606",
  "#ffbe6b",
  "#f67f1e",
  "#1c1512",
  "#5d5045",
  "#a08d7c",
  "#fdf9f4",
  "#fff3e6",
  "#ffe7cc",
  "#2f6f4f",
  "#2b4c7e",
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Colour picker: swatch popover + hex field, kept in sync.
 *
 * The native `input[type=color]` opens an OS dialog that ignores the panel's
 * design language, so it is not used.
 */
export function ColorField({
  label,
  name,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue || "#d45311");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const valid = HEX.test(value);

  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={value} />

      <div ref={wrapRef} className="relative flex items-center gap-3">
        <button
          type="button"
          aria-label={`Pilih warna ${label}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-14 shrink-0 items-center justify-center rounded-sm border border-ink/15 transition-colors hover:border-ink/30 dark:border-white/15"
          style={{ background: valid ? value : "transparent" }}
        >
          <CaretDown
            size={14}
            weight="bold"
            aria-hidden
            className={cn(
              "transition-transform duration-200",
              open && "rotate-180",
              // Keep the caret legible on both light and dark swatches.
              "mix-blend-difference text-white"
            )}
          />
        </button>

        <input
          id={name}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className={cn(inputClass, "font-mono text-sm")}
        />

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-sm border border-ink/15 bg-paper p-3 shadow-[0_12px_28px_-16px_rgba(28,21,18,0.45)] dark:border-white/15">
            <div className="grid grid-cols-6 gap-2">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => {
                    setValue(c);
                    setOpen(false);
                  }}
                  className={cn(
                    "h-7 w-full rounded-xs border transition-transform hover:scale-105",
                    value.toLowerCase() === c.toLowerCase()
                      ? "border-ember ring-1 ring-ember"
                      : "border-ink/15 dark:border-white/20"
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              Atau tulis kode hex sendiri di kolom sebelah.
            </p>
          </div>
        )}
      </div>
    </FieldWrap>
  );
}
