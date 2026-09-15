import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { divisi, getDivisi } from "@/data/divisi";
import { club } from "@/data/club";
import { DivisiHero } from "@/components/divisi/DivisiHero";
import { Kurikulum } from "@/components/divisi/Kurikulum";
import { MentorSection } from "@/components/divisi/MentorSection";
import { DivisiKarya } from "@/components/divisi/DivisiKarya";
import { DivisiNav } from "@/components/divisi/DivisiNav";
import { DivisiGabung } from "@/components/divisi/DivisiGabung";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return divisi.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDivisi(slug);
  if (!d) return { title: "Divisi tidak ditemukan" };
  return {
    title: `${d.nama} — ${club.namaPanjang}`,
    description: d.deskripsi,
  };
}

export default async function DivisiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDivisi(slug);
  if (!d) notFound();

  return (
    <>
      <Navbar />
      <main>
        <DivisiHero d={d} />
        <Kurikulum d={d} />
        <MentorSection d={d} />
        <DivisiKarya d={d} />
        <DivisiNav current={d} />
        <DivisiGabung d={d} />
      </main>
      <Footer />
    </>
  );
}