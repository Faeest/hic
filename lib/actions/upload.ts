"use server";

import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

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
