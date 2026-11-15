import "server-only";

import { headers } from "next/headers";

/**
 * Canonical public origin for auth e-mail links.
 *
 * `NEXT_PUBLIC_SITE_URL` wins so links never depend on the request host (a
 * preview deployment or a local dev server would otherwise leak into the
 * invite/reset e-mail). Falls back to the forwarded host.
 */
export async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}
