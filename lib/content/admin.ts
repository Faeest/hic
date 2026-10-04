import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DivisiRow,
  FaqRow,
  GaleriRow,
  KurikulumRow,
  MentorRow,
  PengurusRow,
  ProkerRow,
  SectionRow,
  SiteSettingsRow,
} from "@/lib/types";

/**
 * Admin reads. Unlike `lib/content/*`, these use the cookie-bound client so
 * RLS grants the authenticated admin access to unpublished rows too.
 *
 * The table is chosen at runtime, so we use a loosely-typed client; RLS is the
 * real guard.
 */
export async function adminList<T>(table: string): Promise<T[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

export const adminSections = () => adminList<SectionRow>("sections");
export const adminDivisi = () => adminList<DivisiRow>("divisi");
export const adminKurikulum = () => adminList<KurikulumRow>("kurikulum");
export const adminMentor = () => adminList<MentorRow>("mentor");
export const adminPengurus = () => adminList<PengurusRow>("pengurus");
export const adminProker = () => adminList<ProkerRow>("proker");
export const adminGaleri = () => adminList<GaleriRow>("galeri");
export const adminFaq = () => adminList<FaqRow>("faq");

export async function adminSite(): Promise<SiteSettingsRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
