import type { MetadataRoute } from "next";
import { getAllDivisi } from "@/lib/content/divisi";
import { getPostIndex } from "@/lib/content/posts";

const base = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hic.ubhinus.ac.id"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [divisi, posts] = await Promise.all([getAllDivisi(), getPostIndex()]);
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...divisi.map((d) => ({
      url: `${base}/divisi/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
