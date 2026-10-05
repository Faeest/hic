/**
 * Centralised env access. Throws early with a clear message rather than
 * failing deep inside a request with `undefined` being passed to Supabase.
 */

const HINT =
  "Locally: copy .env.example to .env.local and fill it in. " +
  "On Vercel: Project → Settings → Environment Variables " +
  "(tick Production and Preview), then redeploy.";

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing environment variable ${name}. ${HINT}`);
  }
  return trimmed;
}

/**
 * Supabase project URL, e.g. `https://<project-ref>.supabase.co`.
 *
 * Validated here because `@supabase/supabase-js` only checks for a leading
 * `http(s)://` and otherwise throws a cryptic "Invalid supabaseUrl" from deep
 * inside `createClient` — which fails the whole build with no clue as to which
 * env var is wrong.
 *
 * The prefix check is deliberately explicit: `new URL()` alone accepts
 * malformed inputs like `https:/host` (single slash) and silently normalises
 * them, which is a common copy-paste mistake.
 */
export function supabaseUrl(): string {
  const value = required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );

  if (!/^https?:\/\//i.test(value)) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must start with "https://" (or "http://"), ` +
        `got ${JSON.stringify(value)}. ` +
        `Expected something like "https://<project-ref>.supabase.co". ${HINT}`
    );
  }

  let hostname: string;
  try {
    hostname = new URL(value).hostname;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${JSON.stringify(value)}. ` +
        `Expected something like "https://<project-ref>.supabase.co". ${HINT}`
    );
  }
  if (!hostname) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL has no hostname: ${JSON.stringify(value)}. ` +
        `Expected something like "https://<project-ref>.supabase.co". ${HINT}`
    );
  }

  return value;
}

/** Publishable/anon key — safe to expose to the browser. */
export function supabasePublishableKey(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Service-role secret. Server-only. Importing this into anything that reaches
 * the browser will break the build, by design.
 */
export function supabaseSecretKey(): string {
  return required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);
}
