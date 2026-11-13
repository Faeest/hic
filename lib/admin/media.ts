import "server-only";

import { createClient } from "@/lib/supabase/server";

export type MediaItem = {
  /** Bucket-relative path, e.g. `galeri/ditkom-2025.webp`. */
  path: string;
  url: string;
  name: string;
  folder: string;
  size: number;
  updatedAt: string | null;
};

type StorageEntry = {
  name: string;
  id: string | null;
  updated_at?: string | null;
  metadata?: { size?: number } | null;
};

const MAX_PER_DIR = 200;

/**
 * Walk the public `media` bucket (one level of folders, matching how uploads are
 * filed) and return everything newest-first.
 */
export async function listMedia(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const bucket = supabase.storage.from("media");

  const { data: root, error } = await bucket.list("", {
    limit: MAX_PER_DIR,
    sortBy: { column: "name", order: "asc" },
  });
  if (error || !root) return [];

  const entries = root as StorageEntry[];
  const folders = entries.filter((e) => e.id === null);
  const rootFiles = entries.filter((e) => e.id !== null);

  const items: MediaItem[] = [];

  const push = (entry: StorageEntry, folder: string) => {
    const path = folder ? `${folder}/${entry.name}` : entry.name;
    items.push({
      path,
      url: bucket.getPublicUrl(path).data.publicUrl,
      name: entry.name,
      folder: folder || "root",
      size: entry.metadata?.size ?? 0,
      updatedAt: entry.updated_at ?? null,
    });
  };

  rootFiles.forEach((f) => push(f, ""));

  for (const folder of folders) {
    const { data } = await bucket.list(folder.name, {
      limit: MAX_PER_DIR,
      sortBy: { column: "updated_at", order: "desc" },
    });
    (data as StorageEntry[] | null)?.forEach((f) => {
      if (f.id !== null) push(f, folder.name);
    });
  }

  return items.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}
