"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function getInitial() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    const onStorage = () => setDark(getInitial());
    window.addEventListener("hic:theme", onStorage as EventListener);
    return () => window.removeEventListener("hic:theme", onStorage as EventListener);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
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
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={dark ? "Mode terang" : "Mode gelap"}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors duration-300 hover:text-ember",
        className
      )}
    >
      {dark ? (
        <Sun size={20} weight="duotone" />
      ) : (
        <Moon size={20} weight="duotone" />
      )}
    </button>
  );
}