import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Masuk — Admin HIC",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-5 py-16 dark:bg-[#14120f]">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            Admin HIC
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            Masuk ke panel
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Kelola konten situs HIC — teks, tautan, gambar, dan blog.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-faint">
          <Link href="/" className="transition-colors hover:text-ember">
            &larr; Kembali ke situs
          </Link>
        </p>
      </div>
    </main>
  );
}
