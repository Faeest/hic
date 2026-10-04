import type { ResourceConfig } from "./resource";

/** Central config for every CRUD screen. */

export const sectionsConfig: ResourceConfig = {
  table: "sections",
  noun: "Seksi",
  titleKey: "label",
  subtitleKey: "title",
  createLabel: "Tambah seksi",
  fields: [
    { kind: "text", name: "key", label: "Kunci", required: true, hint: "mis. tentang, divisi, pengurus (unik, huruf kecil)." },
    { kind: "text", name: "kicker", label: "Angka Romawi", hint: "mis. I, II, III." },
    { kind: "text", name: "label", label: "Label" },
    { kind: "text", name: "title", label: "Judul" },
    { kind: "text", name: "accent", label: "Teks aksen", hint: "Bagian dari judul yang diberi warna." },
    { kind: "number", name: "sort", label: "Urutan" },
    { kind: "bool", name: "visible", label: "Tampilkan" },
  ],
};

export const divisiConfig: ResourceConfig = {
  table: "divisi",
  noun: "Divisi",
  titleKey: "nama",
  subtitleKey: "nama_panjang",
  createLabel: "Tambah divisi",
  fields: [
    { kind: "text", name: "slug", label: "Slug", required: true, hint: "URL: /divisi/<slug>" },
    { kind: "text", name: "nama", label: "Nama", required: true },
    { kind: "text", name: "nama_panjang", label: "Nama panjang" },
    { kind: "text", name: "angka", label: "Angka" },
    { kind: "text", name: "akronim", label: "Akronim" },
    { kind: "textarea", name: "tagline", label: "Tagline", rows: 2 },
    { kind: "textarea", name: "deskripsi", label: "Deskripsi", rows: 4 },
    { kind: "color", name: "warna_utama", label: "Warna utama" },
    { kind: "color", name: "warna_terang", label: "Warna terang" },
    { kind: "color", name: "warna_latar", label: "Warna latar" },
    { kind: "color", name: "warna_latarDark", label: "Warna latar (gelap)" },
    { kind: "text", name: "warna_border", label: "Warna border" },
    { kind: "text", name: "warna_borderDark", label: "Warna border (gelap)" },
    { kind: "number", name: "sort", label: "Urutan" },
    { kind: "bool", name: "published", label: "Terbitkan" },
  ],
};

export const pengurusConfig: ResourceConfig = {
  table: "pengurus",
  noun: "Pengurus",
  titleKey: "nama",
  subtitleKey: "jabatan",
  createLabel: "Tambah pengurus",
  fields: [
    { kind: "text", name: "nama", label: "Nama", required: true },
    { kind: "text", name: "jabatan", label: "Jabatan" },
    {
      kind: "select",
      name: "kategori",
      label: "Kategori",
      options: [
        { value: "pembina", label: "Dosen Pembina" },
        { value: "inti", label: "BPH / Inti" },
        { value: "koordinator", label: "PJ Divisi" },
      ],
    },
    { kind: "textarea", name: "deskripsi", label: "Deskripsi", rows: 2 },
    { kind: "text", name: "inisial", label: "Inisial", hint: "mis. MI" },
    { kind: "color", name: "gradien", label: "Warna avatar" },
    { kind: "number", name: "sort", label: "Urutan" },
    { kind: "bool", name: "published", label: "Terbitkan" },
  ],
};

export const prokerConfig: ResourceConfig = {
  table: "proker",
  noun: "Program Kerja",
  titleKey: "judul",
  subtitleKey: "kategori",
  createLabel: "Tambah program",
  fields: [
    { kind: "text", name: "judul", label: "Judul", required: true },
    { kind: "text", name: "kategori", label: "Kategori" },
    { kind: "text", name: "divisi_slug", label: "Slug divisi", hint: "web / uiux / robotics" },
    { kind: "text", name: "tahun", label: "Tahun" },
    { kind: "textarea", name: "deskripsi", label: "Deskripsi", rows: 3 },
    { kind: "text", name: "dana", label: "Dana" },
    { kind: "color", name: "warna", label: "Warna kartu" },
    { kind: "number", name: "sort", label: "Urutan" },
    { kind: "bool", name: "published", label: "Terbitkan" },
  ],
};

export const galeriConfig: ResourceConfig = {
  table: "galeri",
  noun: "Foto",
  titleKey: "judul",
  subtitleKey: "keterangan",
  createLabel: "Tambah foto",
  fields: [
    { kind: "image", name: "image_url", label: "Gambar", folder: "galeri" },
    { kind: "text", name: "judul", label: "Judul" },
    { kind: "textarea", name: "keterangan", label: "Keterangan", rows: 2 },
    {
      kind: "select",
      name: "span",
      label: "Ukuran",
      placeholder: "Normal",
      options: [
        { value: "wide", label: "Lebar (2 kolom)" },
        { value: "tall", label: "Tinggi (2 baris)" },
      ],
    },
    { kind: "number", name: "sort", label: "Urutan" },
    { kind: "bool", name: "published", label: "Terbitkan" },
  ],
};

export const faqConfig: ResourceConfig = {
  table: "faq",
  noun: "FAQ",
  titleKey: "pertanyaan",
  createLabel: "Tambah FAQ",
  fields: [
    { kind: "text", name: "pertanyaan", label: "Pertanyaan", required: true },
    { kind: "textarea", name: "jawaban", label: "Jawaban", rows: 4 },
    { kind: "number", name: "sort", label: "Urutan" },
    { kind: "bool", name: "published", label: "Terbitkan" },
  ],
};

/** Kurikulum + mentor are edited from the divisi detail page. */
export const kurikulumConfig: ResourceConfig = {
  table: "kurikulum",
  noun: "Tahap Kurikulum",
  titleKey: "judul",
  subtitleKey: "durasi",
  createLabel: "Tambah tahap",
  fields: [
    { kind: "hidden", name: "divisi_id" },
    { kind: "text", name: "nomor", label: "Nomor tahap", hint: "mis. 01" },
    { kind: "text", name: "judul", label: "Judul", required: true },
    { kind: "text", name: "durasi", label: "Durasi", hint: "mis. 4 pertemuan" },
    { kind: "textarea", name: "deskripsi", label: "Deskripsi", rows: 3 },
    { kind: "number", name: "sort", label: "Urutan" },
  ],
};

export const mentorConfig: ResourceConfig = {
  table: "mentor",
  noun: "Mentor",
  titleKey: "nama",
  subtitleKey: "fokus",
  createLabel: "Tambah mentor",
  fields: [
    { kind: "hidden", name: "divisi_id" },
    { kind: "text", name: "nama", label: "Nama", required: true },
    { kind: "text", name: "fokus", label: "Fokus", hint: "mis. PJ Web Development" },
    { kind: "number", name: "sort", label: "Urutan" },
  ],
};
