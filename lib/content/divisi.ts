import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type {
  Divisi,
  DivisiRow,
  KurikulumRow,
  MentorRow,
  WarnaDivisi,
} from "@/lib/types";
import { divisi as seedDivisi } from "@/data/divisi";
import { bySort, warnFallback } from "./util";

export const seedDivisiList: Divisi[] = seedDivisi;

const FALLBACK_WARNA: WarnaDivisi = {
  utama: "#d45311",
  terang: "#ffbe6b",
  latar: "#fff3e6",
  latarDark: "#2a1a10",
  border: "rgba(212, 83, 17, 0.18)",
  borderDark: "rgba(212, 83, 17, 0.35)",
};

function normalizeWarna(w: Partial<WarnaDivisi> | null | undefined): WarnaDivisi {
  return { ...FALLBACK_WARNA, ...(w ?? {}) };
}

/** Assemble a Divisi app object from its row plus child rows. */
function assemble(
  row: DivisiRow,
  kurikulum: KurikulumRow[],
  mentor: MentorRow[]
): Divisi {
  return {
    slug: row.slug,
    nama: row.nama,
    namaPanjang: row.nama_panjang,
    angka: row.angka,
    tagline: row.tagline,
    deskripsi: row.deskripsi,
    akronim: row.akronim,
    warna: normalizeWarna(row.warna),
    kurikulum: bySort(kurikulum).map((k) => ({
      nomor: k.nomor,
      judul: k.judul,
      durasi: k.durasi,
      deskripsi: k.deskripsi,
    })),
    mentor: bySort(mentor).map((m) => ({ nama: m.nama, fokus: m.fokus })),
  };
}

/**
 * All published divisi, with kurikulum + mentor. An empty table means the
 * admin removed them — return nothing rather than resurrecting seed content.
 * Seed data is only used when Supabase is unreachable.
 */
export async function getAllDivisi(): Promise<Divisi[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.divisi);
  cacheLife("max");
  try {
    const { data: rows, error } = await publicDb
      .from("divisi")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!rows || rows.length === 0) return [];

    const ids = rows.map((r) => r.id);
    const [{ data: kur }, { data: men }] = await Promise.all([
      publicDb.from("kurikulum").select("*").in("divisi_id", ids),
      publicDb.from("mentor").select("*").in("divisi_id", ids),
    ]);

    return bySort(rows as DivisiRow[]).map((row) =>
      assemble(
        row,
        ((kur as KurikulumRow[]) ?? []).filter((k) => k.divisi_id === row.id),
        ((men as MentorRow[]) ?? []).filter((m) => m.divisi_id === row.id)
      )
    );
  } catch (error) {
    warnFallback("divisi", error);
    return seedDivisiList;
  }
}

/** Single divisi by slug. Missing row means it was removed, not "use seed". */
export async function getDivisi(slug: string): Promise<Divisi | undefined> {
  "use cache";
  cacheTag(CONTENT_TAGS.divisi);
  cacheLife("max");
  try {
    const { data: row, error } = await publicDb
      .from("divisi")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!row) return undefined;

    const [{ data: kur }, { data: men }] = await Promise.all([
      publicDb.from("kurikulum").select("*").eq("divisi_id", row.id),
      publicDb.from("mentor").select("*").eq("divisi_id", row.id),
    ]);

    return assemble(
      row as DivisiRow,
      (kur as KurikulumRow[]) ?? [],
      (men as MentorRow[]) ?? []
    );
  } catch (error) {
    warnFallback(`divisi:${slug}`, error);
    return seedDivisiList.find((d) => d.slug === slug);
  }
}

/** Slugs for generateStaticParams / sitemap. */
export async function getDivisiSlugs(): Promise<string[]> {
  const list = await getAllDivisi();
  return list.map((d) => d.slug);
}
