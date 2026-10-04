"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:opacity-60",
        variant === "primary" && "bg-ember text-white hover:bg-flare",
        variant === "ghost" &&
          "border border-ink/15 text-ink-soft hover:text-ink dark:border-white/15",
        variant === "danger" &&
          "border border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400",
        className
      )}
    >
      {pending ? "Menyimpan…" : children}
    </button>
  );
}
