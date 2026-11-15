import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth/dal";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import type { AdminUserRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const [supabase, session] = await Promise.all([
    createClient(),
    getAdminSession(),
  ]);

  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });

  const users = (data ?? []) as AdminUserRow[];
  const selfId =
    typeof session?.sub === "string" ? session.sub : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Admin
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Hanya akun di daftar ini yang bisa masuk dan mengubah konten. Tambah
          pengurus baru tiap periode, cabut akses yang sudah tidak menjabat.
        </p>
      </div>

      <AdminUsersManager users={users} selfId={selfId} />
    </div>
  );
}
