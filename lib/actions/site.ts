"use server";

import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/actions/revalidate";
import type { PilarMisi, Sosial, Statistik, Testimoni } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Parse a JSON string produced by RepeaterField; tolerate junk. */
function jsonArray<T>(value: FormDataEntryValue | null, fallback: T[] = []): T[] {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function updateSite(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Tidak diizinkan." };
  }

  const payload = {
    id: 1,
    nama: str(formData, "nama"),
    nama_panjang: str(formData, "namaPanjang"),
    nama_lengkap: str(formData, "namaLengkap"),
    tagline: str(formData, "tagline"),
    visi: jsonArray<string>(formData.get("visi")),
    pilar_misi: jsonArray<PilarMisi>(formData.get("pilarMisi")),
    statistik: jsonArray<Statistik>(formData.get("statistik")),
    sosial: jsonArray<Sosial>(formData.get("sosial")),
    kontak_email: str(formData, "kontakEmail"),
    kontak_instagram: str(formData, "kontakInstagram"),
    kontak_lokasi: str(formData, "kontakLokasi"),
    hero_headline: jsonArray<string>(formData.get("heroHeadline")),
    hero_subcopy: str(formData, "heroSubcopy"),
    tentang_intro: str(formData, "tentangIntro"),
    tentang_tags: jsonArray<string>(formData.get("tentangTags")),
    logo_light_url: str(formData, "logoLightUrl"),
    logo_dark_url: str(formData, "logoDarkUrl"),
    cta_label: str(formData, "ctaLabel") || "Gabung HIC",
    cta_href: str(formData, "ctaHref") || "/#gabung",
    hero_cta_primary_label: str(formData, "heroCtaPrimaryLabel") || "Jelajahi Divisi",
    hero_cta_primary_href: str(formData, "heroCtaPrimaryHref") || "/#divisi",
    hero_cta_secondary_label: str(formData, "heroCtaSecondaryLabel") || "Tentang HIC",
    hero_cta_secondary_href: str(formData, "heroCtaSecondaryHref") || "/#tentang",
    gabung_body: str(formData, "gabungBody"),
    gabung_primary_label: str(formData, "gabungPrimaryLabel") || "Hubungi kami",
    gabung_primary_href: str(formData, "gabungPrimaryHref"),
    gabung_secondary_label: str(formData, "gabungSecondaryLabel") || "Kirim formulir minat",
    gabung_secondary_href: str(formData, "gabungSecondaryHref"),
    footer_eyebrow: str(formData, "footerEyebrow"),
    footer_title: str(formData, "footerTitle"),
    testimoni_items: jsonArray<Testimoni>(formData.get("testimoniItems")),
    marquee_items: jsonArray<string>(formData.get("marqueeItems")),
    tahun_berdiri: str(formData, "tahunBerdiri"),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}
