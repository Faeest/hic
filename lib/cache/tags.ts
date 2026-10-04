/**
 * Cache tags for on-demand revalidation.
 *
 * Under Cache Components (`cacheComponents: true` in next.config.ts), every
 * `use cache` scope tagged here can be invalidated by name via `revalidateTag`.
 *
 * `revalidatePublic()` already calls `revalidatePath`, which works regardless.
 * The tags add a finer-grained alternative: a Server Action that only edits
 * site settings can call `revalidateTag("site")` without touching the blog
 * cache, etc.
 */
export const CONTENT_TAGS = {
  site: "content:site",
  sections: "content:sections",
  divisi: "content:divisi",
  pengurus: "content:pengurus",
  proker: "content:proker",
  galeri: "content:galeri",
  faq: "content:faq",
  posts: "content:posts",
} as const;

/** All content tags, for full invalidation. */
export const ALL_CONTENT_TAGS = Object.values(CONTENT_TAGS);
