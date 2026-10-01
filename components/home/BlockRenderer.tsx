import type { Block } from "@/lib/types";
import { Hero } from "./Hero";
import { MarqueeBand } from "./MarqueeBand";
import { Tentang } from "./Tentang";
import { DivisiIndex } from "./DivisiIndex";
import { Pengurus } from "./Pengurus";
import { Proker } from "./Proker";
import { Galeri } from "./Galeri";
import { Faq } from "./Faq";
import { Gabung } from "./Gabung";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} />;
    case "marquee":
      return <MarqueeBand block={block} />;
    case "tentang":
      return <Tentang block={block} />;
    case "divisiIndex":
      return <DivisiIndex block={block} />;
    case "pengurus":
      return <Pengurus block={block} />;
    case "proker":
      return <Proker block={block} />;
    case "galeri":
      return <Galeri block={block} />;
    case "faq":
      return <Faq block={block} />;
    case "gabung":
      return <Gabung block={block} />;
    default:
      return null;
  }
}
