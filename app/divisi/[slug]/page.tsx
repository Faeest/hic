import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDivisi, getDivisi } from "@/lib/content/divisi";
import { getProkerByDivisi } from "@/lib/content/proker";
import { getSite } from "@/lib/content/site";
import { DivisiHero } from "@/components/divisi/DivisiHero";
import { Kurikulum } from "@/components/divisi/Kurikulum";
import { MentorSection } from "@/components/divisi/MentorSection";
import { DivisiProker } from "@/components/divisi/DivisiKarya";
import { DivisiNav } from "@/components/divisi/DivisiNav";
import { DivisiGabung } from "@/components/divisi/DivisiGabung";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export async function generateStaticParams() {
  const divisi = await getAllDivisi();
  return divisi.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [d, site] = await Promise.all([getDivisi(slug), getSite()]);
  if (!d) return { title: "Divisi tidak ditemukan" };
  return {
    title: `${d.nama} — ${site.namaPanjang}`,
    description: d.deskripsi,
  };
}

export default async function DivisiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [d, all, site] = await Promise.all([
    getDivisi(slug),
    getAllDivisi(),
    getSite(),
  ]);
  if (!d) notFound();

  const proker = await getProkerByDivisi(slug);

  return (
    <>
      <Navbar site={site} divisi={all} />
      <main>
        <DivisiHero d={d} />
        <Kurikulum d={d} />
        <MentorSection d={d} />
        <DivisiProker d={d} items={proker} />
        <DivisiNav current={d} all={all} />
        <DivisiGabung d={d} />
      </main>
      <Footer site={site} divisi={all} />
    </>
  );
}
