import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { Pengurus, PengurusGrup, PengurusGrupRow, PengurusRow } from "@/lib/types";
import {
  biroPengurus as seedBiro,
  koordinatorDivisi as seedKoordinator,
  pembina as seedPembina,
  pengurusInti as seedInti,
  seedPengurusGrup,
} from "@/data/pengurus";
import { bySort, warnFallback } from "./util";
import { RESERVED_GRUP_SLUGS } from "@/lib/pengurus-grup";

export type PengurusGroup = PengurusGrup & { anggota: Pengurus[] };

export type PengurusGroups = {
  /** The dosen pembina card(s) — normally exactly one. */
  pembina: Pengurus[];
  /** Badan Pengurus Harian. */
  inti: Pengurus[];
  /** Admin-defined groups, in board order, empty groups omitted. */
  grup: PengurusGroup[];
};

const seedGroup = (slug: string, anggota: Pengurus[]): PengurusGroup => {
  const meta = seedPengurusGrup.find((g) => g.slug === slug);
  return {
    slug,
    label: meta?.label ?? slug,
    deskripsi: meta?.deskripsi ?? "",
    sort: meta?.sort ?? 0,
    anggota,
  };
};

export const seedPengurus: PengurusGroups = {
  pembina: [seedPembina],
  inti: seedInti,
  grup: [seedGroup("biro", seedBiro), seedGroup("koordinator", seedKoordinator)],
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
 * The active board's pengurus, grouped by `pengurus_grup`.
 *
 * "Active" is `kepengurusan.aktif` — swapping boards is a single row update, so
 * the whole section changes without touching individual pengurus rows.
 *
 * Rows written by the previous build may have no `grup_id`; those fall back to
 * the legacy `kategori` slug so nothing disappears mid-deploy.
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

    const [grupRes, rowRes] = await Promise.all([
      publicDb
        .from("pengurus_grup")
        .select("*")
        .eq("kepengurusan_id", board.id)
        .order("sort", { ascending: true }),
      publicDb
        .from("pengurus")
        .select("*")
        .eq("kepengurusan_id", board.id)
        .order("sort", { ascending: true }),
    ]);
    if (grupRes.error) throw grupRes.error;
    if (rowRes.error) throw rowRes.error;

    const groups = bySort((grupRes.data ?? []) as PengurusGrupRow[]);
    const rows = bySort((rowRes.data ?? []) as PengurusRow[]);
    if (groups.length === 0) return seedPengurus;
    if (rows.length === 0) return seedPengurus;

    const bySlug = new Map(groups.map((g) => [g.slug, g]));
    const byId = new Map(groups.map((g) => [g.id, g]));
    const buckets = new Map<string, Pengurus[]>(groups.map((g) => [g.id, []]));

    for (const row of rows) {
      const group =
        (row.grup_id ? byId.get(row.grup_id) : undefined) ??
        bySlug.get(row.kategori);
      if (!group) continue;
      buckets.get(group.id)?.push(toApp(row, board.periode));
    }

    const pembina = buckets.get(bySlug.get("pembina")?.id ?? "") ?? [];
    const inti = buckets.get(bySlug.get("inti")?.id ?? "") ?? [];
    const grup = groups
      .filter((g) => !(RESERVED_GRUP_SLUGS as readonly string[]).includes(g.slug))
      .map((g) => ({
        slug: g.slug,
        label: g.label,
        deskripsi: g.deskripsi,
        sort: g.sort,
        anggota: buckets.get(g.id) ?? [],
      }))
      .filter((g) => g.anggota.length > 0);

    return { pembina, inti, grup };
  } catch (error) {
    warnFallback("pengurus", error);
    return seedPengurus;
  }
}

/**
 * The person a division page should show. They are appointed by the division
 * and may sit in any group, so this searches every bucket by `unit`.
 */
export async function getPjDivisi(slug: string): Promise<Pengurus | undefined> {
  const { pembina, inti, grup } = await getPengurus();
  return [...pembina, ...inti, ...grup.flatMap((g) => g.anggota)].find(
    (p) => p.unit === slug
  );
}
