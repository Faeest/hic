export type Proker = {
  judul: string;
  kategori: string;
  divisiSlug: string;
  tahun: string;
  deskripsi: string;
  dana: string;
  gradien: string;
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
    gradien: "linear-gradient(135deg, #d45311 0%, #f67f1e 60%, #ffbe6b 100%)",
  },
  {
    judul: "Orientasi Jurusan (ORJU)",
    kategori: "Keilmuan",
    divisiSlug: "uiux",
    tahun: "Rutin",
    deskripsi:
      "Pematerian awal setiap bidang kejuruan agar calon anggota memahami jurusan yang ada di HIC.",
    dana: "Rp 500.000",
    gradien: "linear-gradient(135deg, #fb9606 0%, #ffd79c 100%)",
  },
  {
    judul: "HIC Hardware Hackathon",
    kategori: "Kompetisi",
    divisiSlug: "robotics",
    tahun: "Tahunan",
    deskripsi:
      "Wadah kompetisi inovasi teknologi tingkat kota untuk menguji kreativitas dan problem-solving. Terbuka untuk siswa-siswi SMA/K se-Malang Raya.",
    dana: "Rp 2.000.000 – Rp 4.000.000",
    gradien: "linear-gradient(135deg, #f67f1e 0%, #d45311 100%)",
  },
  {
    judul: "Workshop & Seminar HIC",
    kategori: "Keilmuan",
    divisiSlug: "web",
    tahun: "Tahunan",
    deskripsi:
      "Pematerian melalui workshop atau seminar bertema menarik, baik internal maupun eksternal kampus.",
    dana: "Rp 1.500.000 – Rp 2.000.000",
    gradien: "linear-gradient(135deg, #e35d18 0%, #fb9606 100%)",
  },
  {
    judul: "Goes to School & Goes to Campus",
    kategori: "Outreach",
    divisiSlug: "uiux",
    tahun: "Rutin",
    deskripsi:
      "Menjadi sumber pengetahuan serta promosi kampus bagi siswa-siswi SMA/K, baik secara mandiri maupun lewat PMB.",
    dana: "Menyesuaikan",
    gradien: "linear-gradient(135deg, #f67f1e 0%, #ffab52 80%)",
  },
  {
    judul: "Pembekalan Ilmu Kejuruan",
    kategori: "Keilmuan",
    divisiSlug: "robotics",
    tahun: "Rutin",
    deskripsi:
      "Pertemuan berkala berisi pematerian bidang peminatan masing-masing, dengan target 1 goals per 2 minggu untuk menjaga keaktifan.",
    dana: "Kas Internal",
    gradien: "linear-gradient(135deg, #e06a14 0%, #fb9606 70%)",
  },
];

export function getProker(divisiSlug: string): Proker[] {
  return proker.filter((p) => p.divisiSlug === divisiSlug);
}