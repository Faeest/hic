"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

export type PostResult = { ok: true; id?: string } | { ok: false; error: string };

/** URL-safe slug from arbitrary text. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parseTags(fd: FormData): string[] {
  const raw = fd.get("tags");
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((t) => String(t)).filter(Boolean);
  } catch {
    /* ignore */
  }
  // Fallback: comma-separated
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildPayload(fd: FormData, existingSlug?: string) {
  const title = str(fd, "title");
  const slugInput = str(fd, "slug");
  const slug = slugify(slugInput || title) || existingSlug || `post-${Date.now()}`;
  const published = fd.get("published") === "on" || fd.get("published") === "true";

  return {
    slug,
    title,
    excerpt: str(fd, "excerpt"),
    cover_url: str(fd, "coverUrl"),
    body_md: String(fd.get("bodyMd") ?? ""),
    tags: parseTags(fd),
    published,
  };
}

export async function createPost(fd: FormData): Promise<PostResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }

  const payload = buildPayload(fd);
  if (!payload.title) return { ok: false, error: "Judul wajib diisi." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...payload, published_at: new Date().toISOString() })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  return { ok: true, id: data?.id };
}

export async function updatePost(id: string, fd: FormData): Promise<PostResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const payload = buildPayload(fd);
  if (!payload.title) return { ok: false, error: "Judul wajib diisi." };

  const supabase = await createClient();

  // Preserve the original publish date; set it the first time it goes live.
  const { data: current } = await supabase
    .from("posts")
    .select("published, published_at")
    .eq("id", id)
    .maybeSingle();

  const firstPublish =
    payload.published && !current?.published_at
      ? { published_at: new Date().toISOString() }
      : {};

  const { error } = await supabase
    .from("posts")
    .update({ ...payload, ...firstPublish })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  return { ok: true, id };
}

export async function deletePost(id: string): Promise<PostResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }
  if (!id) return { ok: false, error: "ID tidak ditemukan." };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  return { ok: true };
}

/** Used by the admin editor's "save & view" flow. */
export async function createPostAndRedirect(fd: FormData) {
  const res = await createPost(fd);
  if (res.ok && res.id) redirect(`/admin/posts/${res.id}`);
}
