import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Post, PostRow } from "@/lib/types";

function toApp(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverUrl: row.cover_url,
    bodyMd: row.body_md,
    tags: row.tags ?? [],
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** All posts (including drafts) — admin only. */
export async function adminPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as PostRow[]) ?? []).map(toApp);
}

export async function adminPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toApp(data as PostRow) : null;
}
