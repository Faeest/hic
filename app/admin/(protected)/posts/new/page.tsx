import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Artikel Baru — Admin HIC",
  robots: { index: false, follow: false },
};

export default function AdminNewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember"
        >
          <ArrowLeft size={16} weight="bold" />
          Semua artikel
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          Artikel baru
        </h1>
      </div>
      <PostEditor post={null} />
    </div>
  );
}
