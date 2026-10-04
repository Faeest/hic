"use client";

import { FieldWrap } from "./FieldWrap";

export function ToggleField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <label className="inline-flex cursor-pointer items-center gap-3">
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          value="on"
          className="peer sr-only"
        />
        <span className="relative h-6 w-11 rounded-full bg-ink/15 transition-colors peer-checked:bg-ember dark:bg-white/15">
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
        </span>
        <span className="text-sm text-ink-soft">Aktif</span>
      </label>
    </FieldWrap>
  );
}
