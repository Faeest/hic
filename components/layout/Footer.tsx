"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { club, sosial } from "@/data/club";
import { divisi } from "@/data/divisi";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-cream dark:bg-[#14120f]">
      {/* Mini CTA band */}
      <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:pt-16">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-ink/10 pb-10 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-baseline gap-3 text-sm">
              <span className="h-px w-6 self-center bg-ink/15" aria-hidden />
              <span className="font-medium text-ink-faint">Punya prinsip belajar yang sama?</span>
            </p>
            <p className="mt-2 max-w-md font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Mari tumbuh bareng di HIC.
            </p>
          </div>
          <Link
            href="/#gabung"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ember px-6 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-flare"
          >
            Gabung HIC
            <ArrowUpRight
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="grain relative">
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink"
              >
                <span className="relative h-10 w-10 overflow-hidden rounded-xl">
                  <Image
                    src="/variant_logo-hic/Logogram ORANGE BLACK.png"
                    alt="Logo HIC"
                    fill
                    sizes="40px"
                    className="object-contain object-center dark:hidden"
                  />
                  <Image
                    src="/variant_logo-hic/Logogram ORANGE WHITE.png"
                    alt="Logo HIC"
                    fill
                    sizes="40px"
                    className="hidden object-contain object-center dark:block"
                  />
                </span>
                {club.namaPanjang}
              </Link>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                {club.tagline}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-ink-faint">Divisi</h3>
              <ul className="mt-4 space-y-3">
                {divisi.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/divisi/${d.slug}`}
                      className="text-base font-medium text-ink-soft transition-colors hover:text-ember"
                    >
                      {d.nama}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-ink-faint">Navigasi</h3>
              <ul className="mt-4 space-y-3">
                {[
                  { href: "/#beranda", label: "Beranda" },
                  { href: "/#tentang", label: "Tentang" },
                  { href: "/#divisi", label: "Divisi" },
                  { href: "/#pengurus", label: "Pengurus" },
                  { href: "/#proker", label: "Program" },
                  { href: "/#galeri", label: "Galeri" },
                  { href: "/#faq", label: "FAQ" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-base font-medium text-ink-soft transition-colors hover:text-ember"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-ink-faint">Kontak</h3>
              <ul className="mt-4 space-y-3 text-base text-ink-soft">
                <li>
                  <a
                    href={`mailto:${club.kontak.email}`}
                    className="transition-colors hover:text-ember"
                  >
                    {club.kontak.email}
                  </a>
                </li>
                <li>{club.kontak.instagram}</li>
                <li className="leading-relaxed">{club.kontak.lokasi}</li>
              </ul>
            </div>
          </div>

          {/* Utility bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-7 sm:flex-row">
            <p className="text-sm text-ink-faint">
              © {new Date().getFullYear()} {club.namaPanjang}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {sosial.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-soft transition-colors hover:text-ember"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <p className="font-mono text-xs text-ink-faint">est. 2018</p>
          </div>
        </div>
      </div>
    </footer>
  );
}