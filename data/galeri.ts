export type Foto = {
  src: string;
  judul: string;
  keterangan: string;
  span?: "wide" | "tall";
};

export const galeri: Foto[] = [
  {
    src: "/ditkom_hic_2025.JPG",
    judul: "DITKOM 2025",
    keterangan: "Diklat Komputer — pematerian hardware untuk calon anggota.",
    span: "wide",
  },
  {
    src: "/orsi_web_24.jpg",
    judul: "Orientasi Web 2024",
    keterangan: "Sesi orientasi divisi Website Development.",
  },
  {
    src: "/seminar_hardware.JPG",
    judul: "Seminar Hardware",
    keterangan: "Workshop dan seminar bertema hardware komputer.",
  },
  {
    src: "/ditkom_hic_2024.JPG",
    judul: "DITKOM 2024",
    keterangan: "Penerimaan dan pengenalan HIC untuk anggota baru.",
    span: "tall",
  },
  {
    src: "/main_di_sekre.jpg",
    judul: "Sekret HIC",
    keterangan: "Hari biasa di sekret — diskusi dan mengerjakan proyek.",
  },
];