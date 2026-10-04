"use client";

import { cn } from "@/lib/utils";

export type FieldWrapProps = {
  label: string;
  name: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function FieldWrap({ label, name, hint, className, children }: FieldWrapProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-ink-faint">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]";
