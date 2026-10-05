import type { NextConfig } from "next";

/**
 * Hostname of the Supabase project, used to allow uploaded media through
 * `next/image`. Parsed defensively: a malformed value must not crash config
 * loading with a bare `TypeError: Invalid URL` before the app can report which
 * env var is wrong. Validation with a helpful message lives in
 * `lib/supabase/env.ts`.
 */
function supabaseHostname(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return undefined;
  try {
    return new URL(raw).hostname || undefined;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseHostname();

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      // Supabase Storage public URLs (uploaded media).
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : []),
    ],
  },
};

export default nextConfig;
