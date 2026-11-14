import type { Metadata } from "next";
import Link from "next/link";
import { adminKepengurusan, adminPengurus } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { LoadoutSwitcher } from "@/components/admin/LoadoutSwitcher";
import { pengurusConfig } from "@/lib/admin/configs";

export const metadata: Metadata = {
  title: "Pengurus — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminPengurusPage({
  searchParams,
}: {
  searchParams: Promise<{ loadout?: string }>;
}) {
  const { loadout } = await searchParams;
  const boards = await adminKepengurusan();

  const selected =
    boards.find((b) => b.id === loadout) ??
    boards.find((b) => b.aktif) ??
    boards[0];

  const rows = selected ? await adminPengurus(selected.id) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Pengurus
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Dosen pembina, BPH, biro, dan penanggung jawab divisi untuk satu
            kepengurusan. Pilih periode di bawah untuk mengisi yang lain.
          </p>
        </div>
        <Link
          href="/admin/kepengurusan"
          className="inline-flex items-center rounded-sm border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ember/40 hover:text-ember dark:border-white/15"
        >
          Kelola kepengurusan
        </Link>
      </div>

      <LoadoutSwitcher boards={boards} selectedId={selected?.id} />

      {selected ? (
        <>
          <p className="text-sm text-ink-faint">
            Mengisi <span className="text-ink">{selected.nama}</span>
            {selected.aktif ? " — tampil di situs." : " — arsip, tidak tampil."}
          </p>
          <ResourceManager
            config={pengurusConfig}
            rows={rows}
            fixedValues={{ kepengurusan_id: selected.id }}
          />
        </>
      ) : (
        <p className="rounded-sm border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink-faint dark:border-white/15">
          Belum ada kepengurusan.{" "}
          <Link href="/admin/kepengurusan" className="text-ember underline">
            Buat satu dulu
          </Link>
          .
        </p>
      )}
    </div>
  );
}
