export type Sosial = {
  label: string;
  url: string;
};

export type PilarMisi = {
  nama: string;
  deskripsi: string;
};

export const club = {
  nama: "HIC",
  namaPanjang: "Hardware Interactive Club",
  namaLengkap: "HIC — STIKI Malang",
  tagline: "Ruang belajar keilmuan, di mana mahasiswa menjadi mentor satu sama lain.",
  visi: [
    "Mewujudkan HIC sebagai organisasi yang berintegritas, transparan, dan inklusif dalam mengembangkan kompetensi kejuruan dan kapasitas intelektual anggota, serta berkontribusi secara bertahap dalam ekosistem kemahasiswaan.",
  ],
  pilarMisi: [
    {
      nama: "Tata Kelola",
      deskripsi: "Sistem yang transparan, akuntabel, dan terorganisir.",
    },
    {
      nama: "Kultur Organisasi",
      deskripsi: "Diskusi terbuka dan musyawarah sebagai evaluasi objektif.",
    },
    {
      nama: "Kurikulum & Kompetensi",
      deskripsi: "Hard skills dan wawasan intelektual anggota secara terarah.",
    },
    {
      nama: "Kolaborasi Strategis",
      deskripsi: "Kemitraan dengan BEM dan pihak luar untuk memperluas dampak.",
    },
    {
      nama: "Fasilitas & Infrastruktur",
      deskripsi: "Penataan aset, pemeliharaan rutin, dan pengadaan tepat guna.",
    },
    {
      nama: "Integritas & Profesionalitas",
      deskripsi: "Disiplin, jujur, dan profesional dalam tanggung jawab.",
    },
    {
      nama: "Regenerasi Berkelanjutan",
      deskripsi: "Kaderisasi dan pembinaan yang terencana.",
    },
  ] satisfies PilarMisi[],
  statistik: [
    { angka: "1996", label: "Berdiri di STIKI Malang" },
    { angka: "25–26", label: "Periode kepengurusan" },
    { angka: "3", label: "Divisi keilmuan" },
    { angka: "7", label: "Pilar misi" },
  ],
  kontak: {
    email: "hic.stiki@gmail.com",
    instagram: "@hic_stiki",
    lokasi: "Sekret UKM HIC, Jl. Raya Tidar 100, Malang",
  },
};

export const sosial: Sosial[] = [
  { label: "Instagram", url: "https://instagram.com/hic_stiki" },
  { label: "GitHub", url: "https://github.com" },
  { label: "YouTube", url: "https://youtube.com" },
];