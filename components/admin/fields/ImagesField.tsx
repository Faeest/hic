"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  UploadSimple,
  Trash,
  Spinner,
  ArrowLeft,
  ArrowRight,
  Images,
} from "@phosphor-icons/react";
import { FieldWrap } from "./FieldWrap";
import { MediaPicker } from "./MediaPicker";
import { uploadImage } from "@/lib/actions/upload";
import { compressImage } from "@/lib/media/compress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Ordered list of images for one row. The first image is the cover.
 * Submits a hidden `name` input as a JSON array, like RepeaterField.
 */
export function ImagesField({
  label,
  name,
  defaultValue,
  folder = "site",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string[] | null;
  folder?: string;
  hint?: string;
}) {
  const [images, setImages] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue.filter(Boolean) : []
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const add = (urls: string[]) => {
    setImages((current) => {
      const next = [...current];
      for (const url of urls) if (!next.includes(url)) next.push(url);
      return next;
    });
  };

  const remove = (url: string) =>
    setImages((current) => current.filter((u) => u !== url));

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= images.length) return;
    setImages((current) => {
      const next = [...current];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const onUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setUploading(true);
    const toastId = toast.loading(`Mengunggah ${list.length} berkas…`);
    startTransition(async () => {
      const urls: string[] = [];
      let failed = 0;
      for (const file of list) {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.set("file", compressed);
        fd.set("folder", folder);
        const res = await uploadImage(fd);
        if (res.error || !res.url) failed++;
        else urls.push(res.url);
      }
      if (urls.length > 0) add(urls);
      if (failed === 0) {
        toast.success(`${urls.length} berkas diunggah.`, { id: toastId });
      } else {
        toast.error(`${failed} dari ${list.length} berkas gagal.`, {
          id: toastId,
        });
      }
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  return (
    <FieldWrap label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {images.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {images.map((url, i) => (
            <li
              key={url}
              className="group relative overflow-hidden rounded-sm border border-ink/10 bg-cream dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="relative block aspect-square">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                  unoptimized={!url.startsWith("/")}
                />
              </span>

              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-sm bg-ember px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Sampul
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/70 px-1 py-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Geser kiri"
                    className="grid h-6 w-6 place-items-center rounded-xs text-white/80 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <ArrowLeft size={12} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label="Geser kanan"
                    className="grid h-6 w-6 place-items-center rounded-xs text-white/80 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <ArrowRight size={12} weight="bold" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(url)}
                  aria-label="Hapus foto"
                  className="grid h-6 w-6 place-items-center rounded-xs text-white/80 transition-colors hover:text-red-300"
                >
                  <Trash size={12} weight="bold" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 rounded-sm border border-dashed border-ink/15 px-4 py-6 text-sm text-ink-faint dark:border-white/15">
          <Images size={18} /> Belum ada foto.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
        >
          <Plus size={16} weight="bold" />
          Pilih dari media
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember disabled:opacity-60 dark:border-white/15"
        >
          {uploading ? (
            <Spinner size={16} className="animate-spin" />
          ) : (
            <UploadSimple size={16} weight="bold" />
          )}
          {uploading ? "Mengunggah…" : "Unggah"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />
        <span className={cn("text-xs text-ink-faint")}>
          {images.length} foto · foto pertama jadi sampul
        </span>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={add}
        multiple
        folder={folder}
        title="Pilih foto"
        selected={images}
      />
    </FieldWrap>
  );
}
