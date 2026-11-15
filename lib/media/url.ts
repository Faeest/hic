/**
 * Convert a Supabase Storage public URL into the site's own `/media/...` path.
 *
 * The `/media/[...path]` route proxies the object through Next.js, so published
 * pages never expose the Supabase project ref and can use the app's caching.
 */
export function toSiteMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("/media/")) return url;

  const match = url.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (match) return `/media/${match[1].split("?")[0]}`;

  return url;
}
