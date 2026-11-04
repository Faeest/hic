import type { Post } from "@/lib/types";

/**
 * Seed posts — the fallback used when the `posts` table is unreachable or
 * empty (see `lib/content/posts.ts`).
 *
 * Required, not decorative: `app/blog/[slug]` declares `generateStaticParams`,
 * and with Cache Components enabled Next fails the build when that function
 * returns zero results. Without a seed, a paused/unreachable Supabase project
 * turns into `Command "npm run build" exited with 1`.
 */

const SEED_DATE = "2026-01-01T00:00:00.000Z";

export const posts: Post[] = [
  {
    id: "seed-selamat-datang",
    slug: "selamat-datang",
    title: "Selamat datang di blog HIC",
    excerpt:
      "Catatan, tutorial, dan cerita dari Hardware Interactive Club. Halaman ini tampil dari data cadangan selama basis data konten belum terhubung.",
    coverUrl: "",
    bodyMd: `Halo! Ini halaman contoh dari **data cadangan** (\`data/posts.ts\`).

Blog HIC dipakai untuk membagikan catatan kegiatan, tutorial, dan cerita dari anggota.

## Kenapa halaman ini ada

Kalau basis data konten sedang tidak bisa dihubungi, situs tetap harus bisa dibangun dan di-deploy. Karena itu setiap artikel punya cadangan di repositori.

Setelah basis data kembali normal, artikel asli dari CMS akan otomatis menggantikan halaman ini.`,
    tags: ["Pengumuman"],
    published: true,
    publishedAt: SEED_DATE,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-mulai-hardware",
    slug: "mulai-belajar-hardware",
    title: "Mulai belajar hardware dari nol",
    excerpt:
      "Urutan belajar yang masuk akal untuk pemula: dari mengenal komponen sampai merakit dan memprogram mikrokontroler.",
    coverUrl: "",
    bodyMd: `Belajar hardware tidak harus mulai dari teori berat. Urutan yang nyaman:

1. **Kenali komponen** — resistor, kapasitor, transistor, dan cara membaca nilai.
2. **Rangkai di breadboard** — LED, tombol, dan sensor sederhana.
3. **Pindah ke mikrokontroler** — Arduino atau ESP32 untuk membaca sensor.
4. **Rapikan jadi proyek** — soldering, casing, dan dokumentasi.

## Tips

- Selalu cek polaritas sebelum memberi daya.
- Simpan catatan setiap rangkaian; dokumentasi adalah bagian dari belajar.
- Gabung diskusi divisi supaya tidak buntu sendirian.`,
    tags: ["Tutorial", "Pemula"],
    published: true,
    publishedAt: SEED_DATE,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
];
