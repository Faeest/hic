// Shim: content now lives in content/pengurus.json, edited via the CMS at /admin.
export type { Pengurus, PengurusContent } from "@/lib/types";
import { pengurus } from "@/lib/content";

export const pembina = pengurus.pembina;
export const pengurusInti = pengurus.inti;
export const koordinatorDivisi = pengurus.koordinator;
