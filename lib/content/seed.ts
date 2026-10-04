/**
 * Seed defaults — the local source of truth mirrored into Supabase.
 *
 * Deliberately free of `import "server-only"` and any Supabase import, so it
 * can be used by both the app (as a fallback) and the seed script (plain Node).
 */

import { club, sosial } from "@/data/club";
import type { Section, Site } from "@/lib/types";

export const seedSite: Site = {
  nama: club.nama,
  namaPanjang: club.namaPanjang,
  namaLengkap: club.namaLengkap,
  tagline: club.tagline,
  visi: club.visi,
  pilarMisi: club.pilarMisi,
  statistik: club.statistik,
  sosial,
  kontak: club.kontak,
  heroHeadline: ["Hardware", "Interactive", "Club"],
  heroSubcopy:
    "Ruang belajar keilmuan di mana mahasiswa menjadi mentor bagi satu sama lain — melalui kelas kecil untuk Web, UI/UX, dan Robotics.",
  tentangIntro:
    "Bukan klub olahraga, bukan juga lembaga sosial. Kami adalah kumpulan mahasiswa lintas jurusan yang percaya bahwa ilmu teknologi paling baik diserap ketika diajarkan oleh teman sebaya — hangat, kontekstual, dan tanpa sekat.",
  tentangTags: [
    "Peer mentoring",
    "Kelas kecil",
    "Lintas jurusan",
    "Proyek nyata",
    "Est. 1996",
  ],
  logoLightUrl: "/variant_logo-hic/Logogram ORANGE BLACK.png",
  logoDarkUrl: "/variant_logo-hic/Logogram ORANGE WHITE.png",
  testimoni: {
    nama: "Dimas Arya",
    teks: "Di sini saya belajar React dari teman sekamar, bukan dari dosen.",
    peran: "Alumnus Divisi Web",
  },
  marqueeItems: [
    "Hardware Interactive Club",
    "Web Development",
    "UI/UX Design",
    "Robotics",
    "Peer Mentoring",
  ],
  tahunBerdiri: "1996",
  periodeKepengurusan: "2025–2026",
};

export const seedSections: Section[] = [
  { key: "tentang", index: "I", label: "Tentang HIC", title: "Belajar dari yang baru saja belajar.", accent: "baru saja belajar", visible: true },
  { key: "divisi", index: "II", label: "Divisi", title: "Tiga jalur, satu cara belajar.", accent: "cara belajar", visible: true },
  { key: "pengurus", index: "III", label: "Pengurus", title: "Orang-orang di balik kursi.", accent: "kursi", visible: true },
  { key: "proker", index: "IV", label: "Program Kerja", title: "Agenda nyata, bukan sekadar rencana.", accent: "bukan sekadar rencana", visible: true },
  { key: "galeri", index: "V", label: "Galeri Kegiatan", title: "Momen-momen di sekret & ruang kelas.", accent: "sekret & ruang kelas", visible: true },
  { key: "faq", index: "VI", label: "FAQ", title: "Sering ditanya, jawabannya di sini.", accent: "jawabannya di sini", visible: true },
  { key: "gabung", index: "VI", label: "Tertarik gabung?", title: "Mulai dari langkah kecil yang penasaran.", accent: "langkah kecil", visible: true },
];
