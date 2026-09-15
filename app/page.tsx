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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <Tentang id="tentang" />
        <DivisiIndex id="divisi" />
        <Pengurus id="pengurus" />
        <Proker id="proker" />
        <Galeri id="galeri" />
        <Faq id="faq" />
        <Gabung id="gabung" />
      </main>
      <Footer />
    </>
  );
}