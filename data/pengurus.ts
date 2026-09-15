export type Pengurus = {
  nama: string;
  jabatan: string;
  deskripsi: string;
  inisial: string;
  gradien: string;
};

export const pembina: Pengurus = {
  nama: "Hilman Nuril Hadi, S.Kom., M.Kom",
  jabatan: "Dosen Pembina",
  deskripsi:
    "Dosen pembina HIC yang menaungi dan mengarahkan jalannya organisasi.",
  inisial: "HN",
  gradien: "linear-gradient(135deg, #d45311 0%, #f67f1e 60%, #fb9606 100%)",
};

export const pengurusInti: Pengurus[] = [
  {
    nama: "Muhammad Ilham Wiradisastra",
    jabatan: "Ketua Umum",
    deskripsi:
      "Memimpin arah organisasi dan menjaga ritme belajar tetap hangat di setiap divisi.",
    inisial: "MI",
    gradien:
      "linear-gradient(135deg, #d45311 0%, #fb9606 70%, #ffbe6b 100%)",
  },
  {
    nama: "Maria Dealova Indah Natara",
    jabatan: "Sekretaris",
    deskripsi:
      "Penjaga catatan, jadwal kelas, dan alur dokumen organisasi.",
    inisial: "MD",
    gradien:
      "linear-gradient(135deg, #fb9606 0%, #ffd79c 80%)",
  },
  {
    nama: "Norbertus Bimantya Abadi",
    jabatan: "Bendahara",
    deskripsi:
      "Mengelola kas, kebutuhan modul, dan memastikan tiap kelas berjalan.",
    inisial: "NB",
    gradien:
      "linear-gradient(135deg, #f67f1e 0%, #fb9606 100%)",
  },
];

export const koordinatorDivisi: Pengurus[] = [
  {
    nama: "Satya Garda Prasetyo",
    jabatan: "PJ Divisi Web",
    deskripsi: "Memandu kurikulum dan mentoring untuk jalur web development.",
    inisial: "SG",
    gradien: "linear-gradient(135deg, #d45311, #f67f1e)",
  },
  {
    nama: "Muhammad Dimas Cahyo",
    jabatan: "PJ Divisi UI/UX",
    deskripsi: "Menjaga kualitas riset, desain, dan evaluasi antarmuka.",
    inisial: "MD",
    gradien: "linear-gradient(135deg, #fb9606, #ffbe6b)",
  },
  {
    nama: "Zulhan Arif Fasya",
    jabatan: "PJ Divisi Robotics",
    deskripsi: "Merawat eksperimen robotik dan proyek perangkat fisik.",
    inisial: "ZA",
    gradien: "linear-gradient(135deg, #f67f1e, #d45311)",
  },
];