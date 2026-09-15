export type KurikulumItem = {
  nomor: string;
  judul: string;
  durasi: string;
  deskripsi: string;
};

export type Divisi = {
  slug: string;
  nama: string;
  namaPanjang: string;
  angka: string;
  tagline: string;
  deskripsi: string;
  akronim: string;
  warna: {
    utama: string;
    terang: string;
    latar: string;
    latarDark: string;
    border: string;
    borderDark: string;
  };
  kurikulum: KurikulumItem[];
  mentor: { nama: string; fokus: string }[];
};

export const divisi: Divisi[] = [
  {
    slug: "web",
    nama: "Web",
    namaPanjang: "Divisi Website Development",
    angka: "01",
    tagline: "Membangun hal yang bisa diakses siapa saja, dari mana saja.",
    deskripsi:
      "Dari HTML pertama sampai website yang benar-benar hidup di internet. Anggota senior mengajar langsung lewat praktik — bikin portofolio, lalu bikin website HIC sendiri.",
    akronim: "WEB",
    warna: {
      utama: "#d45311",
      terang: "#ffbe6b",
      latar: "#fff3e6",
      latarDark: "#2a1a10",
      border: "rgba(212, 83, 17, 0.18)",
      borderDark: "rgba(212, 83, 17, 0.35)",
    },
    kurikulum: [
      {
        nomor: "01",
        judul: "Dasar Website Development",
        durasi: "4 pertemuan",
        deskripsi:
          "HTML dan CSS untuk membangun struktur dan desain dasar halaman web.",
      },
      {
        nomor: "02",
        judul: "JavaScript & Interaktivitas",
        durasi: "6 pertemuan",
        deskripsi:
          "JavaScript untuk menambah interaktivitas dan fungsi dinamis pada website.",
      },
      {
        nomor: "03",
        judul: "Front-End Development",
        durasi: "6 pertemuan",
        deskripsi:
          "Framework populer seperti Bootstrap atau Tailwind CSS untuk mempercepat desain responsif.",
      },
      {
        nomor: "04",
        judul: "Praktik Proyek Website",
        durasi: "6 pertemuan",
        deskripsi:
          "Membuat website portofolio pribadi yang responsif dan interaktif, lalu membangun website sederhana untuk HIC.",
      },
    ],
    mentor: [
      { nama: "Satya Garda Prasetyo", fokus: "PJ Web Development" },
      { nama: "Faiz Ramadhan", fokus: "Pemeliharaan Website" },
    ],
  },
  {
    slug: "uiux",
    nama: "UI/UX",
    namaPanjang: "Divisi UI/UX Design",
    angka: "02",
    tagline: "Mengubah kerumitan menjadi antarmuka yang terasa mudah.",
    deskripsi:
      "Desain bukan soal cantik. Di divisi ini kami belajar membaca orang — riset, hierarki, prototipe, sampai menguji apakah desain benar-benar dipahami.",
    akronim: "UIUX",
    warna: {
      utama: "#fb9606",
      terang: "#ffd79c",
      latar: "#fff7ea",
      latarDark: "#2a1e11",
      border: "rgba(251, 150, 6, 0.22)",
      borderDark: "rgba(251, 150, 6, 0.35)",
    },
    kurikulum: [
      {
        nomor: "01",
        judul: "Pengenalan UI/UX",
        durasi: "4 pertemuan",
        deskripsi:
          "Perbedaan UI dan UX, pentingnya desain antarmuka yang ramah pengguna, dan studi kasus aplikasi dengan desain baik vs buruk.",
      },
      {
        nomor: "02",
        judul: "Prinsip Dasar Desain UI",
        durasi: "5 pertemuan",
        deskripsi:
          "Layouting dengan grid system dan hierarki visual, ditambah color theory, typography, dan ikonografi.",
      },
      {
        nomor: "03",
        judul: "Consistency & Simplicity",
        durasi: "4 pertemuan",
        deskripsi:
          "Prinsip konsistensi dan kesederhanaan dalam desain, dan membangun design system sederhana.",
      },
      {
        nomor: "04",
        judul: "Testing & Feedback",
        durasi: "5 pertemuan",
        deskripsi:
          "Usability testing untuk mengevaluasi desain, mengumpulkan feedback untuk iterasi, dan praktik A/B testing.",
      },
    ],
    mentor: [
      { nama: "Muhammad Dimas Cahyo", fokus: "PJ UI/UX Design" },
      { nama: "Kevin Pratama", fokus: "Visual & Branding" },
    ],
  },
  {
    slug: "robotics",
    nama: "Robotics",
    namaPanjang: "Divisi Robotics",
    angka: "03",
    tagline: "Mengubah benda mati menjadi robot yang punya fungsi.",
    deskripsi:
      "Dari dasar robotika sampai memprogram Arduino — divisi ini mengajarkan cara dunia fisik dan kode bertemu, lalu mewujudkannya lewat proyek robot sungguhan.",
    akronim: "ROBO",
    warna: {
      utama: "#f67f1e",
      terang: "#ffab52",
      latar: "#fff1e2",
      latarDark: "#291a10",
      border: "rgba(246, 127, 30, 0.2)",
      borderDark: "rgba(246, 127, 30, 0.35)",
    },
    kurikulum: [
      {
        nomor: "01",
        judul: "Pengenalan Robotika",
        durasi: "4 pertemuan",
        deskripsi:
          "Dasar-dasar dan fungsi tiap komponen robot, ditambah basic elektronik untuk memahami arus listrik.",
      },
      {
        nomor: "02",
        judul: "Pemrograman Arduino",
        durasi: "6 pertemuan",
        deskripsi:
          "Bahasa pemrograman C++ untuk kontrol perangkat Arduino, dan pemrograman gerakan menggunakan Arduino IDE.",
      },
      {
        nomor: "03",
        judul: "Simulasi dengan Software",
        durasi: "4 pertemuan",
        deskripsi:
          "Simulasi perangkat Arduino dengan software seperti TinkerCAD atau Wokwi.",
      },
      {
        nomor: "04",
        judul: "Proyek Robotik Sederhana",
        durasi: "8 pertemuan",
        deskripsi:
          "Merakit dan memprogram robot line follower, robot avoiding obstacles, dan arm robot sederhana untuk memindahkan objek.",
      },
    ],
    mentor: [
      { nama: "Zulhan Arif Fasya", fokus: "PJ Robotics" },
      { nama: "Fattih Kuwaka", fokus: "Inventaris & Hardware" },
    ],
  },
];

export function getDivisi(slug: string): Divisi | undefined {
  return divisi.find((d) => d.slug === slug);
}