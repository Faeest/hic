import type { Kepengurusan } from "@/lib/types";

/**
 * Seed board. The database is the source of truth once seeded; this only feeds
 * `scripts/seed.ts` and the offline fallback in `lib/content/pengurus.ts`.
 */
export const kepengurusan: Kepengurusan = {
  id: "",
  nama: "Kepengurusan 2025/2026",
  periode: "2025–2026",
  aktif: true,
  catatan: "",
  sort: 0,
};
