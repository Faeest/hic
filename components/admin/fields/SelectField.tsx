"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { FieldWrap } from "./FieldWrap";
import { cn } from "@/lib/utils";

/**
 * Custom listbox — the native `<select>` popup cannot be styled and looks
 * foreign next to the rest of the panel.
 *
 * Keeps a hidden input so it still submits with the form, and implements the
 * expected keyboard contract (Up/Down/Home/End/Enter/Escape, type-ahead off).
 */
export function SelectField({
  label,
  name,
  options,
  defaultValue,
  hint,
  placeholder,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  hint?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === (defaultValue ?? "")))
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const current = options.find((o) => o.value === value);

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

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const choose = (next: string) => {
    setValue(next);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[active];
      if (opt) choose(opt.value);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={value} />

      <div ref={wrapRef} className="relative">
        <button
          type="button"
          id={name}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-activedescendant={open ? `${listId}-${active}` : undefined}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-left text-base text-ink outline-none transition-colors hover:border-ink/25 focus:border-ember dark:border-white/15 dark:bg-white/[0.04]",
            open && "border-ember"
          )}
        >
          <span className={cn("truncate", !current && "text-ink-faint")}>
            {current?.label ?? placeholder ?? "Pilih…"}
          </span>
          <CaretDown
            size={16}
            weight="bold"
            aria-hidden
            className={cn(
              "shrink-0 text-ink-faint transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={name}
            className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-sm border border-ink/15 bg-paper p-1 shadow-[0_12px_28px_-16px_rgba(28,21,18,0.45)] dark:border-white/15"
          >
            {placeholder && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === ""}
                  onClick={() => choose("")}
                  className="flex w-full items-center justify-between gap-2 rounded-xs px-3 py-2 text-left text-sm text-ink-faint transition-colors hover:bg-ink/5 dark:hover:bg-white/5"
                >
                  {placeholder}
                  {value === "" && <Check size={14} weight="bold" />}
                </button>
              </li>
            )}
            {options.map((o, i) => {
              const selected = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    id={`${listId}-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(o.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xs px-3 py-2 text-left text-sm transition-colors",
                      i === active
                        ? "bg-ember/10 text-ink"
                        : "text-ink-soft hover:bg-ink/5 dark:hover:bg-white/5",
                      selected && "text-ember"
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {selected && <Check size={14} weight="bold" className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FieldWrap>
  );
}
