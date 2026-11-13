/**
 * Serve the public `media` bucket from the site's own domain:
 * `/media/<bucket-path>` → `<SUPABASE_URL>/storage/v1/object/public/media/<path>`.
 *
 * Why a route handler instead of a `rewrite`: the rewrite proxy replaces the
 * bucket's cache headers with `private, no-cache`, so every image would be
 * re-fetched through the VPS on each view. Here we set the caching explicitly.
 * Storage keys end in `-<timestamp>` and uploads never overwrite
 * (`upsert: false`), so a URL's bytes are permanent — safe to cache hard.
 *
 * Stored DB values keep their absolute Supabase URLs and still work; this only
 * gives admins a domain-branded URL to copy.
 */

const BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.join("/");

  // Reject traversal and empty keys; `..` never appears in a storage key.
  if (!BASE || !key || key.includes("..") || key.startsWith("/")) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(
    `${BASE}/storage/v1/object/public/media/${key.split("/").map(encodeURIComponent).join("/")}`,
    { cache: "no-store" }
  );

  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "content-type":
      upstream.headers.get("content-type") ?? "application/octet-stream",
    "cache-control": "public, max-age=31536000, immutable",
  };
  const length = upstream.headers.get("content-length");
  if (length) headers["content-length"] = length;
  const etag = upstream.headers.get("etag");
  if (etag) headers.etag = etag;

  return new Response(upstream.body, { headers });
}
