"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Images } from "@phosphor-icons/react";
import { SectionHead } from "@/components/ui/SectionHead";
import { GaleriLightbox } from "./GaleriLightbox";
import type { Foto, Section } from "@/lib/types";
import { cn } from "@/lib/utils";

const spanClass = (f: Foto) =>
  f.span === "wide"
    ? "col-span-2"
    : f.span === "tall"
      ? "row-span-2"
      : "";

const photoCount = (f: Foto) =>
  f.images && f.images.length > 0 ? f.images.length : 1;

function GaleriFigure({
  f,
  i,
  onOpen,
}: {
  f: Foto;
  i: number;
  onOpen: () => void;
}) {
  const figRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: figRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const count = photoCount(f);
  return (
    <motion.figure
      ref={figRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-xs bg-cream dark:bg-white/5",
        spanClass(f)
      )}
    >
      <motion.div aria-hidden style={{ y: imgY }} className="absolute inset-x-0 -top-[12%] h-[124%]">
        <Image
          src={f.src}
          alt={f.judul}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.55)_100%)]" aria-hidden />

      {count > 1 && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <Images size={13} weight="bold" />
          {count} foto
        </span>
      )}

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6">
        <p className="font-display text-xl font-semibold text-white">{f.judul}</p>
        <p className="mt-1 text-sm leading-snug text-white/80">{f.keterangan}</p>
      </figcaption>

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Buka ${f.judul}${count > 1 ? ` (${count} foto)` : ""}`}
        className="absolute inset-0 z-20 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
      />
    </motion.figure>
  );
}

export function Galeri({
  id,
  galeri,
  section,
}: {
  id: string;
  galeri: Foto[];
  section: Section;
}) {
  const [viewer, setViewer] = useState<{ item: Foto; index: number } | null>(
    null
  );

  if (!section.visible) return null;

  const totalPhotos = galeri.reduce((sum, f) => sum + photoCount(f), 0);

  return (
    <section id={id} className="relative scroll-mt-24 bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index={section.index}
          label={section.label}
          title={section.title}
          accent={section.accent}
        />
      </div>

      {/* Full-bleed plate — the grid runs to the viewport edge, not a card */}
      <div className="mt-10 grid w-full auto-rows-[11rem] grid-cols-2 gap-1 sm:auto-rows-[14rem] md:grid-cols-3 lg:auto-rows-[16rem] lg:grid-cols-4">
        {galeri.map((f, i) => (
          <GaleriFigure
            key={f.src}
            f={f}
            i={i}
            onOpen={() => setViewer({ item: f, index: 0 })}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <p className="text-sm text-ink-faint">
          {galeri.length} momen · {totalPhotos} foto
        </p>
      </div>

      {viewer && (
        <GaleriLightbox
          item={viewer.item}
          index={viewer.index}
          onIndex={(index) => setViewer({ item: viewer.item, index })}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
}