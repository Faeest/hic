"use client";

import { FieldWrap, inputClass } from "./FieldWrap";
import { cn } from "@/lib/utils";

/** Colour picker + free-text hex, kept in sync. Submits a hex string. */
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
  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <ColorInput name={name} defaultValue={defaultValue ?? "#d45311"} />
    </FieldWrap>
  );
}

function ColorInput({ name, defaultValue }: { name: string; defaultValue: string }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        aria-label={`${name} color`}
        defaultValue={defaultValue}
        onInput={(e) => {
          const text = e.currentTarget
            .closest("div")
            ?.querySelector<HTMLInputElement>(`input[name="${name}"]`);
          if (text) text.value = e.currentTarget.value;
        }}
        className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-ink/15 bg-white dark:border-white/15"
      />
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        className={cn(inputClass, "font-mono text-sm")}
      />
    </div>
  );
}
