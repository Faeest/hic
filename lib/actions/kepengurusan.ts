"use server";

import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/actions/revalidate";
import { DEFAULT_GRUP } from "@/lib/pengurus-grup";
import type { PengurusGrupRow, PengurusRow } from "@/lib/types";

export type KepengurusanResult = { ok: true } | { ok: false; error: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Create the group set for a new board and return a source→target group id map.
 *
 * A copied board keeps the source's groups (including renamed ones); a fresh
 * board gets DEFAULT_GRUP. The map is what remaps each copied person's
 * `grup_id`, so members never point at the previous board's groups.
 */
async function setupGroups(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sourceId: string | null,
  targetId: string
): Promise<{ map: Map<string, string>; error: string | null }> {
  let sourceGroups: PengurusGrupRow[] = [];

  if (sourceId) {
    const { data, error } = await supabase
      .from("pengurus_grup")
      .select("*")
      .eq("kepengurusan_id", sourceId)
      .order("sort", { ascending: true });
    if (error) return { map: new Map(), error: error.message };
    sourceGroups = (data ?? []) as PengurusGrupRow[];
  }

  const rows =
    sourceGroups.length > 0
      ? sourceGroups.map((g) => ({
          kepengurusan_id: targetId,
          slug: g.slug,
          label: g.label,
          deskripsi: g.deskripsi,
          sort: g.sort,
        }))
      : DEFAULT_GRUP.map((g) => ({ ...g, kepengurusan_id: targetId }));

  const { error: insertError } = await supabase
    .from("pengurus_grup")
    .insert(rows);
  if (insertError) return { map: new Map(), error: insertError.message };

  const { data: created, error: readError } = await supabase
    .from("pengurus_grup")
    .select("id, slug")
    .eq("kepengurusan_id", targetId);
  if (readError) return { map: new Map(), error: readError.message };

  const bySlug = new Map((created ?? []).map((g) => [g.slug, g.id]));
  const map = new Map<string, string>();
  for (const group of sourceGroups) {
    const target = bySlug.get(group.slug);
    if (target) map.set(group.id, target);
  }
  return { map, error: null };
}

/** Copy every pengurus row of `sourceId` into `targetId`, remapping its group. */
async function copyRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sourceId: string,
  targetId: string,
  grupMap: Map<string, string>
): Promise<string | null> {
  const { data, error } = await supabase
    .from("pengurus")
    .select("*")
    .eq("kepengurusan_id", sourceId)
    .order("sort", { ascending: true });
  if (error) return error.message;
  if (!data || data.length === 0) return null;

  const copies = (data as PengurusRow[]).map((row) => ({
    nama: row.nama,
    jabatan: row.jabatan,
    deskripsi: row.deskripsi,
    inisial: row.inisial,
    gradien: row.gradien,
    nrp: row.nrp,
    foto: row.foto ?? "",
    unit: row.unit ?? "",
    kategori: row.kategori,
    grup_id: row.grup_id ? grupMap.get(row.grup_id) ?? null : null,
    sort: row.sort,
    published: row.published,
    kepengurusan_id: targetId,
  }));

  const { error: insertError } = await supabase.from("pengurus").insert(copies);
  return insertError ? insertError.message : null;
}

async function nextSort(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<number> {
  const { data } = await supabase
    .from("kepengurusan")
    .select("sort")
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort ?? -1) + 1;
}

export async function createKepengurusan(fd: FormData): Promise<KepengurusanResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }

  const nama = str(fd, "nama");
  const periode = str(fd, "periode");
  if (!nama) return { ok: false, error: "Nama kepengurusan wajib diisi." };
  if (!periode) return { ok: false, error: "Periode wajib diisi." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kepengurusan")
    .insert({
      nama,
      periode,
      catatan: str(fd, "catatan"),
      sort: await nextSort(supabase),
      aktif: false,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  const source = str(fd, "salin_dari") || null;
  if (data) {
    const { map, error: grupError } = await setupGroups(supabase, source, data.id);
    if (grupError) {
      // Roll back the empty board so a failed copy leaves nothing behind.
      await supabase.from("kepengurusan").delete().eq("id", data.id);
      return { ok: false, error: grupError };
    }

    if (source) {
      const copyError = await copyRows(supabase, source, data.id, map);
      if (copyError) {
        await supabase.from("kepengurusan").delete().eq("id", data.id);
        return { ok: false, error: copyError };
      }
    }
  }

  revalidatePublic();
  return { ok: true };
}

export async function updateKepengurusan(
  id: string,
  fd: FormData
): Promise<KepengurusanResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const nama = str(fd, "nama");
  const periode = str(fd, "periode");
  if (!nama) return { ok: false, error: "Nama kepengurusan wajib diisi." };
  if (!periode) return { ok: false, error: "Periode wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("kepengurusan")
    .update({ nama, periode, catatan: str(fd, "catatan") })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function deleteKepengurusan(id: string): Promise<KepengurusanResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await createClient();
  const { data: board } = await supabase
    .from("kepengurusan")
    .select("aktif")
    .eq("id", id)
    .maybeSingle();
  if (board?.aktif) {
    return {
      ok: false,
      error: "Kepengurusan aktif tidak bisa dihapus. Aktifkan yang lain dulu.",
    };
  }

  // pengurus rows cascade via the FK.
  const { error } = await supabase.from("kepengurusan").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function activateKepengurusan(id: string): Promise<KepengurusanResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("activate_kepengurusan", { p_id: id });
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function duplicateKepengurusan(
  id: string,
  fd: FormData
): Promise<KepengurusanResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await createClient();
  const { data: source, error: readError } = await supabase
    .from("kepengurusan")
    .select("nama, periode")
    .eq("id", id)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };
  if (!source) return { ok: false, error: "Kepengurusan sumber tidak ditemukan." };

  const nama = str(fd, "nama") || `${source.nama} (salinan)`;
  const periode = str(fd, "periode") || source.periode;

  const { data: created, error: createError } = await supabase
    .from("kepengurusan")
    .insert({
      nama,
      periode,
      catatan: str(fd, "catatan"),
      sort: await nextSort(supabase),
      aktif: false,
    })
    .select("id")
    .single();
  if (createError) return { ok: false, error: createError.message };

  const { map, error: grupError } = await setupGroups(supabase, id, created.id);
  if (grupError) {
    await supabase.from("kepengurusan").delete().eq("id", created.id);
    return { ok: false, error: grupError };
  }

  const copyError = await copyRows(supabase, id, created.id, map);
  if (copyError) {
    await supabase.from("kepengurusan").delete().eq("id", created.id);
    return { ok: false, error: copyError };
  }

  revalidatePublic();
  return { ok: true };
}
