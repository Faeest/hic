"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash, UserCircle } from "@phosphor-icons/react";
import { withToast } from "@/lib/admin/toast";
import { inviteAdmin, removeAdmin } from "@/lib/actions/admin-users";
import type { AdminUserRow } from "@/lib/types";

export function AdminUsersManager({
  users,
  selfId,
}: {
  users: AdminUserRow[];
  selfId: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onInvite = async (fd: FormData) => {
    setError(null);
    setBusy(true);
    const res = await withToast(inviteAdmin(fd), {
      loading: "Menambahkan…",
      success: "Admin ditambahkan. Cek email untuk tautan kata sandi.",
    });
    setBusy(false);
    if (!res.ok) setError(res.error);
    else router.refresh();
  };

  const onRemove = async (user: AdminUserRow) => {
    if (!confirm(`Cabut akses admin untuk ${user.email}?`)) return;
    setBusy(true);
    const res = await withToast(removeAdmin(user.user_id), {
      loading: "Mencabut akses…",
      success: "Akses admin dicabut.",
    });
    setBusy(false);
    if (!res.ok) setError(res.error);
    else router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <form
        action={onInvite}
        className="glass-panel flex flex-col gap-3 rounded-sm p-6 sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-ink-soft">
              Email admin baru
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@stiki.ac.id"
              className="h-[46px] rounded-sm border border-ink/15 bg-white px-4 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-sm bg-ember px-5 text-sm font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
          >
            <Plus size={16} weight="bold" />
            Tambah admin
          </button>
        </div>
        <p className="text-xs text-ink-faint">
          Akun baru menerima email undangan untuk membuat kata sandi.
        </p>
      </form>

      <ul className="flex flex-col gap-3">
        {users.map((user) => {
          const isSelf = user.user_id === selfId;
          return (
            <li
              key={user.user_id}
              className="glass-panel flex items-center gap-3 rounded-sm p-4 sm:gap-4 sm:p-5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-ink/15 text-ink-soft dark:border-white/15">
                <UserCircle size={18} weight="duotone" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold text-ink">
                  {user.email || "(tanpa email)"}
                  {isSelf && (
                    <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-wide text-ink-faint">
                      Anda
                    </span>
                  )}
                </p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {user.user_id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(user)}
                disabled={busy || isSelf}
                aria-label="Cabut akses"
                className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-red-500 disabled:opacity-30 dark:border-white/15"
              >
                <Trash size={16} weight="bold" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
