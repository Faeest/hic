import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getPosts } from "@/lib/content/posts";
import { getSite } from "@/lib/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllDivisi } from "@/lib/content/divisi";

export const metadata: Metadata = {
  title: "Blog — HIC",
  description: "Catatan, tutorial, dan cerita dari Hardware Interactive Club.",
};

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

export default async function BlogPage() {
  const [posts, site, divisi] = await Promise.all([
    getPosts(),
    getSite(),
    getAllDivisi(),
  ]);

  return (
    <>
      <Navbar site={site} divisi={divisi} />
      <main className="bg-paper">
        <section className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="flex items-baseline gap-3 text-sm">
              <span className="font-mono text-ember">Blog</span>
              <span className="h-px w-6 self-center bg-ember/40" aria-hidden />
              <span className="font-medium text-ink-soft">Catatan HIC</span>
            </p>
            <h1 className="mt-5 max-w-[18ch] font-display text-5xl font-semibold leading-[1.0] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Tulisan dari sekret.
            </h1>

            {posts.length === 0 ? (
              <p className="mt-16 rounded-3xl border border-dashed border-ink/15 px-6 py-16 text-center text-ink-faint dark:border-white/15">
                Belum ada artikel yang diterbitkan.
              </p>
            ) : (
              <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="glass-panel group flex flex-col overflow-hidden rounded-[2rem] transition-transform duration-300 hover:-translate-y-1"
                  >
                    {p.coverUrl && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-cream dark:bg-white/5">
                        <Image
                          src={p.coverUrl}
                          alt={p.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                              className="rounded-full bg-peach px-3 py-1 text-xs font-medium text-ember"
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
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer site={site} divisi={divisi} />
    </>
  );
}
