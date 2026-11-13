/**
 * Serve the public `media` bucket from the site's own domain:
 * `/media/<bucket-path>` → `<SUPABASE_URL>/storage/v1/object/public/media/<path>`.
 *
 * Why a route handler instead of a `rewrite`: the rewrite proxy replaces the
 * bucket's cache headers with `private, no-cache`, so every image would be
 * re-fetched through the VPS on each view. Here we set the caching explicitly.
 *
 * Caching is deliberately short-lived: an object can be *replaced in place*
 * (`replaceMedia`), which keeps its URL stable so rows never need editing.
 * A long `immutable` cache would pin the old bytes, so clients revalidate after
 * a minute and the forwarded `ETag` turns those revalidations into cheap 304s.
 *
 * The bucket is the single source for content images. `public/` keeps only
 * build-owned brand assets (logo variants, favicon) — one of which is served as
 * a fallback when Supabase is unreachable, so a paused project never leaves the
 * site unbranded.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

const BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

const CACHE = "public, max-age=60, must-revalidate";

/**
 * Supabase's CDN keeps serving the old bytes for the object's whole TTL after an
 * in-place replace, and there is no purge API (verified: `cacheControl: "0"` on
 * the replacement does not help, and no request header bypasses it). Only a
 * different URL gets fresh bytes, so the upstream fetch carries a coarse
 * time bucket: one CDN entry per minute, and a replaced object shows up within
 * a minute instead of an hour.
 */
const BUCKET_MS = 60_000;

/** Brand asset served when the bucket cannot be reached (pause, outage). */
const FALLBACK_FILE = path.join(
  process.cwd(),
  "public",
  "variant_logo-hic",
  "Logogram ORANGE BLACK.png"
);

let fallbackBytes: Buffer | null = null;

async function fallbackResponse(): Promise<Response> {
  if (!fallbackBytes) {
    try {
      fallbackBytes = await readFile(FALLBACK_FILE);
    } catch {
      return new Response("Not found", { status: 404 });
    }
  }
  return new Response(new Uint8Array(fallbackBytes), {
    status: 200,
    headers: {
      "content-type": "image/png",
      // Short: once Supabase is back, the real image must win again.
      "cache-control": "public, max-age=60",
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.join("/");

  // Reject traversal and empty keys; `..` never appears in a storage key.
  if (!BASE || !key || key.includes("..") || key.startsWith("/")) {
    return new Response("Not found", { status: 404 });
  }

  const upstreamUrl = `${BASE}/storage/v1/object/public/media/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}?v=${Math.floor(Date.now() / BUCKET_MS)}`;

  // Revalidation support: a replaced object gets a new ETag, so a conditional
  // request both saves bandwidth and picks up the swap.
  const ifNoneMatch = request.headers.get("if-none-match");

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      cache: "no-store",
      headers: ifNoneMatch ? { "if-none-match": ifNoneMatch } : undefined,
    });
  } catch {
    // Network failure / DNS / paused project — keep the page branded.
    return fallbackResponse();
  }

  if (upstream.status === 304) {
    const etag304 = upstream.headers.get("etag");
    return new Response(null, {
      status: 304,
      headers: {
        "cache-control": CACHE,
        ...(etag304 ? { etag: etag304 } : {}),
      },
    });
  }

  // A missing object is a real 404; a broken upstream is not.
  if (upstream.status >= 500) return fallbackResponse();

  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "content-type":
      upstream.headers.get("content-type") ?? "application/octet-stream",
    "cache-control": CACHE,
  };
  const length = upstream.headers.get("content-length");
  if (length) headers["content-length"] = length;
  const etag = upstream.headers.get("etag");
  if (etag) headers.etag = etag;
  const lastModified = upstream.headers.get("last-modified");
  if (lastModified) headers["last-modified"] = lastModified;

  return new Response(upstream.body, { headers });
}
