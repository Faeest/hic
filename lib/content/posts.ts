import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import { clampPage, pageCount, pageRange } from "@/lib/pagination";
import { parseCrop } from "@/lib/media/focus";
import type { Post, PostPage, PostRow, PostSummary } from "@/lib/types";
import { posts as seedPosts } from "@/data/posts";
import { warnFallback } from "./util";

/**
 * Seed posts. Never return an empty list: `app/blog/[slug]` uses
 * `generateStaticParams`, and Cache Components fails the build when it returns
 * zero params. An unreachable or empty `posts` table must degrade to seed
 * content instead of breaking `next build`.
 */
export const seedPostList: Post[] = seedPosts;

/** Cards per index page: three columns, three rows. */
export const POSTS_PER_PAGE = 9;

/** Everything the index renders. `body_md` is deliberately absent. */
const SUMMARY_COLUMNS =
  "id, slug, title, excerpt, cover_url, cover_crop, tags, published_at";

function toApp(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverUrl: row.cover_url,
    coverCrop: row.cover_crop ? parseCrop(row.cover_crop) : undefined,
    bodyMd: row.body_md,
    tags: row.tags ?? [],
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSummary(row: PostRow): PostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverUrl: row.cover_url,
    coverCrop: row.cover_crop ? parseCrop(row.cover_crop) : undefined,
    tags: row.tags ?? [],
    publishedAt: row.published_at,
  };
}

function summaryOf(post: Post): PostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverUrl: post.coverUrl,
    coverCrop: post.coverCrop,
    tags: post.tags,
    publishedAt: post.publishedAt,
  };
}

/**
 * One page of the blog index, newest first.
 *
 * The count is read first so an out-of-range `?page=` can be clamped to the last
 * real page instead of rendering an empty grid — a cached function cannot
 * redirect, and the caller has no way to know the page count up front.
 *
 * Both queries are cached under the posts tag, so a page costs one round trip
 * the first time and nothing afterwards until content changes.
 */
export async function getPostPage(page: number): Promise<PostPage> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("max");

  const requested = Math.max(1, Math.floor(page) || 1);

  try {
    const { count, error: countError } = await publicDb
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("published", true);
    if (countError) throw countError;

    const total = count ?? 0;
    const pages = pageCount(total, POSTS_PER_PAGE);
    const current = clampPage(requested, pages);
    if (total === 0) return { items: [], total: 0, page: 1, pages: 1 };

    const [from, to] = pageRange(current, POSTS_PER_PAGE);
    const { data, error } = await publicDb
      .from("posts")
      .select(SUMMARY_COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(from, to);
    if (error) throw error;

    return {
      items: ((data ?? []) as PostRow[]).map(toSummary),
      total,
      page: current,
      pages,
    };
  } catch (error) {
    warnFallback("posts", error);
    const total = seedPostList.length;
    const pages = pageCount(total, POSTS_PER_PAGE);
    const current = clampPage(requested, pages);
    const [from, to] = pageRange(current, POSTS_PER_PAGE);
    return {
      items: seedPostList.slice(from, to + 1).map(summaryOf),
      total,
      page: current,
      pages,
    };
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

export type PostIndexEntry = { slug: string; publishedAt: string | null };

/**
 * Slug + date for every published post. Feeds `generateStaticParams` and the
 * sitemap, which need the whole set but none of the article bodies.
 */
export async function getPostIndex(): Promise<PostIndexEntry[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("posts")
      .select("slug, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as Pick<PostRow, "slug" | "published_at">[]).map(
      (row) => ({ slug: row.slug, publishedAt: row.published_at })
    );
  } catch (error) {
    warnFallback("posts", error);
    return seedPostList.map((p) => ({
      slug: p.slug,
      publishedAt: p.publishedAt,
    }));
  }
}

/** Published slugs, for generateStaticParams. */
export async function getPostSlugs(): Promise<string[]> {
  const index = await getPostIndex();
  return index.map((p) => p.slug);
}
