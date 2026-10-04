import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { Post, PostRow } from "@/lib/types";
import { warnFallback } from "./util";

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

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return ((data as PostRow[]) ?? []).map(toApp);
  } catch (error) {
    warnFallback("posts", error);
    return [];
  }
}

/** A single published post by slug. */
export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return data ? toApp(data as PostRow) : null;
  } catch (error) {
    warnFallback(`post:${slug}`, error);
    return null;
  }
}

/** Published slugs, for generateStaticParams / sitemap. */
export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((p) => p.slug);
}
