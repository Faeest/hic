import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { Proker, ProkerRow } from "@/lib/types";
import { proker as seedProker } from "@/data/proker";
import { bySort, warnFallback } from "./util";

export const seedProkerList: Proker[] = seedProker;

function toApp(row: ProkerRow): Proker {
  return {
    judul: row.judul,
    kategori: row.kategori,
    divisiSlug: row.divisi_slug,
    tahun: row.tahun,
    deskripsi: row.deskripsi,
    dana: row.dana,
    warna: row.warna,
  };
}

/** All published program kerja. */
export async function getProker(): Promise<Proker[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.proker);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("proker")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedProkerList;
    return bySort(data as ProkerRow[]).map(toApp);
  } catch (error) {
    warnFallback("proker", error);
    return seedProkerList;
  }
}

/** Program kerja for one divisi. */
export async function getProkerByDivisi(slug: string): Promise<Proker[]> {
  const all = await getProker();
  return all.filter((p) => p.divisiSlug === slug);
}
