"use client";

import { useState } from "react";
import { Plus, Trash, ArrowUp, ArrowDown } from "@phosphor-icons/react";
import { FieldWrap, inputClass } from "./FieldWrap";
import { cn } from "@/lib/utils";

export type RepeaterFieldSpec = {
  /** key in the JSON object; for simple lists this is ignored */
  key: string;
  label: string;
  placeholder?: string;
  /** "text" (default) or "textarea" */
  type?: "text" | "textarea";
};

type Row = Record<string, string>;

/**
 * Repeatable list editor that serializes to JSON in a hidden input.
 *
 * Two modes:
 *  - simple: `fields` omitted -> array of strings
 *  - object: `fields` provided -> array of objects with those keys
 *
 * Reordering uses explicit up/down buttons (reliable, keyboard-friendly).
 */
export function RepeaterField({
  label,
  name,
  defaultValue,
  fields,
  hint,
  itemLabel = "Item",
}: {
  label: string;
  name: string;
  defaultValue: unknown;
  fields?: RepeaterFieldSpec[];
  hint?: string;
  itemLabel?: string;
}) {
  const isSimple = !fields || fields.length === 0;

  const initial: Row[] = Array.isArray(defaultValue)
    ? (defaultValue as unknown[]).map((v) =>
        isSimple
          ? { value: typeof v === "string" ? v : JSON.stringify(v) }
          : fields!.reduce<Row>((acc, f) => {
              const obj = (v ?? {}) as Record<string, unknown>;
              acc[f.key] = obj[f.key] == null ? "" : String(obj[f.key]);
              return acc;
            }, {})
      )
    : [];

  const [rows, setRows] = useState<Row[]>(initial);

  const update = (i: number, key: string, value: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const add = () =>
    setRows((rs) => [
      ...rs,
      isSimple
        ? { value: "" }
        : fields!.reduce<Row>((acc, f) => ({ ...acc, [f.key]: "" }), {}),
    ]);

  const remove = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const j = i + dir;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // Serialized value written to the hidden input.
  const serialized = isSimple
    ? rows.map((r) => r.value).filter((v) => v.trim() !== "")
    : rows.filter((r) => Object.values(r).some((v) => v.trim() !== ""));

  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={JSON.stringify(serialized)} />

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-3 text-sm text-ink-faint dark:border-white/15">
            Belum ada {itemLabel.toLowerCase()}.
          </p>
        )}

        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-2xl border border-ink/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {isSimple ? (
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => update(i, "value", e.target.value)}
                    placeholder="Tulis di sini…"
                    className={cn(inputClass, "text-sm")}
                  />
                ) : (
                  fields!.map((f) =>
                    f.type === "textarea" ? (
                      <textarea
                        key={f.key}
                        rows={2}
                        value={row[f.key] ?? ""}
                        onChange={(e) => update(i, f.key, e.target.value)}
                        placeholder={f.label}
                        className={cn(inputClass, "resize-y text-sm")}
                      />
                    ) : (
                      <input
                        key={f.key}
                        type="text"
                        value={row[f.key] ?? ""}
                        onChange={(e) => update(i, f.key, e.target.value)}
                        placeholder={f.placeholder ?? f.label}
                        className={cn(inputClass, "text-sm")}
                      />
                    )
                  )
                )}
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Naikkan"
                  className="grid h-7 w-7 place-items-center rounded-lg text-ink-faint transition-colors hover:text-ember disabled:opacity-30"
                >
                  <ArrowUp size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  aria-label="Turunkan"
                  className="grid h-7 w-7 place-items-center rounded-lg text-ink-faint transition-colors hover:text-ember disabled:opacity-30"
                >
                  <ArrowDown size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Hapus"
                  className="grid h-7 w-7 place-items-center rounded-lg text-ink-faint transition-colors hover:text-red-500"
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
        >
          <Plus size={16} weight="bold" />
          Tambah {itemLabel.toLowerCase()}
        </button>
      </div>
    </FieldWrap>
  );
}
