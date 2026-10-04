import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Server client for Server Components, Server Actions and Route Handlers.
 *
 * Must be created fresh on every request — never cached in a module variable.
 * `setAll` writes refreshed auth cookies back to the response.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where cookies are
          // read-only. Safe to ignore: proxy.ts refreshes the session.
        }
      },
    },
  });
}

/**
 * Returns the authenticated admin user, or null. Use inside Server Actions to
 * re-verify authorization (actions are POST-reachable).
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  return data.claims;
}
