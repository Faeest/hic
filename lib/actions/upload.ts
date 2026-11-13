"use server";

import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/actions/revalidate";

const MAX_BYTES = 10 * 1024 * 1024; // matches the `media` bucket limit
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export type UploadResult = { url?: string; error?: string };

/** Sanitize a filename into a safe storage key. */
function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}-${Date.now()}${ext}`;
}

/**
 * Upload an image to the public `media` bucket and return its URL.
 * Called from the client ImageField via a Server Action.
 */
export async function uploadImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Tidak diizinkan." };
  }

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "site").replace(
    /[^a-z0-9-_/]/gi,
    ""
  );

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Tidak ada berkas." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Ukuran berkas melebihi 10 MB." };
  }
  if (!ALLOWED.includes(file.type)) {
    return { error: `Tipe berkas tidak didukung: ${file.type || "tidak diketahui"}.` };
  }

  const supabase = await createClient();
  const path = `${folder}/${safeName(file.name)}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}

/**
 * Permanently remove one object from the `media` bucket.
 *
 * Deleting a file that a row still points at leaves a broken image, so the UI
 * warns before calling this.
 */
export async function deleteMedia(path: string): Promise<UploadResult> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Tidak diizinkan." };
  }

  if (!path || path.includes("..")) return { error: "Path tidak valid." };

  const supabase = await createClient();
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) return { error: error.message };

  revalidatePublic();
  return { url: undefined };
}

/**
 * Overwrite an existing object in place, keeping its storage key — and therefore
 * its public URL — unchanged, so every row pointing at it shows the new image
 * without an edit.
 *
 * Supabase's CDN does not purge on overwrite, so the `/media/...` route handler
 * fetches with a per-minute cache bucket; a replacement becomes visible within
 * about a minute. Direct Supabase URLs (legacy rows) can lag up to the object's
 * TTL.
 */
export async function replaceMedia(
  formData: FormData
): Promise<UploadResult> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Tidak diizinkan." };
  }

  const file = formData.get("file");
  const path = String(formData.get("path") ?? "");

  if (!path || path.includes("..") || path.startsWith("/")) {
    return { error: "Path tidak valid." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Tidak ada berkas." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Ukuran berkas melebihi 10 MB." };
  }
  if (!ALLOWED.includes(file.type)) {
    return { error: `Tipe berkas tidak didukung: ${file.type || "tidak diketahui"}.` };
  }

  // Uploading across extensions would leave the key's name and the object's
  // Content-Type disagreeing; the UI never does this, so treat it as a bug.
  const ext = (name: string) => {
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? name.slice(dot).toLowerCase() : "";
  };
  if (ext(file.name) !== ext(path)) {
    return { error: "Jenis berkas harus sama dengan berkas aslinya." };
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) return { error: error.message };

  revalidatePublic();
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}
