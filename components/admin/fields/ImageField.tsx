"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { UploadSimple, Trash, Spinner, Images } from "@phosphor-icons/react";
import { FieldWrap, inputClass } from "./FieldWrap";
import { MediaPicker } from "./MediaPicker";
import { uploadImage } from "@/lib/actions/upload";
import { compressImage } from "@/lib/media/compress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fmt = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

/**
 * Image field: upload to Supabase Storage OR paste a URL.
 * Keeps the resolved URL in a hidden input named `name`.
 */
export function ImageField({
  label,
  name,
  defaultValue,
  folder = "site",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  folder?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setSaved(null);
    startTransition(async () => {
      const toastId = toast.loading("Mengunggah…");
      const compressed = await compressImage(file);
      if (compressed !== file) {
        setSaved(`${fmt(file.size)} → ${fmt(compressed.size)}`);
      }

      const fd = new FormData();
      fd.set("file", compressed);
      fd.set("folder", folder);
      const res = await uploadImage(fd);
      if (res.error) {
        setError(res.error);
        toast.error(res.error, { id: toastId });
      } else if (res.url) {
        setUrl(res.url);
        toast.success("Gambar diunggah dan dipilih.", { id: toastId });
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-ink/10 bg-cream dark:border-white/10 dark:bg-white/[0.03]">
          {url ? (
            <Image
              src={url}
              alt=""
              fill
              sizes="96px"
              className="object-contain p-1"
              unoptimized={!url.startsWith("/")}
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-xs text-ink-faint">
              Kosong
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/gambar.png atau https://…"
            className={cn(inputClass, "text-sm")}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
            >
              <Images size={16} weight="bold" />
              Pilih dari media
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember disabled:opacity-60 dark:border-white/15"
            >
              {pending ? (
                <Spinner size={16} className="animate-spin" />
              ) : (
                <UploadSimple size={16} weight="bold" />
              )}
              {pending ? "Mengunggah…" : "Unggah"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-red-500 dark:border-white/15"
              >
                <Trash size={16} weight="bold" />
                Hapus
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0])}
          />
          {saved && (
            <p className="text-xs text-ink-faint">Dikompres: {saved}</p>
          )}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(urls) => {
          if (urls[0]) setUrl(urls[0]);
        }}
        folder={folder}
        title={`Pilih ${label.toLowerCase()}`}
        selected={url ? [url] : []}
      />
    </FieldWrap>
  );
}
