"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Icons are driven by CSS (`dark:` variant) rather than React state, so the
 * server-rendered markup matches the client and hydration stays clean.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("hic-theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event("hic:theme"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti mode terang atau gelap"
      title="Ganti tema"
      className={cn(
        "grid h-10 w-10 place-items-center rounded-sm text-ink-soft transition-colors duration-300 hover:text-ember",
        className
      )}
    >
      <Moon size={20} weight="duotone" className="dark:hidden" />
      <Sun size={20} weight="duotone" className="hidden dark:block" />
    </button>
  );
}
