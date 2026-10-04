import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { KategoriPengurus, Pengurus, PengurusRow } from "@/lib/types";
import {
  koordinatorDivisi as seedKoordinator,
  pembina as seedPembina,
  pengurusInti as seedInti,
} from "@/data/pengurus";
import { bySort, warnFallback } from "./util";

export type PengurusGroups = {
  pembina: Pengurus | null;
  inti: Pengurus[];
  koordinator: Pengurus[];
};

export const seedPengurus: PengurusGroups = {
  pembina: seedPembina,
  inti: seedInti,
  koordinator: seedKoordinator,
};

function toApp(row: PengurusRow): Pengurus {
  return {
    nama: row.nama,
    jabatan: row.jabatan,
    deskripsi: row.deskripsi,
    inisial: row.inisial,
    gradien: row.gradien,
  };
}

/** All published pengurus, grouped by kategori. */
export async function getPengurus(): Promise<PengurusGroups> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pengurus")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedPengurus;

    const rows = bySort(data as PengurusRow[]);
    const pick = (k: KategoriPengurus) =>
      rows.filter((r) => r.kategori === k).map(toApp);

    return {
      pembina: pick("pembina")[0] ?? null,
      inti: pick("inti"),
      koordinator: pick("koordinator"),
    };
  } catch (error) {
    warnFallback("pengurus", error);
    return seedPengurus;
  }
}
