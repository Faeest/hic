export type Pengurus = {
  nama: string;
  jabatan: string;
  deskripsi: string;
  inisial: string;
  gradien: string;
};

export const pengurusInti: Pengurus[] = [
  {
    nama: "Aurora Maheswari",
    jabatan: "Ketua Umum",
    deskripsi:
      "Merangkai arah organisasi dan menjaga ritme belajar tetap hangat di setiap divisi.",
    inisial: "AM",
    gradien:
      "linear-gradient(135deg, #d45311 0%, #fb9606 70%, #ffbe6b 100%)",
  },
  {
    nama: "Raka Pradipta",
    jabatan: "Sekretaris",
    deskripsi:
      "Penjaga catatan, jadwal kelas, dan alur dokumen organisasi.",
    inisial: "RP",
    gradien:
      "linear-gradient(135deg, #f67f1e 0%, #fb9606 100%)",
  },
  {
    nama: "Nabila Zahra",
    jabatan: "Bendahara",
    deskripsi:
      "Mengelola kas, kebutuhan modul, dan memastikan tiap kelas punya cukup kopi.",
    inisial: "NZ",
    gradien:
      "linear-gradient(135deg, #fb9606 0%, #ffbe6b 80%)",
  },
];

export const koordinatorDivisi: Pengurus[] = [
  {
    nama: "Fajar Ramadhan",
    jabatan: "Koordinator Divisi Web",
    deskripsi: "Memandu kurikulum dan mentoring untuk jalur web development.",
    inisial: "FR",
    gradien: "linear-gradient(135deg, #d45311, #f67f1e)",
  },
  {
    nama: "Salsabila Putri",
    jabatan: "Koordinator Divisi UI/UX",
    deskripsi: "Menjaga kualitas riset, desain, dan evaluasi antarmuka.",
    inisial: "SP",
    gradien: "linear-gradient(135deg, #fb9606, #ffbe6b)",
  },
  {
    nama: "Bagas Setiawan",
    jabatan: "Koordinator Divisi IoT",
    deskripsi: "Merawat hardware, eksperimen sensor, dan proyek fisik.",
    inisial: "BS",
    gradien: "linear-gradient(135deg, #f67f1e, #d45311)",
  },
];