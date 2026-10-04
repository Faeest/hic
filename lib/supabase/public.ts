import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Public read-only client for the content layer.
 *
 * Cookie-less by design: public content is identical for every visitor and is
 * protected by RLS (anon can read published rows only). Not reading cookies
 * keeps public routes prerenderable instead of forcing dynamic rendering.
 *
 * A module-scope singleton is safe here — there is no per-request state.
 * The cookie-bound client in `./server.ts` remains the one used for auth/admin.
 */
export const publicDb = createClient<Database>(
  supabaseUrl(),
  supabasePublishableKey(),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
