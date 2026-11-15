import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa kata sandi — Admin HIC",
  robots: { index: false, follow: false },
};

export default function AdminForgotPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-5 py-16 dark:bg-[#14120f]">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-sm p-8 sm:p-10">
          <p className="text-sm text-ink-faint">Admin HIC</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            Lupa kata sandi
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Masukkan email admin. Kami kirim tautan untuk membuat kata sandi
            baru.
          </p>

          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-faint">
          <Link href="/admin/login" className="transition-colors hover:text-ember">
            &larr; Kembali ke halaman masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
