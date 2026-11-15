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
import { SelectField } from "./fields/SelectField";
import { SubmitButton } from "./fields/SubmitButton";
import {
  activateKepengurusan,
  createKepengurusan,
  deleteKepengurusan,
  duplicateKepengurusan,
  updateKepengurusan,
} from "@/lib/actions/kepengurusan";
import { withToast } from "@/lib/admin/toast";
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
  const [confirmDelete, setConfirmDelete] = useState<{
    board: KepengurusanRow;
    value: string;
  } | null>(null);

  const close = () => {
    setForm(null);
    setError(null);
  };

  const run = async (
    fn: () => Promise<{ ok: boolean; error?: string }>,
    messages: { loading: string; success: string }
  ) => {
    setBusy(true);
    setError(null);
    const res = await withToast(fn(), messages);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Gagal menyimpan.");
      return false;
    }
    router.refresh();
    return true;
  };

  const onActivate = (board: KepengurusanRow) =>
    run(() => activateKepengurusan(board.id), {
      loading: "Mengaktifkan…",
      success: `${board.nama} sekarang tampil di situs.`,
    });

  const onDelete = async (board: KepengurusanRow) => {
    await run(() => deleteKepengurusan(board.id), {
      loading: "Menyembunyikan…",
      success: "Kepengurusan disembunyikan.",
    });
    setConfirmDelete(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    const fd = new FormData(event.currentTarget);
    const ok = await run(
      () =>
        form.kind === "create"
          ? createKepengurusan(fd)
          : form.kind === "edit"
            ? updateKepengurusan(form.board.id, fd)
            : duplicateKepengurusan(form.board.id, fd),
      {
        loading:
          form.kind === "duplicate" ? "Menyalin…" : "Menyimpan…",
        success:
          form.kind === "create"
            ? "Kepengurusan dibuat."
            : form.kind === "edit"
              ? "Perubahan disimpan."
              : "Salinan dibuat.",
      }
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

      {confirmDelete && (
        <div className="glass-panel flex flex-col gap-4 rounded-sm border border-red-500/30 p-6 sm:p-8">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              Sembunyikan kepengurusan?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              <span className="text-ink">{confirmDelete.board.nama}</span> beserta{" "}
              {counts[confirmDelete.board.id] ?? 0} pengurus tidak akan tampil
              lagi. Datanya tetap tersimpan dan bisa dipulihkan lewat database.
            </p>
          </div>
          <label className="flex flex-col gap-2 text-sm text-ink-soft">
            Ketik nama kepengurusan untuk konfirmasi
            <input
              value={confirmDelete.value}
              onChange={(event) =>
                setConfirmDelete((current) =>
                  current ? { ...current, value: event.target.value } : current
                )
              }
              className="rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={
                busy ||
                confirmDelete.value.trim().toLowerCase() !==
                  confirmDelete.board.nama.trim().toLowerCase()
              }
              onClick={() => onDelete(confirmDelete.board)}
              className="rounded-sm bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-40"
            >
              Sembunyikan
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className="rounded-sm border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink dark:border-white/15"
            >
              Batal
            </button>
          </div>
        </div>
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
              <SelectField
                label="Salin isi dari"
                name="salin_dari"
                defaultValue=""
                placeholder="Kosong"
                options={boards.map((board) => ({
                  value: board.id,
                  label: `${board.nama} (${counts[board.id] ?? 0} pengurus)`,
                }))}
                hint="Menyalin membuat baris baru, jadi mengubah salinan tidak menyentuh aslinya."
              />
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
                onClick={() => {
                  setError(null);
                  setConfirmDelete({ board, value: "" });
                }}
                disabled={busy || board.aktif}
                aria-label="Sembunyikan"
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
