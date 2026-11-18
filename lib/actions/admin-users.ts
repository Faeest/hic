"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteOrigin } from "@/lib/site-url";

export type AdminUserResult = { ok: true } | { ok: false; error: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Supabase's admin API pages at 200; walk until the last page. */
const USERS_PER_PAGE = 200;
const MAX_USER_PAGES = 50;

/** Find an existing auth user by email (admin API has no direct lookup). */
async function findUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  for (let page = 1; page <= MAX_USER_PAGES; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: USERS_PER_PAGE,
    });
    if (error) throw new Error(error.message);
    const found = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === email
    );
    if (found) return found.id;
    if (data.users.length < USERS_PER_PAGE) break;
  }
  return null;
}

/**
 * Add an admin. Existing accounts are allowlisted directly; new addresses get
 * a Supabase invite whose link lands on /admin/reset to set a password.
 */
export async function inviteAdmin(fd: FormData): Promise<AdminUserResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }

  const email = str(fd, "email").toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Email tidak valid." };
  }

  const admin = createAdminClient();
  try {
    let userId = await findUserIdByEmail(admin, email);

    if (!userId) {
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${await siteOrigin()}/admin/reset`,
      });
      if (error) return { ok: false, error: error.message };
      userId = data.user?.id ?? null;
    }

    if (!userId) return { ok: false, error: "Gagal membuat akun." };

    const { error } = await admin
      .from("admin_users")
      .upsert({ user_id: userId, email }, { onConflict: "user_id" });
    if (error) return { ok: false, error: error.message };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Gagal menambah admin.",
    };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

/** Remove an admin from the allowlist. The auth account itself is kept. */
export async function removeAdmin(userId: string): Promise<AdminUserResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }

  if (!userId) return { ok: false, error: "Admin tidak ditemukan." };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (claims?.claims?.sub === userId) {
    return { ok: false, error: "Tidak bisa menghapus akun sendiri." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_users")
    .delete()
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}
