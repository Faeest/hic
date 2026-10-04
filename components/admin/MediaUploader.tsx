"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { UploadSimple, Copy, Check, Spinner } from "@phosphor-icons/react";
import { uploadImage } from "@/lib/actions/upload";

type Uploaded = { url: string; name: string };

export function MediaUploader() {
  const [items, setItems] = useState<Uploaded[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

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
        else if (res.url) setItems((prev) => [{ url: res.url!, name: file.name }, ...prev]);
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("Tidak bisa menyalin ke clipboard.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onPick(e.dataTransfer.files);
        }}
        className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-ink/15 px-6 py-12 text-center dark:border-white/15"
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
        >
          {pending ? <Spinner size={18} className="animate-spin" /> : <UploadSimple size={18} weight="bold" />}
          {pending ? "Mengunggah…" : "Pilih gambar"}
        </button>
        <p className="text-sm text-ink-faint">
          atau tarik & lepas berkas ke sini · maks 10 MB
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.url} className="glass-panel flex flex-col gap-3 rounded-3xl p-4">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-cream dark:bg-white/5">
                <Image src={it.url} alt={it.name} fill sizes="300px" className="object-contain" unoptimized />
              </div>
              <p className="truncate text-sm text-ink-soft">{it.name}</p>
              <button
                type="button"
                onClick={() => copy(it.url)}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
              >
                {copied === it.url ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                {copied === it.url ? "Tersalin" : "Salin URL"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
