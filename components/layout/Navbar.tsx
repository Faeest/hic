"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLenis } from "lenis/react";
import type { Divisi, Site } from "@/lib/types";

const links = [
  { href: "/#beranda", label: "Beranda", id: "beranda" },
  { href: "/#tentang", label: "Tentang", id: "tentang" },
  { href: "/#divisi", label: "Divisi", id: "divisi" },
  { href: "/#pengurus", label: "Pengurus", id: "pengurus" },
  { href: "/#proker", label: "Program", id: "proker" },
  { href: "/#galeri", label: "Galeri", id: "galeri" },
  { href: "/#faq", label: "FAQ", id: "faq" },
];

const blogLink = { href: "/blog", label: "Blog" };

export function Navbar({ site }: { site: Site; divisi?: Divisi[] }) {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 24 : false
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const navLocked = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const unlockSpy = () => {
    navLocked.current = false;
    if (unlockTimer.current) {
      clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    navLocked.current = true;
    setActive(id);
    if (unlockTimer.current) clearTimeout(unlockTimer.current);

    // On the homepage we scroll programmatically. This also fixes the case
    // where the hash already equals the target (#beranda) so nothing happens.
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1.4 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    // Fallback: release the spy after the smooth scroll settles.
    // `scrollend` is the real signal; the timer covers browsers without it.
    unlockTimer.current = setTimeout(unlockSpy, 1400);
  };

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
        if (navLocked.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));

    const onScrollEnd = () => unlockSpy();
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", onScrollEnd);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, [pathname]);

  const isActive = (id: string) => {
    if (pathname === "/") return active ? active === id : id === "beranda";
    // Other pages: only highlight the matching section (e.g. Divisi on /divisi/*).
    if (pathname.startsWith("/divisi")) return id === "divisi";
    return false;
  };

  const isBlog = pathname.startsWith("/blog");

  const navClass = cn(
    "fixed inset-x-0 top-0 z-50 border-b border-ink/12 bg-paper/95 backdrop-blur-md transition-colors duration-300"
  );

  return (
    <>
      <header className={navClass}>
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-300 sm:px-8",
            scrolled ? "h-14" : "h-16"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              onClick={(e) => scrollToSection(e, "beranda")}
              className="group flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink"
            >
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden transition-transform duration-300 group-hover:rotate-[8deg]">
                <Image
                  src={site.logoLightUrl}
                  alt="Logo HIC"
                  fill
                  sizes="40px"
                  className="object-contain object-center dark:hidden"
                />
                <Image
                  src={site.logoDarkUrl}
                  alt="Logo HIC"
                  fill
                  sizes="40px"
                  className="hidden object-contain object-center dark:block"
                />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "hidden items-center gap-1 transition-all duration-500 lg:flex"
            )}
          >
            {links.map((l) => {
              const activeLink = isActive(l.id);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={(e) => scrollToSection(e, l.id)}
                  className={cn(
                    "relative px-2 py-2 text-sm font-medium transition-colors duration-300",
                    activeLink ? "text-ember" : "text-ink-soft hover:text-ember"
                  )}
                >
                  {activeLink && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="absolute inset-x-1 bottom-1 top-auto h-0.5 bg-ember"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
            <ThemeToggle className="ml-1" />
            <Link
              href={blogLink.href}
              className={cn(
                "relative px-2 py-2 text-sm font-medium transition-colors duration-300",
                isBlog ? "text-ember" : "text-ink-soft hover:text-ember"
              )}
            >
              {isBlog && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="absolute inset-x-1 bottom-1 top-auto h-0.5 bg-ember"
                />
              )}
              <span className="relative z-10">{blogLink.label}</span>
            </Link>
            <Link
              href={site.cta.href}
              target={site.cta.href.startsWith("http") ? "_blank" : undefined}
              rel={site.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="ml-2 rounded-sm bg-ember px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-flare"
            >
              {site.cta.label}
            </Link>
          </motion.div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 grid h-10 w-10 place-items-center border border-ink/12 bg-paper"
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
                      onClick={(e) => {
                        setOpen(false);
                        scrollToSection(e, l.id);
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
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + links.length * 0.06,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={blogLink.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-ink/10 py-4"
                >
                  <span
                    className={cn(
                      "font-display text-3xl font-semibold tracking-tight transition-colors",
                      isBlog ? "text-ember" : "text-ink group-hover:text-ember"
                    )}
                  >
                    {blogLink.label}
                  </span>
                  <span className="font-mono text-xs text-ink-faint">
                    {String(links.length + 1).padStart(2, "0")}
                  </span>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <Link
                href={site.cta.href}
                onClick={() => setOpen(false)}
                className="rounded-sm bg-ember px-6 py-3.5 text-base font-medium text-white"
              >
                {site.cta.label}
              </Link>
              <span className="font-mono text-xs text-ink-faint">
                UC • {site.tahunBerdiri}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}