"use server";

import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/actions/revalidate";
import type { PengurusRow } from "@/lib/types";

export type KepengurusanResult = { ok: true } | { ok: false; error: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Copy every pengurus row of `sourceId` into `targetId`. */
async function copyRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sourceId: string,
  targetId: string
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

  const source = str(fd, "salin_dari");
  if (source && data) {
    const copyError = await copyRows(supabase, source, data.id);
    if (copyError) {
      // Roll back the empty board so a failed copy leaves nothing behind.
      await supabase.from("kepengurusan").delete().eq("id", data.id);
      return { ok: false, error: copyError };
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

  const copyError = await copyRows(supabase, id, created.id);
  if (copyError) {
    await supabase.from("kepengurusan").delete().eq("id", created.id);
    return { ok: false, error: copyError };
  }

  revalidatePublic();
  return { ok: true };
}
