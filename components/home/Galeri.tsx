"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { galeri } from "@/data/galeri";
import { cn } from "@/lib/utils";

const spanClasses = [
  "col-span-2 row-span-2 lg:col-span-2",
  "",
  "",
  "",
  "",
];

export function Galeri({ id }: { id: string }) {
  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index="V"
          label="Galeri Kegiatan"
          title={
            <>
              Momen-momen di{" "}
              <span className="text-ember">sekret & ruang kelas</span>.
            </>
          }
          sub="Jepretan dari diklat, orientasi, seminar, dan hari-hari biasa di HIC."
        />

        <div className="mt-16 grid auto-rows-[10rem] grid-cols-2 gap-4 sm:auto-rows-[13rem] sm:gap-5 lg:auto-rows-[15rem] lg:grid-cols-4">
          {galeri.map((f, i) => (
            <motion.figure
              key={f.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              className={cn(
                "group relative h-full w-full overflow-hidden rounded-3xl",
                spanClasses[i] ?? ""
              )}
            >
              <Image
                src={f.src}
                alt={f.judul}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.55)_100%)]" aria-hidden />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 p-6">
                <p className="font-display text-xl font-semibold text-white">{f.judul}</p>
                <p className="mt-1 text-sm leading-snug text-white/80">{f.keterangan}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-ink-faint">
            5 momen · sepanjang periode kepengurusan
          </p>
        </Reveal>
      </div>
    </section>
  );
}