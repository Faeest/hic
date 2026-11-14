import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { Foto, GaleriRow } from "@/lib/types";
import { galeri as seedGaleri } from "@/data/galeri";
import { bySort, warnFallback } from "./util";

export const seedGaleriList: Foto[] = seedGaleri;

function toApp(row: GaleriRow): Foto {
  const images = (row.images ?? []).filter(Boolean);
  const src = images[0] ?? row.image_url;
  const foto: Foto = {
    src,
    judul: row.judul,
    keterangan: row.keterangan,
    images: images.length > 0 ? images : src ? [src] : [],
  };
  if (row.span === "wide" || row.span === "tall") foto.span = row.span;
  return foto;
}

/** All published gallery moments. Rows without any image are skipped. */
export async function getGaleri(): Promise<Foto[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.galeri);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("galeri")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedGaleriList;
    return bySort(data as GaleriRow[])
      .map(toApp)
      .filter((f) => f.src !== "");
  } catch (error) {
    warnFallback("galeri", error);
    return seedGaleriList;
  }
}
