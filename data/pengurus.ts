import type { Pengurus } from "@/lib/types";

// Type now lives in lib/types.ts (single source of truth).
export type { Pengurus };

export const pembina: Pengurus = {
  nama: "Hilman Nuril Hadi, S.Kom., M.Kom",
  jabatan: "Dosen Pembina",
  deskripsi:
    "Dosen pembina HIC yang menaungi dan mengarahkan jalannya organisasi.",
  inisial: "HN",
  gradien: "#d45311",
};

export const pengurusInti: Pengurus[] = [
  {
    nama: "Muhammad Ilham Wiradisastra",
    jabatan: "Ketua Umum",
    deskripsi:
      "Memimpin arah organisasi dan menjaga ritme belajar tetap hangat di setiap divisi.",
    inisial: "MI",
    gradien: "#d45311",
    nrp: "241111009",
  },
  {
    nama: "Maria Dealova Indah Natara",
    jabatan: "Sekretaris",
    deskripsi:
      "Penjaga catatan, jadwal kelas, dan alur dokumen organisasi.",
    inisial: "MD",
    gradien: "#fb9606",
    nrp: "241111004",
  },
  {
    nama: "Norbertus Bimantya Abadi",
    jabatan: "Bendahara",
    deskripsi:
      "Mengelola kas, kebutuhan modul, dan memastikan tiap kelas berjalan.",
    inisial: "NB",
    gradien: "#f67f1e",
    nrp: "241111021",
  },
];

export const koordinatorDivisi: Pengurus[] = [
  {
    nama: "Satya Garda Prasetyo",
    jabatan: "PJ Divisi Web",
    deskripsi: "Memandu kurikulum dan mentoring untuk jalur web development.",
    inisial: "SG",
    gradien: "#d45311",
    unit: "web",
  },
  {
    nama: "Muhammad Dimas Cahyo",
    jabatan: "PJ Divisi UI/UX",
    deskripsi: "Menjaga kualitas riset, desain, dan evaluasi antarmuka.",
    inisial: "MD",
    gradien: "#fb9606",
    unit: "uiux",
  },
  {
    nama: "Zulhan Arif Fasya",
    jabatan: "PJ Divisi Robotics",
    deskripsi: "Merawat eksperimen robotik dan proyek perangkat fisik.",
    inisial: "ZA",
    gradien: "#f67f1e",
    unit: "robotics",
  },
];

/**
 * Biro — the working bodies. Mirrors the 2025/2026 board so the offline
 * fallback (Supabase unreachable) still renders a complete section.
 */
export const biroPengurus: Pengurus[] = [
  {
    nama: "Fattih Kuwaka Bekti",
    jabatan: "Inventaris",
    deskripsi: "Merawat inventaris dan perlengkapan yang dipakai tiap kelas.",
    inisial: "FK",
    gradien: "#d45311",
    unit: "inventaris",
    nrp: "241111005",
  },
  {
    nama: "Berliani Hana Safira",
    jabatan: "Humas",
    deskripsi: "Menjaga komunikasi dan hubungan HIC dengan pihak luar.",
    inisial: "BH",
    gradien: "#fb9606",
    unit: "humas",
    nrp: "241131012",
  },
  {
    nama: "Deswiryawan Saragih",
    jabatan: "Humas",
    deskripsi: "Menjaga komunikasi dan hubungan HIC dengan pihak luar.",
    inisial: "DS",
    gradien: "#f67f1e",
    unit: "humas",
    nrp: "241111008",
  },
  {
    nama: "Dico Havianto",
    jabatan: "3D",
    deskripsi: "Menggarap aset dan eksperimen pemodelan 3D.",
    inisial: "DH",
    gradien: "#d45311",
    unit: "3d",
    nrp: "241111017",
  },
  {
    nama: "Angie Nabilah Fidela",
    jabatan: "3D",
    deskripsi: "Menggarap aset dan eksperimen pemodelan 3D.",
    inisial: "AN",
    gradien: "#fb9606",
    unit: "3d",
    nrp: "242111025",
  },
  {
    nama: "Nanda Rizky Ramadhani Wijaya",
    jabatan: "Program dan Acara",
    deskripsi: "Menyusun dan menjalankan program kerja serta acara HIC.",
    inisial: "NR",
    gradien: "#f67f1e",
    unit: "program-acara",
    nrp: "241111007",
  },
  {
    nama: "Akhmad Zakariya",
    jabatan: "Program dan Acara",
    deskripsi: "Menyusun dan menjalankan program kerja serta acara HIC.",
    inisial: "AZ",
    gradien: "#d45311",
    unit: "program-acara",
    nrp: "241111010",
  },
  {
    nama: "Faiz Ramadhan",
    jabatan: "Website HIC",
    deskripsi: "Mengembangkan dan merawat situs serta sistem HIC.",
    inisial: "FR",
    gradien: "#fb9606",
    unit: "website",
    nrp: "241111011",
  },
  {
    nama: "Berliani Hana Safira",
    jabatan: "Keilmuan",
    deskripsi: "Mengelola materi, kurikulum, dan kegiatan keilmuan.",
    inisial: "BH",
    gradien: "#f67f1e",
    unit: "keilmuan",
    nrp: "241131012",
  },
  {
    nama: "Deswiryawan Saragih",
    jabatan: "Keilmuan",
    deskripsi: "Mengelola materi, kurikulum, dan kegiatan keilmuan.",
    inisial: "DS",
    gradien: "#d45311",
    unit: "keilmuan",
    nrp: "241111008",
  },
];