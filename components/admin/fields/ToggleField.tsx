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
        {/* The knob is a child of the track, so `peer-checked:` must target it
            through the track — a plain `peer-checked:translate-x-5` on the knob
            never matches (the peer is not its sibling). */}
        <span className="relative h-6 w-11 rounded-full bg-ink/15 transition-colors peer-checked:bg-ember peer-checked:[&>span]:translate-x-5 dark:bg-white/15">
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
        </span>
        <span className="text-sm text-ink-soft">Aktif</span>
      </label>
    </FieldWrap>
  );
}
