"use client";

import { FieldWrap, inputClass } from "./FieldWrap";

export function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  hint?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </FieldWrap>
  );
}
