"use client";

import { FieldWrap, inputClass } from "./FieldWrap";
import { cn } from "@/lib/utils";

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={cn(inputClass, "resize-y leading-relaxed")}
      />
    </FieldWrap>
  );
}
