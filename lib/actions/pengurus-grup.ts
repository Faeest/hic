"use server";

import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/actions/revalidate";
import { isReservedGrup, slugifyGrup } from "@/lib/pengurus-grup";

export type GrupResult = { ok: true } | { ok: false; error: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Pick a slug that is free on this board and not reserved. */
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  boardId: string,
  label: string
): Promise<string> {
  const base = slugifyGrup(label);
  const { data } = await supabase
    .from("pengurus_grup")
    .select("slug")
    .eq("kepengurusan_id", boardId);
  const taken = new Set((data ?? []).map((r) => r.slug));

  let candidate = base;
  let n = 2;
  while (taken.has(candidate) || isReservedGrup(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createGrup(
  boardId: string,
  fd: FormData
): Promise<GrupResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!boardId) return { ok: false, error: "Kepengurusan tidak ditemukan." };

  const label = str(fd, "label");
  if (!label) return { ok: false, error: "Nama kelompok wajib diisi." };

  const supabase = await createClient();
  const { data: board } = await supabase
    .from("kepengurusan")
    .select("id")
    .eq("id", boardId)
    .maybeSingle();
  if (!board) return { ok: false, error: "Kepengurusan tidak ditemukan." };

  const { data: last } = await supabase
    .from("pengurus_grup")
    .select("sort")
    .eq("kepengurusan_id", boardId)
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("pengurus_grup").insert({
    kepengurusan_id: boardId,
    slug: await uniqueSlug(supabase, boardId, label),
    label,
    deskripsi: str(fd, "deskripsi"),
    sort: (last?.sort ?? 0) + 10,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function updateGrup(id: string, fd: FormData): Promise<GrupResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const label = str(fd, "label");
  if (!label) return { ok: false, error: "Nama kelompok wajib diisi." };

  const supabase = await createClient();
  // Slug is immutable: it is the stable key the public reader and the legacy
  // `kategori` bridge rely on. Only the copy changes.
  const { error } = await supabase
    .from("pengurus_grup")
    .update({ label, deskripsi: str(fd, "deskripsi") })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function deleteGrup(id: string): Promise<GrupResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await createClient();
  const { data: grup } = await supabase
    .from("pengurus_grup")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  if (!grup) return { ok: false, error: "Kelompok tidak ditemukan." };
  if (isReservedGrup(grup.slug)) {
    return {
      ok: false,
      error: "Kelompok tetap — tidak bisa dihapus. Ubah nama atau deskripsinya saja.",
    };
  }

  const { count, error: countError } = await supabase
    .from("pengurus")
    .select("id", { count: "exact", head: true })
    .eq("grup_id", id);
  if (countError) return { ok: false, error: countError.message };
  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Kelompok ini masih berisi ${count} orang. Pindahkan dulu ke kelompok lain sebelum menghapus.`,
    };
  }

  const { error } = await supabase.from("pengurus_grup").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Persist the order of the configurable groups. Reserved groups stay pinned. */
export async function reorderGrup(
  boardId: string,
  ids: string[]
): Promise<GrupResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!boardId) return { ok: false, error: "Kepengurusan tidak ditemukan." };

  const supabase = await createClient();
  const { data, error: readError } = await supabase
    .from("pengurus_grup")
    .select("id, slug")
    .eq("kepengurusan_id", boardId);
  if (readError) return { ok: false, error: readError.message };

  const allowed = new Set(
    (data ?? []).filter((g) => !isReservedGrup(g.slug)).map((g) => g.id)
  );
  const ordered = ids.filter((id) => allowed.has(id));

  for (let i = 0; i < ordered.length; i++) {
    const { error } = await supabase
      .from("pengurus_grup")
      .update({ sort: 100 + i * 10 })
      .eq("id", ordered[i]);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePublic();
  return { ok: true };
}
