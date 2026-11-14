import type { Metadata } from "next";
import { adminKepengurusan, adminPengurusCounts } from "@/lib/content/admin";
import { KepengurusanManager } from "@/components/admin/KepengurusanManager";

export const metadata: Metadata = {
  title: "Kepengurusan — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminKepengurusanPage() {
  const [boards, counts] = await Promise.all([
    adminKepengurusan(),
    adminPengurusCounts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Kepengurusan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Tiap kepengurusan adalah satu set pengurus. Situs menampilkan yang
          berstatus aktif; yang lain tersimpan sebagai arsip dan bisa diaktifkan
          kapan saja. Duplikat untuk memulai periode baru tanpa mengetik ulang.
        </p>
      </div>
      <KepengurusanManager boards={boards} counts={counts} />
    </div>
  );
}
