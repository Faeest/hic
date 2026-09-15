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
    namaPanjang: "Divisi Web Development",
    angka: "01",
    tagline: "Membangun hal yang bisa diakses siapa saja, dari mana saja.",
    deskripsi:
      "Dari HTML pertama sampai deployment pertama — divisi web adalah gerbang masuk paling ramah bagi anggota baru. Anggota senior mengajar langsung lewat proyek nyata, bukan materi basi.",
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
        judul: "Dasar Web & Semantik",
        durasi: "4 pertemuan",
        deskripsi:
          "HTML yang benar, CSS yang rasa, dan anatomi halaman yang sehat sebelum menulis satu baris JavaScript.",
      },
      {
        nomor: "02",
        judul: "JavaScript & Interaksi",
        durasi: "6 pertemuan",
        deskripsi:
          "DOM, event, dan memanjakan pengguna dengan interaksi kecil yang membuat halaman terasa hidup.",
      },
      {
        nomor: "03",
        judul: "React & Framework",
        durasi: "8 pertemuan",
        deskripsi:
          "Berpindah ke komponen, state, dan membangun antarmuka yang bisa tumbuh tanpa ambruk.",
      },
      {
        nomor: "04",
        judul: "Deploy & Produksi",
        durasi: "4 pertemuan",
        deskripsi:
          "Menerbangkan proyek ke internet sungguhan, belajar performance, dan membaca error tanpa panik.",
      },
    ],
    mentor: [
      { nama: "Fajar Ramadhan", fokus: "React & Frontend" },
      { nama: "Dimas Arya", fokus: "Backend & API" },
      { nama: "Citra Ayu", fokus: "CSS & Animasi" },
    ],
  },
  {
    slug: "uiux",
    nama: "UI/UX",
    namaPanjang: "Divisi UI/UX Design",
    angka: "02",
    tagline: "Mengubah kerumitan menjadi antarmuka yang terasa mudah.",
    deskripsi:
      "Desain bukan soal cantik. Di divisi ini kami belajar membaca orang: riset, hierarki, prototipe, sampai menguji apakah desain benar-benar dipahami — bukan sekadar disukai.",
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
        judul: "Riset & Empati",
        durasi: "5 pertemuan",
        deskripsi:
          "Wawancara, persona, dan memahami masalah sebelum membuka tool desain apa pun.",
      },
      {
        nomor: "02",
        judul: "Hierarki & Komposisi",
        durasi: "5 pertemuan",
        deskripsi:
          "Grid, tipografi, dan tata letak yang menuntun mata — pelajaran paling sering diremehkan, paling sering terlihat.",
      },
      {
        nomor: "03",
        judul: "Prototipe & Interaksi",
        durasi: "6 pertemuan",
        deskripsi:
          "Wireframe, prototype klik, dan micro-interaction yang membuat produk terasa hidup.",
      },
      {
        nomor: "04",
        judul: "Uji & Iterasi",
        durasi: "4 pertemuan",
        deskripsi:
          "Usability testing sederhana, menangkap feedback, dan berani menghapus hal yang tidak bekerja.",
      },
    ],
    mentor: [
      { nama: "Salsabila Putri", fokus: "Produk & Riset" },
      { nama: "Kevin Pratama", fokus: "Visual & Branding" },
      { nama: "Alya Maharani", fokus: "Prototyping" },
    ],
  },
  {
    slug: "iot",
    nama: "IoT",
    namaPanjang: "Divisi Internet of Things",
    angka: "03",
    tagline: "Menghidupkan benda mati dan membuatnya bercerita.",
    deskripsi:
      "Dari sensor yang membaca suhu sampai perangkat yang merespons sentuhan. Divisi IoT mengajarkan cara dunia fisik dan kode bertemu.",
    akronim: "IOT",
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
        judul: "Dasar Elektronika",
        durasi: "5 pertemuan",
        deskripsi:
          "Tegangan, arus, dan membaca diagram sebelum membiarkan asap keluar dari komponen.",
      },
      {
        nomor: "02",
        judul: "Mikrokontroler",
        durasi: "6 pertemuan",
        deskripsi:
          "Arduino & sensor dasar: cahaya, suhu, jarak — dan cara membuatnya merespons dunia nyata.",
      },
      {
        nomor: "03",
        judul: "Jaringan & Cloud",
        durasi: "6 pertemuan",
        deskripsi:
          "Menghubungkan perangkat ke internet, mengirim data, dan membaca satu sama lain lewat protokol.",
      },
      {
        nomor: "04",
        judul: "Proyek Akhir",
        durasi: "8 pertemuan",
        deskripsi:
          "Menggabungkan hardware dan software menjadi satu produk utuh yang bisa dipamerkan.",
      },
    ],
    mentor: [
      { nama: "Bagas Setiawan", fokus: "Mikrokontroler" },
      { nama: "Rizky Adi", fokus: "Sensor & Aktuator" },
      { nama: "Mei Lin", fokus: "Cloud & Jaringan" },
    ],
  },
];

export function getDivisi(slug: string): Divisi | undefined {
  return divisi.find((d) => d.slug === slug);
}