"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadSimple,
  Copy,
  Check,
  Spinner,
  Trash,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { uploadImage, deleteMedia, replaceMedia } from "@/lib/actions/upload";
import { compressKeepingType } from "@/lib/media/compress";
import type { MediaItem } from "@/lib/admin/media";
import { cn } from "@/lib/utils";

const fmtSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const fmtDate = (iso: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

/**
 * Domain-branded URL emitted by the copy button: `/media/<bucket-path>`, served
 * by `app/media/[...path]/route.ts`. Keeps the Supabase project ref out of
 * shared links. The original absolute Supabase URL stays in the DB; both work.
 * (Thumbnails above keep using `item.url` so browsing the library talks to
 * Supabase directly instead of streaming every image through the server.)
 *
 * `origin` is passed in rather than read from `window` at render time so the
 * server render and the first client render agree (no hydration mismatch); the
 * click handler supplies `window.location.origin`.
 */
const mediaUrl = (origin: string, item: MediaItem) => {
  const path = item.path.split("/").map(encodeURIComponent).join("/");
  return `${origin}/media/${path}`;
};

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [replacing, setReplacing] = useState<string | null>(null);
  /** Cache-bust key per path, bumped after an in-place replace. */
  const [bust, setBust] = useState<Record<string, number>>({});
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<MediaItem | null>(null);

  const pickReplacement = (item: MediaItem) => {
    replaceTarget.current = item;
    setError(null);
    replaceRef.current?.click();
  };

  const onReplace = (file: File | undefined) => {
    const target = replaceTarget.current;
    if (!file || !target) return;
    setError(null);
    setReplacing(target.path);
    startTransition(async () => {
      const prepared = await compressKeepingType(file, target.path);
      const fd = new FormData();
      fd.set("file", prepared);
      fd.set("path", target.path);
      const res = await replaceMedia(fd);
      if (res.error) setError(res.error);
      else setBust((b) => ({ ...b, [target.path]: Date.now() }));
      setReplacing(null);
      replaceTarget.current = null;
      if (replaceRef.current) replaceRef.current.value = "";
      router.refresh();
    });
  };

  const onPick = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const list = Array.from(files);
    startTransition(async () => {
      for (const file of list) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", "media");
        const res = await uploadImage(fd);
        if (res.error) setError(res.error);
      }
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  };

  const copy = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("Tidak bisa menyalin ke clipboard.");
    }
  };

  const remove = async (item: MediaItem) => {
    const ok = confirm(
      `Hapus permanen "${item.name}"?\n\nKalau gambar ini masih dipakai di konten, gambarnya akan rusak.`
    );
    if (!ok) return;
    setError(null);
    setDeleting(item.path);
    const res = await deleteMedia(item.path);
    setDeleting(null);
    if (res.error) setError(res.error);
    else router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onPick(e.dataTransfer.files);
        }}
        className="flex flex-col items-center gap-3 rounded-sm border-2 border-dashed border-ink/15 px-6 py-10 text-center dark:border-white/15"
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-sm bg-ember px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
        >
          {pending ? (
            <Spinner size={18} className="animate-spin" />
          ) : (
            <UploadSimple size={18} weight="bold" />
          )}
          {pending ? "Mengunggah…" : "Pilih gambar"}
        </button>
        <p className="text-sm text-ink-faint">
          atau tarik & lepas berkas ke sini · otomatis dikompres ke WebP
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
        {/* Shared picker for in-place replacement; the target lives in a ref. */}
        <input
          ref={replaceRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onReplace(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-baseline justify-between gap-4 border-t border-ink/12 pt-4">
        <p className="text-sm text-ink-faint">{items.length} berkas di bucket media</p>
        <p className="text-xs text-ink-faint">Terbaru di atas</p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink/15 px-4 py-10 text-center text-sm text-ink-faint dark:border-white/15">
          Belum ada berkas. Unggah gambar pertama di atas.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.path} className="surface flex flex-col gap-3 bg-paper p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-cream dark:bg-white/5">
                <Image
                  src={bust[it.path] ? `${it.url}?v=${bust[it.path]}` : it.url}
                  alt={it.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {it.folder} · {fmtSize(it.size)}
                  {it.updatedAt ? ` · ${fmtDate(it.updatedAt)}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copy(mediaUrl(window.location.origin, it), it.path)}
                  title={it.path}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-ink/15 px-3 py-2 text-xs font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
                >
                  {copied === it.path ? (
                    <Check size={14} weight="bold" />
                  ) : (
                    <Copy size={14} weight="bold" />
                  )}
                  {copied === it.path ? "Tersalin" : "Salin URL"}
                </button>
                <button
                  type="button"
                  onClick={() => pickReplacement(it)}
                  disabled={replacing === it.path}
                  aria-label={`Ganti berkas ${it.name}`}
                  title="Ganti isi berkas, URL tetap sama"
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:border-ember/40 hover:text-ember dark:border-white/15",
                    replacing === it.path && "opacity-50"
                  )}
                >
                  {replacing === it.path ? (
                    <Spinner size={14} className="animate-spin" />
                  ) : (
                    <ArrowsClockwise size={14} weight="bold" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => remove(it)}
                  disabled={deleting === it.path}
                  aria-label={`Hapus ${it.name}`}
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:border-red-500/40 hover:text-red-500 dark:border-white/15",
                    deleting === it.path && "opacity-50"
                  )}
                >
                  {deleting === it.path ? (
                    <Spinner size={14} className="animate-spin" />
                  ) : (
                    <Trash size={14} weight="bold" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
