"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  SquaresFour,
  GearSix,
  Stack,
  UsersThree,
  CalendarCheck,
  Images,
  Question,
  Article,
  FolderOpen,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: SquaresFour },
  { href: "/admin/site", label: "Situs", icon: GearSix },
  { href: "/admin/sections", label: "Seksi", icon: List },
  { href: "/admin/divisi", label: "Divisi", icon: Stack },
  { href: "/admin/pengurus", label: "Pengurus", icon: UsersThree },
  { href: "/admin/proker", label: "Program Kerja", icon: CalendarCheck },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/faq", label: "FAQ", icon: Question },
  { href: "/admin/posts", label: "Blog", icon: Article },
  { href: "/admin/media", label: "Media", icon: FolderOpen },
];

export function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
            isActive(href)
              ? "bg-ember text-white"
              : "text-ink-soft hover:bg-ink/5 hover:text-ink dark:hover:bg-white/5"
          )}
        >
          <Icon size={18} weight="duotone" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-cream dark:bg-[#14120f]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur dark:border-white/10 dark:bg-[#14120f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 lg:hidden"
            >
              {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
            <Link href="/admin" className="font-display text-lg font-bold tracking-tight text-ink">
              Admin <span className="text-ember">HIC</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-faint sm:inline">{email}</span>
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember sm:inline-block"
            >
              Lihat situs
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-ink/5 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink dark:bg-white/5 dark:hover:bg-white/10"
              >
                <SignOut size={16} weight="bold" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 sm:px-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">{nav}</div>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 top-[57px] z-30 bg-cream px-5 py-6 dark:bg-[#14120f] lg:hidden">
            {nav}
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
