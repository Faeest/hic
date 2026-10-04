import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getPost, getPostSlugs } from "@/lib/content/posts";
import { getSite } from "@/lib/content/site";
import { getAllDivisi } from "@/lib/content/divisi";
import { Markdown } from "@/components/blog/Markdown";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artikel tidak ditemukan" };
  return {
    title: `${post.title} — HIC`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      images: post.coverUrl ? [post.coverUrl] : undefined,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, site, divisi] = await Promise.all([
    getPost(slug),
    getSite(),
    getAllDivisi(),
  ]);
  if (!post) notFound();

  return (
    <>
      <Navbar site={site} divisi={divisi} />
      <main className="bg-paper">
        <article className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember"
          >
            <ArrowLeft size={16} weight="bold" />
            Semua artikel
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-peach px-3 py-1 text-xs font-medium text-ember"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <p className="mt-5 font-mono text-sm text-ink-faint">
            {fmt(post.publishedAt)}
          </p>

          {post.excerpt && (
            <p className="mt-8 text-lg leading-relaxed text-ink-soft sm:text-xl">
              {post.excerpt}
            </p>
          )}

          {post.coverUrl && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem] bg-cream dark:bg-white/5">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
                priority
                unoptimized={!post.coverUrl.startsWith("/")}
              />
            </div>
          )}

          <div className="mt-12">
            <Markdown>{post.bodyMd}</Markdown>
          </div>
        </article>
      </main>
      <Footer site={site} divisi={divisi} />
    </>
  );
}
