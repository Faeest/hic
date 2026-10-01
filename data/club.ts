// Shim: content now lives in content/site.json, edited via the CMS at /admin.
// Kept so existing `@/data/club` imports keep working.
export type { Sosial, PilarMisi, Statistik, Kontak } from "@/lib/types";
import { site } from "@/lib/content";

export const club = site;
export const sosial = site.sosial;
