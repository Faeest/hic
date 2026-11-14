"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  X,
  MagnifyingGlass,
  UploadSimple,
  Spinner,
  Check,
  ImageSquare,
} from "@phosphor-icons/react";
import { listMediaAction, uploadImage } from "@/lib/actions/upload";
import { compressImage } from "@/lib/media/compress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/lib/types";

const fmtSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

/**
 * Browse the `media` bucket and pick one or more images.
 *
 * Uploading happens inside the dialog and lands in `folder`; the freshly
 * uploaded files are selected immediately, so "upload" and "choose" are the same
 * gesture from the editor's point of view.
 */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
  folder = "site",
  title = "Pilih gambar",
  selected = [],
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  folder?: string;
  title?: string;
  selected?: string[];
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("");
  const [picked, setPicked] = useState<string[]>(selected);
  const [loading, startLoading] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset the working selection only when the dialog transitions to open, so a
  // parent re-render cannot clobber what the user is picking.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setPicked(selected);
      setQuery("");
      setActiveFolder("");
    }
    wasOpen.current = open;
  }, [open, selected]);

  // Load the bucket once per open; keep it cached for the session afterwards.
  useEffect(() => {
    if (!open || loaded) return;
    startLoading(async () => {
      const list = await listMediaAction();
      setItems(list);
      setLoaded(true);
    });
  }, [open, loaded]);

  // Escape closes; lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const folders = useMemo(() => {
    const set = new Set(items.map((i) => i.folder));
    return Array.from(set).sort();
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeFolder && item.folder !== activeFolder) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q)
      );
    });
  }, [items, query, activeFolder]);

  const toggle = (url: string) => {
    if (!multiple) {
      onSelect([url]);
      onClose();
      return;
    }
    setPicked((current) =>
      current.includes(url)
        ? current.filter((u) => u !== url)
        : [...current, url]
    );
  };

  const onUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setUploading(true);
    const toastId = toast.loading(`Mengunggah ${list.length} berkas…`);
    void (async () => {
      const uploaded: MediaItem[] = [];
      let failed = 0;
      for (const file of list) {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.set("file", compressed);
        fd.set("folder", folder);
        const res = await uploadImage(fd);
        if (res.error || !res.url) {
          failed++;
          continue;
        }
        uploaded.push({
          path: res.url.split("/media/")[1] ?? res.url,
          url: res.url,
          name: file.name,
          folder,
          size: compressed.size,
          updatedAt: new Date().toISOString(),
        });
      }

      if (uploaded.length > 0) {
        setItems((current) => [...uploaded, ...current]);
        const urls = uploaded.map((u) => u.url);
        if (multiple) {
          setPicked((current) => [...current, ...urls]);
        } else {
          onSelect([urls[0]]);
          onClose();
        }
      }

      if (failed === 0) {
        toast.success(`${uploaded.length} berkas diunggah.`, { id: toastId });
      } else {
        toast.error(`${failed} dari ${list.length} berkas gagal.`, {
          id: toastId,
        });
      }
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    })();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm border border-ink/15 bg-paper shadow-[0_24px_60px_-24px_rgba(28,21,18,0.5)] dark:border-white/15">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4 dark:border-white/10">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-9 w-9 place-items-center rounded-sm border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 px-5 py-3 dark:border-white/10">
          <label className="relative min-w-48 flex-1">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama berkas…"
              className="w-full rounded-sm border border-ink/15 bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
            />
          </label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-sm bg-ember px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
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
        </div>

        {folders.length > 1 && (
          <div className="flex flex-wrap gap-1.5 border-b border-ink/10 px-5 py-2.5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveFolder("")}
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs transition-colors",
                activeFolder === ""
                  ? "bg-ember text-white"
                  : "text-ink-soft hover:text-ember"
              )}
            >
              Semua
            </button>
            {folders.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFolder(f)}
                className={cn(
                  "rounded-sm px-2.5 py-1 text-xs transition-colors",
                  activeFolder === f
                    ? "bg-ember text-white"
                    : "text-ink-soft hover:text-ember"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div className="min-h-48 flex-1 overflow-y-auto p-4">
          {loading && !loaded ? (
            <div className="grid place-items-center py-16 text-ink-faint">
              <Spinner size={24} className="animate-spin" />
            </div>
          ) : visible.length === 0 ? (
            <div className="grid place-items-center gap-2 py-16 text-center text-sm text-ink-faint">
              <ImageSquare size={28} />
              {items.length === 0
                ? "Belum ada gambar di media."
                : "Tidak ada yang cocok."}
            </div>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {visible.map((item) => {
                const isPicked = picked.includes(item.url);
                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => toggle(item.url)}
                      aria-pressed={multiple ? isPicked : undefined}
                      className={cn(
                        "group relative block w-full overflow-hidden rounded-sm border bg-cream text-left transition-colors dark:bg-white/[0.03]",
                        isPicked
                          ? "border-ember ring-2 ring-ember/30"
                          : "border-ink/10 hover:border-ember/50 dark:border-white/10"
                      )}
                    >
                      <span className="relative block aspect-square">
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          sizes="180px"
                          className="object-cover"
                        />
                      </span>
                      {isPicked && (
                        <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ember text-white">
                          <Check size={12} weight="bold" />
                        </span>
                      )}
                      <span className="block truncate px-2 py-1.5 text-[11px] text-ink-soft">
                        {item.name}
                      </span>
                      <span className="block px-2 pb-1.5 text-[10px] text-ink-faint">
                        {item.folder} · {fmtSize(item.size)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-5 py-3 dark:border-white/10">
          <p className="text-xs text-ink-faint">
            {multiple
              ? `${picked.length} dipilih`
              : "Klik gambar untuk memilih."}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink dark:border-white/15"
            >
              Batal
            </button>
            {multiple && (
              <button
                type="button"
                onClick={() => {
                  onSelect(picked);
                  onClose();
                }}
                className="rounded-sm bg-ember px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flare"
              >
                Pilih {picked.length > 0 ? picked.length : ""}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
