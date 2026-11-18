import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { MediaItem } from "@/lib/types";

export type { MediaItem };

export type MediaListing = {
  items: MediaItem[];
  /** true when the bucket holds more objects than the walk was willing to read. */
  truncated: boolean;
};

type StorageEntry = {
  name: string;
  id: string | null;
  updated_at?: string | null;
  metadata?: { size?: number } | null;
};

/** Objects requested per `list()` call. Storage returns at most this many. */
const PER_CALL = 100;

/**
 * Ceiling for one listing. Above this the picker becomes unusable long before
 * the network does, and an admin scrolling thousands of thumbnails is looking
 * for a search box rather than a longer grid.
 */
const MAX_ITEMS = 2000;

const isFolder = (entry: StorageEntry) => entry.id === null;

/**
 * Walk the public `media` bucket (one level of folders, matching how uploads are
 * filed) and return everything newest-first.
 *
 * `list()` returns at most `limit` entries and reports no total, so the only way
 * to know a directory has more is to page until a short page comes back.
 * Stopping at the first page — the previous behaviour — silently hid every file
 * past the hundredth.
 *
 * Admin-only and called on demand, so it is not cached: a stale listing right
 * after an upload would be worse than the round trip.
 */
export async function listMedia(): Promise<MediaListing> {
  const supabase = await createClient();
  const bucket = supabase.storage.from("media");

  const listDir = async (prefix: string, budget: number) => {
    const entries: StorageEntry[] = [];
    let offset = 0;

    for (;;) {
      const limit = Math.min(PER_CALL, budget - entries.length);
      if (limit <= 0) return { entries, exhausted: false };

      const { data, error } = await bucket.list(prefix, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
      if (error || !data || data.length === 0) break;

      entries.push(...(data as StorageEntry[]));
      if (data.length < limit) break;
      offset += data.length;
    }

    return { entries, exhausted: true };
  };

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

  const root = await listDir("", MAX_ITEMS);
  let truncated = !root.exhausted;

  root.entries.filter((e) => !isFolder(e)).forEach((f) => push(f, ""));

  for (const folder of root.entries.filter(isFolder)) {
    if (items.length >= MAX_ITEMS) {
      truncated = true;
      break;
    }

    const dir = await listDir(folder.name, MAX_ITEMS - items.length);
    if (!dir.exhausted) truncated = true;
    dir.entries.filter((e) => !isFolder(e)).forEach((f) => push(f, folder.name));
  }

  return {
    items: items
      .slice(0, MAX_ITEMS)
      .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")),
    truncated,
  };
}
