import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { KategoriPengurus, Pengurus, PengurusRow } from "@/lib/types";
import {
  biroPengurus as seedBiro,
  koordinatorDivisi as seedKoordinator,
  pembina as seedPembina,
  pengurusInti as seedInti,
} from "@/data/pengurus";
import { bySort, warnFallback } from "./util";

export type PengurusGroups = {
  pembina: Pengurus | null;
  inti: Pengurus[];
  /** Functional bodies (humas, pdd, webdev, …). Data-driven — may be empty. */
  biro: Pengurus[];
  /** Division coordinators. Appointed by their division, not part of the BPH. */
  koordinator: Pengurus[];
};

export const seedPengurus: PengurusGroups = {
  pembina: seedPembina,
  inti: seedInti,
  biro: seedBiro,
  koordinator: seedKoordinator,
};

function toApp(row: PengurusRow, periode: string): Pengurus {
  return {
    nama: row.nama,
    jabatan: row.jabatan,
    deskripsi: row.deskripsi,
    inisial: row.inisial,
    gradien: row.gradien,
    foto: row.foto || undefined,
    unit: row.unit || undefined,
    nrp: row.nrp || undefined,
    periode: periode || undefined,
  };
}

/**
 * The active board's pengurus, grouped by kategori.
 *
 * "Active" is `kepengurusan.aktif` — swapping boards is a single row update, so
 * the whole section changes without touching individual pengurus rows.
 */
export async function getPengurus(): Promise<PengurusGroups> {
  "use cache";
  cacheTag(CONTENT_TAGS.pengurus);
  cacheLife("max");
  try {
    const { data: board, error: boardError } = await publicDb
      .from("kepengurusan")
      .select("id, periode")
      .eq("aktif", true)
      .maybeSingle();
    if (boardError) throw boardError;
    if (!board) return seedPengurus;

    const { data, error } = await publicDb
      .from("pengurus")
      .select("*")
      .eq("kepengurusan_id", board.id)
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedPengurus;

    const rows = bySort(data as PengurusRow[]);
    const pick = (k: KategoriPengurus) =>
      rows.filter((r) => r.kategori === k).map((r) => toApp(r, board.periode));

    return {
      pembina: pick("pembina")[0] ?? null,
      inti: pick("inti"),
      biro: pick("biro"),
      koordinator: pick("koordinator"),
    };
  } catch (error) {
    warnFallback("pengurus", error);
    return seedPengurus;
  }
}
