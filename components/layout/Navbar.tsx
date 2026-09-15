"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "/#beranda", label: "Beranda", id: "beranda" },
  { href: "/#tentang", label: "Tentang", id: "tentang" },
  { href: "/#divisi", label: "Divisi", id: "divisi" },
  { href: "/#pengurus", label: "Pengurus", id: "pengurus" },
  { href: "/#karya", label: "Karya", id: "karya" },
  { href: "/#faq", label: "FAQ", id: "faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 24 : false
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: only meaningful on the homepage where the sections exist
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = links.map((l) => l.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (id: string) =>
    pathname !== "/"
      ? id === "divisi"
      : active
        ? active === id
        : id === "beranda";

  const navClass = cn(
    "fixed inset-x-0 top-0 z-50 transition-all duration-500",
    scrolled ? "py-3" : "py-6"
  );

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-ember via-flare to-mango"
      />
      <header className={navClass}>
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8",
            scrolled && "px-3 sm:px-4"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              onClick={() => setActive("beranda")}
              className="group flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-ember text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(212,83,17,0.7)] transition-transform duration-300 group-hover:rotate-[8deg]">
                H
              </span>
              <span>
                HIC
                <span className="ml-1.5 hidden font-sans text-[11px] font-medium tracking-wider text-ink-soft sm:inline">
                  Hardware Interactive Club
                </span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "hidden items-center gap-1 rounded-full p-1 transition-all duration-500 lg:flex",
              scrolled ? "glass-panel" : ""
            )}
          >
            {links.map((l) => {
              const activeLink = isActive(l.id);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setActive(l.id)}
                  className={cn(
                    "relative rounded-full px-4.5 py-2 text-sm font-medium transition-colors duration-300",
                    activeLink ? "text-ember" : "text-ink-soft hover:text-ember"
                  )}
                >
                  {activeLink && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-full bg-ember/10"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
            <ThemeToggle className="ml-1" />
            <Link
              href="/#gabung"
              className="ml-1 rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_-10px_rgba(212,83,17,0.6)] transition-all duration-300 hover:bg-flare"
            >
              Gabung HIC
            </Link>
          </motion.div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 grid h-11 w-11 place-items-center rounded-full glass-panel"
            >
              <div className="flex w-5 flex-col items-center justify-center gap-[5px]">
                <span
                  className={cn(
                    "h-[2px] w-5 rounded bg-ink transition-all duration-300",
                    open && "translate-y-[7px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "h-[2px] w-5 rounded bg-ink transition-all duration-300",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "h-[2px] w-5 rounded bg-ink transition-all duration-300",
                    open && "-translate-y-[7px] -rotate-45"
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-cream px-6 pb-10 pt-28 dark:bg-[#181512] lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l, i) => {
                const activeLink = isActive(l.id);
                return (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.06,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => {
                        setOpen(false);
                        setActive(l.id);
                      }}
                      className={cn(
                        "group flex items-center justify-between border-b border-ink/10 py-4",
                        activeLink && "opacity-100"
                      )}
                    >
                      <span
                        className={cn(
                          "font-display text-3xl font-semibold tracking-tight transition-colors",
                          activeLink ? "text-ember" : "text-ink group-hover:text-ember"
                        )}
                      >
                        {l.label}
                      </span>
                      <span className="font-mono text-xs text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <Link
                href="/#gabung"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ember px-6 py-3.5 text-base font-medium text-white"
              >
                Gabung HIC
              </Link>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                UC • 2018
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}