"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { PilarMisi, Sosial, Statistik } from "@/lib/types";

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
    testimoni_nama: str(formData, "testimoniNama"),
    testimoni_teks: str(formData, "testimoniTeks"),
    testimoni_peran: str(formData, "testimoniPeran"),
    marquee_items: jsonArray<string>(formData.get("marqueeItems")),
    tahun_berdiri: str(formData, "tahunBerdiri"),
    periode_kepengurusan: str(formData, "periodeKepengurusan"),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/divisi/[slug]", "page");
  return { ok: true };
}
