export type Proker = {
  judul: string;
  kategori: string;
  divisiSlug: string;
  tahun: string;
  deskripsi: string;
  dana: string;
  warna: string;
};

export const proker: Proker[] = [
  {
    judul: "Diklat Komputer (DITKOM)",
    kategori: "Keilmuan",
    divisiSlug: "web",
    tahun: "Rutin",
    deskripsi:
      "Agenda wajib penerimaan dan pengenalan HIC untuk calon anggota. Fokus pada pematerian awal materi umum tentang hardware komputer.",
    dana: "Rp 500.000",
    warna: "#d45311",
  },
  {
    judul: "Orientasi Jurusan (ORJU)",
    kategori: "Keilmuan",
    divisiSlug: "uiux",
    tahun: "Rutin",
    deskripsi:
      "Pematerian awal setiap bidang kejuruan agar calon anggota memahami jurusan yang ada di HIC.",
    dana: "Rp 500.000",
    warna: "#f07d05",
  },
  {
    judul: "HIC Hardware Hackathon",
    kategori: "Kompetisi",
    divisiSlug: "robotics",
    tahun: "Tahunan",
    deskripsi:
      "Wadah kompetisi inovasi teknologi tingkat kota untuk menguji kreativitas dan problem-solving. Terbuka untuk siswa-siswi SMA/K se-Malang Raya.",
    dana: "Rp 2.000.000 – Rp 4.000.000",
    warna: "#e26310",
  },
  {
    judul: "Workshop & Seminar HIC",
    kategori: "Keilmuan",
    divisiSlug: "web",
    tahun: "Tahunan",
    deskripsi:
      "Pematerian melalui workshop atau seminar bertema menarik, baik internal maupun eksternal kampus.",
    dana: "Rp 1.500.000 – Rp 2.000.000",
    warna: "#cf4f13",
  },
  {
    judul: "Goes to School & Goes to Campus",
    kategori: "Outreach",
    divisiSlug: "uiux",
    tahun: "Rutin",
    deskripsi:
      "Menjadi sumber pengetahuan serta promosi kampus bagi siswa-siswi SMA/K, baik secara mandiri maupun lewat PMB.",
    dana: "Menyesuaikan",
    warna: "#f68a28",
  },
  {
    judul: "Pembekalan Ilmu Kejuruan",
    kategori: "Keilmuan",
    divisiSlug: "robotics",
    tahun: "Rutin",
    deskripsi:
      "Pertemuan berkala berisi pematerian bidang peminatan masing-masing, dengan target 1 goals per 2 minggu untuk menjaga keaktifan.",
    dana: "Kas Internal",
    warna: "#d95f0f",
  },
];

export function getProker(divisiSlug: string): Proker[] {
  return proker.filter((p) => p.divisiSlug === divisiSlug);
}