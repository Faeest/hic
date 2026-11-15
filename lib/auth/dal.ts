import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer for admin authorization.
 *
 * `requireAdmin()` is the single secure check used by every admin page and
 * Server Action. It verifies the session against Supabase Auth (not just the
 * cookie) so a forged/expired cookie cannot pass.
 *
 * Memoized per render pass via React `cache`.
 */
export const getAdminSession = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  // A valid Supabase session is not enough: the user must be on the allowlist.
  // RLS enforces the same rule, this keeps the UI honest.
  const userId = data.claims.sub;
  if (!userId) return null;
  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (adminError || !admin) return null;

  return data.claims;
});

/** Redirects to the login page when there is no valid session. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Non-redirecting variant for Server Actions, which should fail closed
 * without navigating. Returns null when unauthorized.
 */
export async function assertAdmin(): Promise<{ email: string | null }> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return { email: typeof session.email === "string" ? session.email : null };
}
