import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { Section, SectionRow, Site, SiteSettingsRow } from "@/lib/types";
import { bySort, warnFallback } from "./util";
import { seedSections, seedSite } from "./seed";

// Re-exported for callers that want the seed values alongside the readers.
export { seedSections, seedSite };

export function rowToSite(row: SiteSettingsRow): Site {
  return {
    nama: row.nama,
    namaPanjang: row.nama_panjang,
    namaLengkap: row.nama_lengkap,
    tagline: row.tagline,
    visi: row.visi ?? [],
    pilarMisi: row.pilar_misi ?? [],
    statistik: row.statistik ?? [],
    sosial: row.sosial ?? [],
    kontak: {
      email: row.kontak_email,
      instagram: row.kontak_instagram,
      lokasi: row.kontak_lokasi,
    },
    heroHeadline: row.hero_headline ?? [],
    heroSubcopy: row.hero_subcopy,
    tentangIntro: row.tentang_intro,
    tentangTags: row.tentang_tags ?? [],
    logoLightUrl: row.logo_light_url || seedSite.logoLightUrl,
    logoDarkUrl: row.logo_dark_url || seedSite.logoDarkUrl,
    testimoni: {
      nama: row.testimoni_nama,
      teks: row.testimoni_teks,
      peran: row.testimoni_peran,
    },
    marqueeItems: row.marquee_items ?? [],
    tahunBerdiri: row.tahun_berdiri || "1996",
    periodeKepengurusan: row.periode_kepengurusan || "2025–2026",
  };
}

export function rowToSection(row: SectionRow): Section {
  return {
    key: row.key,
    index: row.kicker,
    label: row.label,
    title: row.title,
    accent: row.accent,
    visible: row.visible,
  };
}

export async function getSite(): Promise<Site> {
  "use cache";
  cacheTag(CONTENT_TAGS.site);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return seedSite;
    return rowToSite(data);
  } catch (error) {
    warnFallback("site_settings", error);
    return seedSite;
  }
}

export async function getSections(): Promise<Section[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.sections);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("sections")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedSections;
    return bySort(data as SectionRow[]).map(rowToSection);
  } catch (error) {
    warnFallback("sections", error);
    return seedSections;
  }
}

/** Convenience: map of section key -> Section, for O(1) lookup in components. */
export async function getSectionMap(): Promise<Record<string, Section>> {
  const sections = await getSections();
  return Object.fromEntries(sections.map((s) => [s.key, s]));
}
