"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-24 text-center dark:bg-[#14120f]">
      <p className="font-mono text-sm text-ember">Error</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Ada yang tidak beres.
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
        Coba muat ulang halaman ini. Kalau masih gagal, kembali ke beranda.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-ink-faint">
          {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          Muat ulang
        </button>
        <Link
          href="/"
          className="rounded-sm border border-ink/15 px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-ember/40 hover:text-ember dark:border-white/15"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
