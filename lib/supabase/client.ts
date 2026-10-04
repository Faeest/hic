"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Browser client. Used by client components for auth (login form) and any
 * client-side reads. Singleton per tab via @supabase/ssr.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabasePublishableKey());
}
