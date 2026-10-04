import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { supabaseSecretKey, supabaseUrl } from "./env";

/**
 * Service-role client. BYPASSES RLS.
 *
 * Use ONLY in the seed script and other trusted, admin-only server code that
 * must read unpublished rows or manage auth users. Never import this into a
 * route or component that a request can reach with user input.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl(), supabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
