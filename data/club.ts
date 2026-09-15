export type Sosial = {
  label: string;
  url: string;
};

export const club = {
  nama: "HIC",
  namaPanjang: "Hardware Interactive Club",
  tagline: "Ruang belajar keilmuan, di mana mahasiswa menjadi mentor satu sama lain.",
  about: {
    intro:
      "HIC adalah UKM keilmuan yang tumbuh dari satu premis sederhana: yang paling paham soal belajar adalah yang baru saja belajar.",
    body: [
      "Kami bukan klub olahraga, bukan juga lembaga sosial. Kami adalah kumpulan mahasiswa lintas jurusan yang percaya bahwa ilmu teknologi paling baik diserap ketika diajarkan oleh teman sebaya — hangat, kontekstual, dan tanpa sekat.",
      "Tidak ada dosen di sini. Setiap semester, anggota senior membuka kelas kecil untuk divisi masing-masing, dan setiap orang — dari ketua umum sampai anggota baru — duduk setara di meja yang sama.",
    ],
  },
  statistik: [
    { angka: "2018", label: "Tahun berdiri" },
    { angka: "40+", label: "Anggota aktif" },
    { angka: "3", label: "Divisi keilmuan" },
    { angka: "120+", label: "Karya & proyek" },
  ],
  kontak: {
    email: "halo@hic.uc.ac.id",
    instagram: "@hic.university",
    lokasi: "Kampus UKM — Building C, Ruang 204",
  },
};

export const sosial: Sosial[] = [
  { label: "Instagram", url: "https://instagram.com" },
  { label: "GitHub", url: "https://github.com" },
  { label: "LinkedIn", url: "https://linkedin.com" },
];