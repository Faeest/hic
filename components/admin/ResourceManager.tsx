"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { TextField } from "./fields/TextField";
import { TextArea } from "./fields/TextArea";
import { SelectField } from "./fields/SelectField";
import { ToggleField } from "./fields/ToggleField";
import { ImageField } from "./fields/ImageField";
import { ColorField } from "./fields/ColorField";
import { RepeaterField } from "./fields/RepeaterField";
import { SubmitButton } from "./fields/SubmitButton";
import { FieldWrap } from "./fields/FieldWrap";
import {
  createRow,
  updateRow,
  deleteRow,
  reorderRows,
  type CrudResult,
} from "@/lib/actions/crud";
import type { FieldSpec, ResourceConfig } from "@/lib/admin/resource";

type Row = Record<string, unknown>;

export function ResourceManager({
  config,
  rows,
  fixedValues,
}: {
  config: ResourceConfig;
  rows: Row[];
  /** Values injected into every create/update form (e.g. parent divisi_id). */
  fixedValues?: Record<string, string>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setEditing(null);
    setCreating(false);
    setError(null);
  };

  const onDelete = async (row: Row) => {
    if (!confirm(`Hapus "${String(row[config.titleKey])}"?`)) return;
    setBusy(true);
    const res = await deleteRow(config.table, String(row.id));
    setBusy(false);
    if (!res.ok) setError(res.error);
    else router.refresh();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    const ids = rows.map((r) => String(r.id));
    [ids[index], ids[j]] = [ids[j], ids[index]];
    setBusy(true);
    const res = await reorderRows(config.table, ids);
    setBusy(false);
    if (!res.ok) setError(res.error);
    else router.refresh();
  };

  const showForm = creating || editing !== null;

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-faint">{rows.length} item</p>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setCreating(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          <Plus size={16} weight="bold" />
          {config.createLabel}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              {creating ? config.createLabel : `Ubah ${config.noun}`}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <ResourceForm
            key={creating ? "create" : String(editing?.id)}
            config={config}
            row={creating ? null : editing}
            fixedValues={fixedValues}
            onDone={() => {
              close();
              router.refresh();
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink-faint dark:border-white/15">
            Belum ada data. Klik {config.createLabel} untuk menambah.
          </p>
        )}

        {rows.map((row, i) => (
          <div
            key={String(row.id)}
            className="glass-panel flex items-center gap-4 rounded-3xl p-4 sm:p-5"
          >
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0 || busy}
                aria-label="Naikkan"
                className="grid h-7 w-7 place-items-center rounded-lg text-ink-faint transition-colors hover:text-ember disabled:opacity-30"
              >
                <ArrowUp size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1 || busy}
                aria-label="Turunkan"
                className="grid h-7 w-7 place-items-center rounded-lg text-ink-faint transition-colors hover:text-ember disabled:opacity-30"
              >
                <ArrowDown size={14} weight="bold" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-semibold text-ink">
                {String(row[config.titleKey] ?? "—")}
              </p>
              {config.subtitleKey && (
                <p className="truncate text-sm text-ink-soft">
                  {String(row[config.subtitleKey] ?? "")}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditing(row);
                }}
                aria-label="Ubah"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
              >
                <Pencil size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(row)}
                aria-label="Hapus"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-red-500 dark:border-white/15"
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

function ResourceForm({
  config,
  row,
  fixedValues,
  onDone,
}: {
  config: ResourceConfig;
  row: Row | null;
  fixedValues?: Record<string, string>;
  onDone: () => void;
}) {
  const [state, action] = useActionState<CrudResult | undefined, FormData>(
    async (_prev, formData) => {
      if (fixedValues) {
        for (const [k, v] of Object.entries(fixedValues)) formData.set(k, v);
      }
      const res = row
        ? await updateRow(config.table, String(row.id), formData)
        : await createRow(config.table, formData);
      if (res.ok) onDone();
      return res;
    },
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      {state && !state.ok && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      {config.fields.map((f) => (
        <FieldRenderer key={f.name} field={f} row={row} />
      ))}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{row ? "Simpan" : "Tambah"}</SubmitButton>
        {state?.ok && (
          <span className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <CheckCircle size={18} weight="fill" /> Tersimpan
          </span>
        )}
      </div>
    </form>
  );
}

function FieldRenderer({ field, row }: { field: FieldSpec; row: Row | null }) {
  const raw = row ? row[field.name] : undefined;
  const strVal = raw == null ? "" : String(raw);

  switch (field.kind) {
    case "hidden":
      return (
        <input
          type="hidden"
          name={field.name}
          value={strVal}
          key={`${field.name}-${strVal}`}
        />
      );
    case "text":
      return (
        <TextField
          label={field.label}
          name={field.name}
          defaultValue={strVal}
          placeholder={field.placeholder}
          hint={field.hint}
          required={field.required}
        />
      );
    case "textarea":
      return (
        <TextArea
          label={field.label}
          name={field.name}
          defaultValue={strVal}
          rows={field.rows}
          hint={field.hint}
        />
      );
    case "number":
      return (
        <FieldWrap label={field.label} name={field.name} hint={field.hint}>
          <input
            id={field.name}
            name={field.name}
            type="number"
            defaultValue={raw == null ? 0 : Number(raw)}
            className={cn(
              "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
            )}
          />
        </FieldWrap>
      );
    case "bool":
      return (
        <ToggleField
          label={field.label}
          name={field.name}
          defaultChecked={Boolean(raw)}
          hint={field.hint}
        />
      );
    case "select":
      return (
        <SelectField
          label={field.label}
          name={field.name}
          options={field.options}
          defaultValue={strVal}
          placeholder={field.placeholder}
          hint={field.hint}
        />
      );
    case "image":
      return (
        <ImageField
          label={field.label}
          name={field.name}
          defaultValue={strVal}
          folder={field.folder}
          hint={field.hint}
        />
      );
    case "color":
      return (
        <ColorField
          label={field.label}
          name={field.name}
          defaultValue={strVal || "#d45311"}
          hint={field.hint}
        />
      );
    case "repeater":
      return (
        <RepeaterField
          label={field.label}
          name={field.name}
          defaultValue={raw ?? []}
          fields={field.fields}
          itemLabel={field.itemLabel}
          hint={field.hint}
        />
      );
    default:
      return null;
  }
}
