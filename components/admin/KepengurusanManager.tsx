"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash,
  Copy,
  CheckCircle,
  X,
  Power,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { TextField } from "./fields/TextField";
import { TextArea } from "./fields/TextArea";
import { SubmitButton } from "./fields/SubmitButton";
import {
  activateKepengurusan,
  createKepengurusan,
  deleteKepengurusan,
  duplicateKepengurusan,
  updateKepengurusan,
} from "@/lib/actions/kepengurusan";
import type { KepengurusanRow } from "@/lib/types";

type FormState =
  | { kind: "create" }
  | { kind: "edit"; board: KepengurusanRow }
  | { kind: "duplicate"; board: KepengurusanRow };

export function KepengurusanManager({
  boards,
  counts,
}: {
  boards: KepengurusanRow[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setForm(null);
    setError(null);
  };

  const run = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(true);
    setError(null);
    const res = await fn();
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Gagal menyimpan.");
      return false;
    }
    router.refresh();
    return true;
  };

  const onActivate = (board: KepengurusanRow) =>
    run(() => activateKepengurusan(board.id));

  const onDelete = async (board: KepengurusanRow) => {
    if (
      !confirm(
        `Hapus "${board.nama}" beserta ${counts[board.id] ?? 0} pengurus di dalamnya?`
      )
    )
      return;
    await run(() => deleteKepengurusan(board.id));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    const fd = new FormData(event.currentTarget);
    const ok = await run(() =>
      form.kind === "create"
        ? createKepengurusan(fd)
        : form.kind === "edit"
          ? updateKepengurusan(form.board.id, fd)
          : duplicateKepengurusan(form.board.id, fd)
    );
    if (ok) close();
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-faint">{boards.length} kepengurusan</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setForm({ kind: "create" });
          }}
          className="inline-flex items-center gap-2 rounded-sm bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          <Plus size={16} weight="bold" />
          Kepengurusan baru
        </button>
      </div>

      {form && (
        <div className="glass-panel rounded-sm p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              {form.kind === "create"
                ? "Kepengurusan baru"
                : form.kind === "edit"
                  ? "Ubah kepengurusan"
                  : "Duplikat kepengurusan"}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Nama"
                name="nama"
                required
                defaultValue={
                  form.kind === "create"
                    ? ""
                    : form.kind === "edit"
                      ? form.board.nama
                      : `${form.board.nama} (salinan)`
                }
                placeholder="Kepengurusan 2026/2027"
              />
              <TextField
                label="Periode"
                name="periode"
                required
                defaultValue={form.kind === "create" ? "" : form.board.periode}
                placeholder="2026–2027"
                hint="Dipakai di judul seksi dan halaman Tentang."
              />
            </div>

            <TextArea
              label="Catatan"
              name="catatan"
              rows={2}
              defaultValue={form.kind === "edit" ? form.board.catatan : ""}
              hint="Internal saja, tidak tampil di situs."
            />

            {form.kind === "create" && boards.length > 0 && (
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">Salin isi dari</span>
                <select
                  name="salin_dari"
                  defaultValue=""
                  className="w-full rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
                >
                  <option value="">Kosong</option>
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.nama} ({counts[board.id] ?? 0} pengurus)
                    </option>
                  ))}
                </select>
                <span className="text-xs text-ink-faint">
                  Menyalin membuat baris baru, jadi mengubah salinan tidak
                  menyentuh aslinya.
                </span>
              </label>
            )}

            <div className="flex items-center gap-3 pt-2">
              <SubmitButton>
                {form.kind === "edit" ? "Simpan" : "Buat"}
              </SubmitButton>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {boards.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink-faint dark:border-white/15">
            Belum ada kepengurusan. Klik “Kepengurusan baru” untuk memulai.
          </p>
        )}

        {boards.map((board) => (
          <div
            key={board.id}
            className={cn(
              "glass-panel flex flex-col gap-4 rounded-sm p-4 sm:flex-row sm:items-center sm:p-5",
              board.aktif && "border-ember/40"
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-display text-lg font-semibold text-ink">
                  {board.nama}
                </p>
                {board.aktif && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-ember/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ember">
                    <CheckCircle size={12} weight="fill" /> Aktif
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-ink-soft">
                {board.periode} · {counts[board.id] ?? 0} pengurus
                {board.catatan ? ` · ${board.catatan}` : ""}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onActivate(board)}
                disabled={busy || board.aktif}
                className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-3 py-2 text-sm text-ink-soft transition-colors hover:border-ember/40 hover:text-ember disabled:opacity-40 dark:border-white/15"
              >
                <Power size={15} weight="bold" />
                {board.aktif ? "Aktif" : "Aktifkan"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setForm({ kind: "duplicate", board });
                }}
                aria-label="Duplikat"
                className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
              >
                <Copy size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setForm({ kind: "edit", board });
                }}
                aria-label="Ubah"
                className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
              >
                <Pencil size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(board)}
                disabled={busy || board.aktif}
                aria-label="Hapus"
                className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-red-500 disabled:opacity-30 dark:border-white/15"
              >
                <Trash size={16} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
