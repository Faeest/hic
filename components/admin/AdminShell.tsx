"use client";

import Link, { useLinkStatus } from "next/link";
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
  Spinner,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
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

/**
 * Renders the icon/label of a nav entry and reports whether *this* link's
 * navigation is in flight.
 *
 * `useLinkStatus` must be called from a descendant of `<Link>` — the Link
 * provides the status via context to its children, so calling it in the
 * component that renders the `<Link>` would always read `pending: false`.
 * That is why the row is split into `NavItem` (renders the anchor) and
 * `NavItemContent` (renders the inside).
 *
 * Why we need this at all: admin routes are dynamic (`instant = false`) and
 * read cookies + unpublished data. Between the click and the new route
 * committing there is otherwise no signal at all, so a tap looks like it did
 * nothing. `loading.tsx` covers the content area; this covers the item itself.
 */
function NavItemContent({
  label,
  icon: Icon,
}: {
  label: string;
  icon: PhosphorIcon;
}) {
  const { pending } = useLinkStatus();
  return (
    <span data-pending={pending} aria-busy={pending} className="contents">
      {pending ? (
        <Spinner size={18} weight="bold" className="animate-spin" aria-hidden />
      ) : (
        <Icon size={18} weight="duotone" aria-hidden />
      )}
      {label}
    </span>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: PhosphorIcon;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-ember text-white"
          : "text-ink-soft hover:bg-ink/5 hover:text-ink dark:hover:bg-white/5",
        // Highlight the tapped row the moment it is clicked, before the route
        // commits (the child sets data-pending). Keeps feedback even if the
        // destination has no instant loading boundary.
        "has-[[data-pending=true]]:bg-ember has-[[data-pending=true]]:text-white"
      )}
    >
      <NavItemContent label={label} icon={icon} />
    </Link>
  );
}

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
      {NAV.map(({ href, label, icon }) => (
        <NavItem
          key={href}
          href={href}
          label={label}
          icon={icon}
          active={isActive(href)}
          onNavigate={() => setOpen(false)}
        />
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
