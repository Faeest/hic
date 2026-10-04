import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { adminPosts } from "@/lib/content/admin-posts";
import { PostListActions } from "@/components/admin/PostListActions";

export const metadata: Metadata = {
  title: "Blog — Admin HIC",
  robots: { index: false, follow: false },
};

function fmt(date: string | null) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default async function AdminPostsPage() {
  const posts = await adminPosts();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Blog
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Tulis dan kelola artikel dalam format Markdown.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare"
        >
          <Plus size={16} weight="bold" />
          Artikel baru
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-faint dark:border-white/15">
            Belum ada artikel. Klik &ldquo;Artikel baru&rdquo; untuk mulai menulis.
          </p>
        )}

        {posts.map((p) => (
          <div key={p.id} className="glass-panel flex items-center gap-4 rounded-3xl p-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <p className="truncate font-display text-lg font-semibold text-ink">
                  {p.title}
                </p>
                <span
                  className={
                    p.published
                      ? "shrink-0 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                      : "shrink-0 rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium text-ink-soft dark:bg-white/10"
                  }
                >
                  {p.published ? "Terbit" : "Draf"}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-ink-soft">
                /blog/{p.slug} · {fmt(p.publishedAt)}
              </p>
            </div>
            <PostListActions id={p.id} slug={p.slug} published={p.published} />
          </div>
        ))}
      </div>
    </div>
  );
}
