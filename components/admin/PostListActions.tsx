"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilSimple, Trash, ArrowSquareOut } from "@phosphor-icons/react";
import { deletePost } from "@/lib/actions/posts";

export function PostListActions({
  id,
  slug,
  published,
}: {
  id: string;
  slug: string;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (!confirm("Hapus artikel ini?")) return;
    startTransition(async () => {
      const res = await deletePost(id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      {published && (
        <Link
          href={`/blog/${slug}`}
          target="_blank"
          aria-label="Lihat"
          className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
        >
          <ArrowSquareOut size={16} weight="bold" />
        </Link>
      )}
      <Link
        href={`/admin/posts/${id}`}
        aria-label="Ubah"
        className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-ember dark:border-white/15"
      >
        <PencilSimple size={16} weight="bold" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        aria-label="Hapus"
        className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-red-500 disabled:opacity-50 dark:border-white/15"
      >
        <Trash size={16} weight="bold" />
      </button>
    </div>
  );
}
