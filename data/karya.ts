export type Karya = {
  judul: string;
  divisi: string;
  divisiSlug: string;
  tahun: string;
  deskripsi: string;
  tim: string[];
  gradien: string;
  emoji: string;
};

export const karya: Karya[] = [
  {
    judul: "KantinGo",
    divisi: "Web",
    divisiSlug: "web",
    tahun: "2025",
    deskripsi:
      "Peta antrean kantin kampus secara real-time, jadi tahu mana yang cepet padahal jam makan siang.",
    tim: ["Fajar R", "Dimas A", "Citra A"],
    gradien: "linear-gradient(135deg, #d45311 0%, #f67f1e 60%, #ffbe6b 100%)",
    emoji: "🧡",
  },
  {
    judul: "Sistem Absensi QR",
    divisi: "Web",
    divisiSlug: "web",
    tahun: "2025",
    deskripsi:
      "Absensi acara UKM cukup lewat scan QR di layar — tanpa kertas, tanpa antre tanda tangan.",
    tim: ["Raka P", "Bagas S"],
    gradien: "linear-gradient(135deg, #e35d18 0%, #fb9606 100%)",
    emoji: "📱",
  },
  {
    judul: "Redesign Portal BEM",
    divisi: "UI/UX",
    divisiSlug: "uiux",
    tahun: "2024",
    deskripsi:
      "Perombakan total portal informasi BEM: dari labirin menu jadi satu halaman yang langsung paham.",
    tim: ["Salsabila P", "Kevin P"],
    gradien: "linear-gradient(135deg, #fb9606 0%, #ffd79c 100%)",
    emoji: "✨",
  },
  {
    judul: "Studi Riset: Aplikasi Parkir",
    divisi: "UI/UX",
    divisiSlug: "uiux",
    tahun: "2024",
    deskripsi:
      "Riset + prototipe aplikasi parkir kampus. Temuan kuncinya: orang nggak butuh fitur, mereka butuh apps yang cepat.",
    tim: ["Alya M", "Nabila Z"],
    gradien: "linear-gradient(135deg, #f67f1e 0%, #ffab52 80%)",
    emoji: "🔍",
  },
  {
    judul: "Hydroponik Otomatis",
    divisi: "IoT",
    divisiSlug: "iot",
    tahun: "2025",
    deskripsi:
      "Tanaman hidroponik yang ambil data kelembapan dan siram sendiri, dipantau dari HP.",
    tim: ["Bagas S", "Rizky A"],
    gradien: "linear-gradient(135deg, #f67f1e 0%, #d45311 100%)",
    emoji: "🌱",
  },
  {
    judul: "Smart Trash",
    divisi: "IoT",
    divisiSlug: "iot",
    tahun: "2024",
    deskripsi:
      "Tempat sampah yang kasih tahu petugas kalau sudah penuh — lewat API, bukan lewat telepati.",
    tim: ["Mei L", "Rizky A", "Fajar R"],
    gradien: "linear-gradient(135deg, #e06a14 0%, #fb9606 70%)",
    emoji: "🗑️",
  },
];

export function getKarya(divisiSlug: string): Karya[] {
  return karya.filter((k) => k.divisiSlug === divisiSlug);
}