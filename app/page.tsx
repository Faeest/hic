import { BlockRenderer } from "@/components/home/BlockRenderer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { home } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {home.blocks.map((block, i) => (
          <BlockRenderer key={`${block.type}-${i}`} block={block} />
        ))}
      </main>
      <Footer />
    </>
  );
}
