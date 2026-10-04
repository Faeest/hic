import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { adminPost } from "@/lib/content/admin-posts";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Ubah Artikel — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await adminPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember"
          >
            <ArrowLeft size={16} weight="bold" />
            Semua artikel
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            Ubah artikel
          </h1>
        </div>
        {post.published && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-ember dark:border-white/15"
          >
            <ArrowSquareOut size={16} weight="bold" />
            Lihat
          </Link>
        )}
      </div>
      <PostEditor post={post} />
    </div>
  );
}
