"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  LockSimple,
  Pencil,
  Plus,
  Trash,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { withToast } from "@/lib/admin/toast";
import { isReservedGrup } from "@/lib/pengurus-grup";
import {
  createGrup,
  deleteGrup,
  reorderGrup,
  updateGrup,
} from "@/lib/actions/pengurus-grup";
import { SortableRow } from "./SortableRow";
import { TextField } from "./fields/TextField";
import { TextArea } from "./fields/TextArea";

type GrupRow = {
  id: string;
  slug: string;
  label: string;
  deskripsi: string;
  sort: number;
};

/**
 * Group manager for one kepengurusan board.
 *
 * Reserved groups (`pembina`, `inti`) are listed but locked: their label and
 * description stay editable, their slug and existence do not. Everyone else
 * can be created, renamed, reordered and deleted — deletion is refused while
 * the group still holds members, in the Server Action and by the FK.
 *
 * Reordering follows the same contract as every other admin list: drag or use
 * the arrows, then press "Simpan urutan". Nothing is written until then.
 */
export function PengurusGrupManager({
  boardId,
  groups,
  counts,
}: {
  boardId: string;
  groups: GrupRow[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<GrupRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserved = groups.filter((g) => isReservedGrup(g.slug));
  const configurable = groups.filter((g) => !isReservedGrup(g.slug));

  /** Local order until "Simpan urutan"; resyncs when the server list changes. */
  const orderKey = configurable.map((g) => g.id).join("|");
  const [order, setOrder] = useState<string[]>(() =>
    configurable.map((g) => g.id)
  );
  const [syncedKey, setSyncedKey] = useState(orderKey);

  if (orderKey !== syncedKey) {
    setSyncedKey(orderKey);
    setOrder(orderKey ? orderKey.split("|") : []);
  }

  const dirty = order.join("|") !== orderKey;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const byId = new Map(configurable.map((g) => [g.id, g]));
  const orderedGroups = order
    .map((id) => byId.get(id))
    .filter((g): g is GrupRow => Boolean(g));

  const discardOrderIfNeeded = () => {
    if (!dirty) return true;
    if (!confirm("Urutan belum disimpan. Buang perubahan urutan?")) return false;
    setOrder(orderKey ? orderKey.split("|") : []);
    return true;
  };

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const saveOrder = async () => {
    setBusy(true);
    const res = await withToast(reorderGrup(boardId, order), {
      loading: "Menyimpan urutan…",
      success: "Urutan disimpan.",
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSyncedKey(order.join("|"));
    router.refresh();
  };

  const onDelete = async (grup: GrupRow) => {
    if (!discardOrderIfNeeded()) return;
    if (!confirm(`Hapus kelompok "${grup.label}"?`)) return;
    setBusy(true);
    const res = await withToast(deleteGrup(grup.id), {
      loading: "Menghapus…",
      success: "Kelompok dihapus.",
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

      <div className="flex items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-ink-faint">
          Pembina dan BPH tetap dan selalu tampil. Kelompok lain bisa diatur
          ulang tiap periode.
        </p>
        <button
          type="button"
          onClick={() => {
            if (!discardOrderIfNeeded()) return;
            setEditing(null);
            setCreating(true);
          }}
          className="inline-flex items-center gap-2 rounded-sm bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          <Plus size={16} weight="bold" />
          Tambah kelompok
        </button>
      </div>

      {(creating || editing) && (
        <div className="glass-panel rounded-sm p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              {creating ? "Kelompok baru" : "Ubah kelompok"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              aria-label="Tutup"
              className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
          <GrupForm
            key={creating ? "create" : editing?.id}
            grup={creating ? null : editing}
            onSubmit={async (fd) => {
              const res = creating
                ? await withToast(createGrup(boardId, fd), {
                    loading: "Menambahkan…",
                    success: "Kelompok ditambahkan.",
                  })
                : await withToast(updateGrup(editing!.id, fd), {
                    loading: "Menyimpan…",
                    success: "Perubahan disimpan.",
                  });
              if (res.ok) {
                setCreating(false);
                setEditing(null);
                router.refresh();
              }
              return res;
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {reserved.map((g) => (
          <div
            key={g.id}
            className="glass-panel flex items-center gap-3 rounded-sm p-4 sm:gap-4 sm:p-5"
          >
            <span className="grid h-9 w-6 shrink-0 place-items-center text-ink-faint">
              <LockSimple size={16} weight="bold" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-semibold text-ink">
                {g.label}{" "}
                <span className="ml-1 align-middle text-[10px] font-medium uppercase tracking-wide text-ink-faint">
                  Tetap
                </span>
              </p>
              <p className="truncate text-sm text-ink-soft">{g.deskripsi}</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                {g.slug} · {counts[g.id] ?? 0} orang
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!discardOrderIfNeeded()) return;
                setCreating(false);
                setEditing(g);
              }}
              aria-label="Ubah nama kelompok"
              className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
            >
              <Pencil size={16} weight="bold" />
            </button>
          </div>
        ))}

        <Reorder.Group
          axis="y"
          values={order}
          onReorder={setOrder}
          className="flex flex-col gap-3"
        >
          {orderedGroups.map((g, i) => (
            <SortableRow key={g.id} id={g.id}>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || busy}
                  aria-label="Naikkan"
                  className="grid h-7 w-7 place-items-center rounded-sm text-ink-faint transition-colors hover:text-ember disabled:opacity-30"
                >
                  <ArrowUp size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === orderedGroups.length - 1 || busy}
                  aria-label="Turunkan"
                  className="grid h-7 w-7 place-items-center rounded-sm text-ink-faint transition-colors hover:text-ember disabled:opacity-30"
                >
                  <ArrowDown size={14} weight="bold" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-semibold text-ink">
                  {g.label}
                </p>
                <p className="truncate text-sm text-ink-soft">{g.deskripsi}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                  {g.slug} · {counts[g.id] ?? 0} orang
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!discardOrderIfNeeded()) return;
                    setCreating(false);
                    setEditing(g);
                  }}
                  aria-label="Ubah"
                  className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
                >
                  <Pencil size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(g)}
                  disabled={busy}
                  aria-label="Hapus"
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-red-500 disabled:opacity-30 dark:border-white/15"
                  )}
                >
                  <Trash size={16} weight="bold" />
                </button>
              </div>
            </SortableRow>
          ))}
        </Reorder.Group>

        {configurable.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink-faint dark:border-white/15">
            Belum ada kelompok lain. Klik Tambah kelompok untuk menambah biro,
            PJ divisi, atau kelompok baru.
          </p>
        )}
      </div>

      {dirty && (
        <div className="sticky bottom-4 z-10">
          <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-sm px-4 py-3">
            <p className="text-sm text-ink-soft">
              Urutan berubah — belum disimpan.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrder(orderKey ? orderKey.split("|") : [])}
                disabled={busy}
                className="rounded-sm border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink disabled:opacity-50 dark:border-white/15"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={saveOrder}
                disabled={busy}
                className="rounded-sm bg-ember px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
              >
                Simpan urutan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GrupForm({
  grup,
  onSubmit,
}: {
  grup: GrupRow | null;
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setError(null);
        const res = await onSubmit(fd);
        if (!res.ok) setError(res.error ?? "Gagal menyimpan.");
      }}
      className="flex flex-col gap-5"
    >
      {error && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <TextField
        label="Nama kelompok"
        name="label"
        defaultValue={grup?.label}
        placeholder="mis. Biro, PJ Divisi, Media"
        required
      />
      <TextArea
        label="Deskripsi singkat"
        name="deskripsi"
        defaultValue={grup?.deskripsi}
        rows={2}
        hint="Tampil di samping judul kelompok pada halaman pengurus."
      />
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="rounded-sm bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          {grup ? "Simpan" : "Tambah"}
        </button>
        {grup && (
          <span className="font-mono text-[11px] text-ink-faint">
            kode: {grup.slug} (tetap)
          </span>
        )}
      </div>
    </form>
  );
}
