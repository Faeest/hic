import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getPostPage, POSTS_PER_PAGE } from "@/lib/content/posts";
import { getSite } from "@/lib/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllDivisi } from "@/lib/content/divisi";
import { cropStyle } from "@/lib/media/focus";
import { Pagination } from "@/components/blog/Pagination";
import { parsePageParam } from "@/lib/pagination";
import type { PostSummary } from "@/lib/types";

type BlogSearchParams = { page?: string | string[] };

const DESCRIPTION =
  "Catatan, tutorial, dan cerita dari Hardware Interactive Club.";

/**
 * The page number is runtime data, so the title and canonical follow it. The
 * page itself already defers the grid to request time, which is what lets
 * metadata stream instead of forcing the whole route dynamic.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const result = await getPostPage(parsePageParam(page));

  return {
    title: result.page > 1 ? `Blog — Halaman ${result.page} — HIC` : "Blog — HIC",
    description: DESCRIPTION,
    alternates: {
      canonical: result.page > 1 ? `/blog?page=${result.page}` : "/blog",
    },
  };
}

function fmt(date: string | null) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}) {
  const [site, divisi] = await Promise.all([getSite(), getAllDivisi()]);

  return (
    <>
      <Navbar site={site} divisi={divisi} />
      <main className="bg-paper">
        <section className="relative scroll-mt-24 bg-paper pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="flex items-baseline gap-3 text-sm">
              <span className="font-medium text-ember">Blog</span>
              <span className="h-px w-6 self-center bg-ember/40" aria-hidden />
              <span className="font-medium text-ink-soft">Catatan HIC</span>
            </p>
            <h1 className="mt-5 max-w-[18ch] font-display text-5xl font-semibold leading-[1.0] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              {site.copy.blogH1}
            </h1>

            <Suspense fallback={<PostGridSkeleton />}>
              <PostGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer site={site} divisi={divisi} />
    </>
  );
}

/**
 * The only part of the page that reads `searchParams`. Keeping it behind
 * Suspense leaves the header and footer in the static shell.
 */
async function PostGrid({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}) {
  const { page } = await searchParams;
  const result = await getPostPage(parsePageParam(page));

  if (result.total === 0) {
    return (
      <p className="mt-16 border border-dashed border-ink/15 px-6 py-16 text-center text-ink-faint dark:border-white/15">
        Belum ada artikel yang diterbitkan.
      </p>
    );
  }

  const first = (result.page - 1) * POSTS_PER_PAGE + 1;
  const last = first + result.items.length - 1;

  return (
    <>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Pagination page={result.page} pages={result.pages} />
        <p className="font-mono text-xs text-ink-faint">
          Menampilkan {first}–{last} dari {result.total} artikel
        </p>
      </div>
    </>
  );
}

function PostCard({ post: p }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="surface group flex flex-col overflow-hidden bg-paper transition-colors duration-300 hover:border-ember/40"
    >
      {p.coverUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-cream dark:bg-white/5">
          <Image
            src={p.coverUrl}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            style={cropStyle(p.coverCrop)}
            className="object-cover"
            unoptimized={!p.coverUrl.startsWith("/")}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {p.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {p.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="border border-ember/25 px-2.5 py-0.5 text-xs text-ember"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          {p.title}
        </h2>
        {p.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {p.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-mono text-xs text-ink-faint">
            {fmt(p.publishedAt)}
          </span>
          <ArrowUpRight
            size={18}
            weight="bold"
            className="text-ember transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

/** Same footprint as a full page of cards, so the shell does not jump. */
function PostGridSkeleton() {
  return (
    <div
      className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="surface overflow-hidden bg-paper">
          <div className="aspect-[16/10] bg-cream dark:bg-white/5" />
          <div className="flex flex-col gap-3 p-6">
            <div className="h-5 w-3/4 rounded-sm bg-cream dark:bg-white/5" />
            <div className="h-3 w-full rounded-sm bg-cream dark:bg-white/5" />
            <div className="h-3 w-2/3 rounded-sm bg-cream dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
