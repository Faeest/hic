import type { PengurusGrup } from "@/lib/types";

/**
 * Shared constants for pengurus groups. Safe to import from client components
 * (the admin group manager) and from the server-only content layer.
 *
 * `pembina` and `inti` are structural: every board is seeded with them, they
 * cannot be deleted, and their slug never changes. Labels and descriptions are
 * still editable, so the section's copy can be tuned without a deploy.
 */
export const RESERVED_GRUP_SLUGS = ["pembina", "inti"] as const;

export function isReservedGrup(slug: string): boolean {
  return (RESERVED_GRUP_SLUGS as readonly string[]).includes(slug);
}

/** URL-ish key derived from a label. Never shown as the primary UI string. */
export function slugifyGrup(label: string): string {
  const slug = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "kelompok";
}

/** Groups every board starts with, in display order. */
export const DEFAULT_GRUP: PengurusGrup[] = [
  { slug: "pembina", label: "Dosen Pembina", deskripsi: "", sort: 0 },
  {
    slug: "inti",
    label: "Badan Pengurus Harian",
    deskripsi: "Mengurus organisasi: jadwal, kas, dan dokumen.",
    sort: 10,
  },
  {
    slug: "biro",
    label: "Biro",
    deskripsi: "Mengurus mesin yang menjalankan kelas dan publikasinya.",
    sort: 20,
  },
  {
    slug: "koordinator",
    label: "Penanggung jawab divisi",
    deskripsi: "Diangkat oleh tiap divisi, bukan bagian dari BPH.",
    sort: 30,
  },
];
