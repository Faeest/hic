import type { Foto } from "@/lib/types";

// Type now lives in lib/types.ts (single source of truth).
export type { Foto };

export const galeri: Foto[] = [
  {
    src: "/ditkom_hic_2025.JPG",
    judul: "DITKOM 2025",
    keterangan: "Diklat Komputer — pematerian hardware untuk calon anggota.",
    span: "wide",
    images: ["/ditkom_hic_2025.JPG"],
  },
  {
    src: "/orsi_web_24.jpg",
    judul: "Orientasi Web 2024",
    keterangan: "Sesi orientasi divisi Website Development.",
    images: ["/orsi_web_24.jpg"],
  },
  {
    src: "/seminar_hardware.JPG",
    judul: "Seminar Hardware",
    keterangan: "Workshop dan seminar bertema hardware komputer.",
    images: ["/seminar_hardware.JPG"],
  },
  {
    src: "/ditkom_hic_2024.JPG",
    judul: "DITKOM 2024",
    keterangan: "Penerimaan dan pengenalan HIC untuk anggota baru.",
    span: "tall",
    images: ["/ditkom_hic_2024.JPG"],
  },
  {
    src: "/main_di_sekre.jpg",
    judul: "Sekret HIC",
    keterangan: "Hari biasa di sekret — diskusi dan mengerjakan proyek.",
    images: ["/main_di_sekre.jpg"],
  },
];