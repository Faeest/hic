"use client";

import { FieldWrap } from "./FieldWrap";
import { cn } from "@/lib/utils";

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
  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={cn(
          "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}
