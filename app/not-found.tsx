import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-24 text-center dark:bg-[#14120f]">
      <p className="font-mono text-sm text-ember">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Halaman ini tidak ada.
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
        Mungkin tautannya salah, atau halamannya sudah dipindahkan.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          Kembali ke beranda
        </Link>
        <Link
          href="/blog"
          className="rounded-sm border border-ink/15 px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-ember/40 hover:text-ember dark:border-white/15"
        >
          Baca blog
        </Link>
      </div>
    </main>
  );
}
