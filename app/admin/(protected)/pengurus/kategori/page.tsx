import type { Metadata } from "next";
import Link from "next/link";
import {
  adminKepengurusan,
  adminPengurus,
  adminPengurusGrup,
} from "@/lib/content/admin";
import { LoadoutSwitcher } from "@/components/admin/LoadoutSwitcher";
import { PengurusGrupManager } from "@/components/admin/PengurusGrupManager";
import { PengurusTabs } from "@/components/admin/PengurusTabs";

export const metadata: Metadata = {
  title: "Kategori pengurus — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminPengurusKategoriPage({
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

  const [groups, rows] = selected
    ? await Promise.all([
        adminPengurusGrup(selected.id),
        adminPengurus(selected.id),
      ])
    : [[], []];

  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (!row.grup_id) continue;
    counts[row.grup_id] = (counts[row.grup_id] ?? 0) + 1;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Kategori pengurus
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Kelompok yang tampil di bagian “Orang-orang di balik kursi”. Dosen
          pembina dan BPH selalu ada; kelompok lain bebas ditambah, diganti
          nama, diurutkan, atau dihapus tiap periode.
        </p>
      </div>

      <LoadoutSwitcher boards={boards} selectedId={selected?.id} />

      <PengurusTabs active="kategori" loadout={selected?.id} />

      {selected ? (
        <>
          <p className="text-sm text-ink-faint">
            Mengubah kategori di{" "}
            <span className="text-ink">{selected.nama}</span>
            {selected.aktif ? " — tampil di situs." : " — arsip, tidak tampil."}
          </p>
          <PengurusGrupManager
            boardId={selected.id}
            groups={groups}
            counts={counts}
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
