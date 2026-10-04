import { Hero } from "@/components/home/Hero";
import { MarqueeBand } from "@/components/home/MarqueeBand";
import { Tentang } from "@/components/home/Tentang";
import { DivisiIndex } from "@/components/home/DivisiIndex";
import { Pengurus } from "@/components/home/Pengurus";
import { Proker } from "@/components/home/Proker";
import { Galeri } from "@/components/home/Galeri";
import { Faq } from "@/components/home/Faq";
import { Gabung } from "@/components/home/Gabung";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSite, getSectionMap } from "@/lib/content/site";
import { getAllDivisi } from "@/lib/content/divisi";
import { getPengurus } from "@/lib/content/pengurus";
import { getProker } from "@/lib/content/proker";
import { getGaleri } from "@/lib/content/galeri";
import { getFaq } from "@/lib/content/faq";

export default async function Home() {
  const [site, sections, divisi, pengurus, proker, galeri, faq] = await Promise.all([
    getSite(),
    getSectionMap(),
    getAllDivisi(),
    getPengurus(),
    getProker(),
    getGaleri(),
    getFaq(),
  ]);

  return (
    <>
      <Navbar site={site} divisi={divisi} />
      <main>
        <Hero id="beranda" site={site} />
        <MarqueeBand items={site.marqueeItems} />
        <Tentang id="tentang" site={site} section={sections.tentang} />
        <DivisiIndex id="divisi" divisi={divisi} section={sections.divisi} />
        <Pengurus
          id="pengurus"
          pengurus={pengurus}
          section={sections.pengurus}
          site={site}
        />
        <Proker id="proker" proker={proker} section={sections.proker} />
        <Galeri id="galeri" galeri={galeri} section={sections.galeri} />
        <Faq id="faq" faq={faq} section={sections.faq} />
        <Gabung id="gabung" site={site} section={sections.gabung} />
      </main>
      <Footer site={site} divisi={divisi} />
    </>
  );
}
