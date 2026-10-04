"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { isAllowedTable, type CrudTable } from "@/lib/admin/tables";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CrudResult = { ok: true } | { ok: false; error: string };

/**
 * The generic CRUD helper operates on a runtime-chosen table, so the strictly
 * typed client can't resolve the union. We use a loosely-typed view of the same
 * authenticated client; RLS is still the real guard.
 */
async function looseClient(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

/** Tables the generic CRUD helper is allowed to touch. */
function isAllowed(table: string) {
  return isAllowedTable(table);
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function num(fd: FormData, key: string, fallback = 0): number {
  const v = fd.get(key);
  const n = typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

/** Build a row payload from form fields, skipping keys not present. */
function buildPayload(table: CrudTable, fd: FormData): Record<string, unknown> {
  const pick = (keys: string[], mapper: (k: string) => unknown) =>
    Object.fromEntries(keys.filter((k) => fd.has(k)).map((k) => [k, mapper(k)]));

  const textKeys: Record<CrudTable, string[]> = {
    sections: ["key", "kicker", "label", "title", "accent"],
    divisi: [
      "slug",
      "nama",
      "nama_panjang",
      "angka",
      "tagline",
      "deskripsi",
      "akronim",
    ],
    kurikulum: ["nomor", "judul", "durasi", "deskripsi"],
    mentor: ["nama", "fokus"],
    pengurus: ["nama", "jabatan", "deskripsi", "inisial", "gradien", "kategori"],
    proker: [
      "judul",
      "kategori",
      "divisi_slug",
      "tahun",
      "deskripsi",
      "dana",
      "warna",
    ],
    galeri: ["image_url", "judul", "keterangan"],
    faq: ["pertanyaan", "jawaban"],
  };

  const payload: Record<string, unknown> = {};
  Object.assign(payload, pick(textKeys[table], (k) => str(fd, k)));

  if (fd.has("sort")) payload.sort = num(fd, "sort");
  if (fd.has("published")) payload.published = bool(fd, "published");
  if (fd.has("visible")) payload.visible = bool(fd, "visible");

  // divisi.warna is a json blob submitted by the warna sub-fields.
  if (table === "divisi") {
    payload.warna = {
      utama: str(fd, "warna_utama"),
      terang: str(fd, "warna_terang"),
      latar: str(fd, "warna_latar"),
      latarDark: str(fd, "warna_latarDark"),
      border: str(fd, "warna_border"),
      borderDark: str(fd, "warna_borderDark"),
    };
  }

  // kurikulum/mentor carry their parent id.
  if ((table === "kurikulum" || table === "mentor") && fd.has("divisi_id")) {
    payload.divisi_id = str(fd, "divisi_id");
  }

  // galeri.span is nullable.
  if (table === "galeri" && fd.has("span")) {
    const span = str(fd, "span");
    payload.span = span === "wide" || span === "tall" ? span : null;
  }

  return payload;
}

export async function createRow(table: string, fd: FormData): Promise<CrudResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!isAllowed(table)) return { ok: false, error: `Tabel tidak dikenal: ${table}` };

  const supabase = await looseClient();
  const { error } = await supabase.from(table).insert(buildPayload(table, fd));
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/divisi/[slug]", "page");
  return { ok: true };
}

export async function updateRow(
  table: string,
  id: string,
  fd: FormData
): Promise<CrudResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!isAllowed(table)) return { ok: false, error: `Tabel tidak dikenal: ${table}` };
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await looseClient();
  const { error } = await supabase
    .from(table)
    .update(buildPayload(table, fd))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/divisi/[slug]", "page");
  return { ok: true };
}

export async function deleteRow(table: string, id: string): Promise<CrudResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!isAllowed(table)) return { ok: false, error: `Tabel tidak dikenal: ${table}` };
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await looseClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/divisi/[slug]", "page");
  return { ok: true };
}

/** Reorder helper: set explicit `sort` values for a list of ids. */
export async function reorderRows(
  table: string,
  ids: string[]
): Promise<CrudResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!isAllowed(table)) return { ok: false, error: `Tabel tidak dikenal: ${table}` };

  const supabase = await looseClient();
  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from(table)
      .update({ sort: i })
      .eq("id", ids[i]);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/divisi/[slug]", "page");
  return { ok: true };
}
