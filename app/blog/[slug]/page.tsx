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
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { toSiteMediaUrl } from "@/lib/media/url";
import { cropStyle } from "@/lib/media/focus";

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
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      url: `/blog/${post.slug}`,
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || undefined,
          image: post.coverUrl
            ? absoluteUrl(toSiteMediaUrl(post.coverUrl))
            : undefined,
          datePublished: post.publishedAt || undefined,
          dateModified: post.updatedAt || post.publishedAt || undefined,
          inLanguage: "id-ID",
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          author: { "@type": "Organization", name: site.namaLengkap },
          publisher: {
            "@type": "Organization",
            name: site.namaLengkap,
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl(site.logoLightUrl),
            },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Beranda", item: siteUrl() },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: absoluteUrl("/blog"),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: absoluteUrl(`/blog/${post.slug}`),
            },
          ],
        }}
      />
      <Navbar site={site} divisi={divisi} />
      <main className="bg-paper">
        <article className="mx-auto max-w-4xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
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
                className="border border-ember/25 px-2.5 py-0.5 text-xs text-ember"
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
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xs bg-cream dark:bg-white/5">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                style={cropStyle(post.coverCrop)}
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
