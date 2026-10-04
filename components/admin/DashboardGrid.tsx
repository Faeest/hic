"use client";

import Link from "next/link";
import {
  GearSix,
  Stack,
  UsersThree,
  CalendarCheck,
  Images,
  Question,
  Article,
} from "@phosphor-icons/react";

const CARDS = [
  { key: "divisi", label: "Divisi", href: "/admin/divisi", icon: Stack },
  { key: "pengurus", label: "Pengurus", href: "/admin/pengurus", icon: UsersThree },
  { key: "proker", label: "Program Kerja", href: "/admin/proker", icon: CalendarCheck },
  { key: "galeri", label: "Galeri", href: "/admin/galeri", icon: Images },
  { key: "faq", label: "FAQ", href: "/admin/faq", icon: Question },
  { key: "posts", label: "Artikel Blog", href: "/admin/posts", icon: Article },
] as const;

/**
 * Client component — icons use React context, which is unavailable in Server
 * Components. The page fetches counts on the server and passes them in.
 */
export function DashboardGrid({ counts }: { counts: Record<string, number | null> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/admin/site"
        className="glass-panel group flex items-center gap-4 rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-0.5 sm:col-span-2 lg:col-span-3"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember text-white">
          <GearSix size={24} weight="duotone" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            Pengaturan Situs
          </p>
          <p className="text-sm text-ink-soft">
            Identitas, tagline, visi, misi, statistik, kontak, logo, dan tautan sosial.
          </p>
        </div>
      </Link>

      {CARDS.map((c) => (
        <Link
          key={c.key}
          href={c.href}
          className="glass-panel group flex items-center gap-4 rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-peach text-ember">
            <c.icon size={22} weight="duotone" />
          </span>
          <div>
            <p className="font-display text-2xl font-semibold text-ink">
              {counts[c.key] ?? "—"}
            </p>
            <p className="text-sm text-ink-soft">{c.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
