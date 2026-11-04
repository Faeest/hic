import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { Post, PostRow } from "@/lib/types";
import { posts as seedPosts } from "@/data/posts";
import { warnFallback } from "./util";

/**
 * Seed posts. Never return an empty list: `app/blog/[slug]` uses
 * `generateStaticParams`, and Cache Components fails the build when it returns
 * zero params. An unreachable or empty `posts` table must degrade to seed
 * content instead of breaking `next build`.
 */
export const seedPostList: Post[] = seedPosts;

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
    const rows = (data as PostRow[]) ?? [];
    if (rows.length === 0) {
      warnFallback("posts", "no published rows");
      return seedPostList;
    }
    return rows.map(toApp);
  } catch (error) {
    warnFallback("posts", error);
    return seedPostList;
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
    return seedPostList.find((p) => p.slug === slug) ?? null;
  }
}

/** Published slugs, for generateStaticParams / sitemap. */
export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((p) => p.slug);
}
