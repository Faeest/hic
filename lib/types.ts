/**
 * Canonical types for the HIC CMS.
 *
 * Two layers:
 *  - App types (camelCase): what components consume. These intentionally mirror
 *    the original `data/*.ts` shapes so the Phase 3 refactor is a data-source
 *    swap, not a rewrite.
 *  - Row types (snake_case): the shape Postgres returns.
 *
 * `lib/content/*` maps row -> app.
 */

/* ------------------------------------------------------------------ */
/* App types (consumed by components)                                  */
/* ------------------------------------------------------------------ */

export type Sosial = {
  label: string;
  url: string;
};

export type PilarMisi = {
  nama: string;
  deskripsi: string;
};

export type Statistik = {
  angka: string;
  label: string;
};

export type Kontak = {
  email: string;
  instagram: string;
  lokasi: string;
};

export type WarnaDivisi = {
  utama: string;
  terang: string;
  latar: string;
  latarDark: string;
  border: string;
  borderDark: string;
};

export type KurikulumItem = {
  nomor: string;
  judul: string;
  durasi: string;
  deskripsi: string;
};

export type Mentor = {
  nama: string;
  fokus: string;
};

export type Divisi = {
  slug: string;
  nama: string;
  namaPanjang: string;
  angka: string;
  tagline: string;
  deskripsi: string;
  akronim: string;
  warna: WarnaDivisi;
  kurikulum: KurikulumItem[];
  mentor: Mentor[];
};

export type Pengurus = {
  nama: string;
  jabatan: string;
  deskripsi: string;
  inisial: string;
  gradien: string;
};

export type KategoriPengurus = "pembina" | "inti" | "koordinator";

export type Proker = {
  judul: string;
  kategori: string;
  divisiSlug: string;
  tahun: string;
  deskripsi: string;
  dana: string;
  warna: string;
};

export type Foto = {
  src: string;
  judul: string;
  keterangan: string;
  span?: "wide" | "tall";
};

export type FaqItem = {
  pertanyaan: string;
  jawaban: string;
};

export type Section = {
  key: string;
  index: string;
  label: string;
  title: string;
  accent: string;
  visible: boolean;
};

export type Testimoni = {
  nama: string;
  teks: string;
  peran: string;
};

/** Site-wide identity + copy. Superset of the old `club` object. */
export type Site = {
  nama: string;
  namaPanjang: string;
  namaLengkap: string;
  tagline: string;
  visi: string[];
  pilarMisi: PilarMisi[];
  statistik: Statistik[];
  sosial: Sosial[];
  kontak: Kontak;
  heroHeadline: string[];
  heroSubcopy: string;
  tentangIntro: string;
  tentangTags: string[];
  logoLightUrl: string;
  logoDarkUrl: string;
  testimoni: Testimoni;
  marqueeItems: string[];
  tahunBerdiri: string;
  periodeKepengurusan: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  bodyMd: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/* ------------------------------------------------------------------ */
/* Row types (Postgres / PostgREST snake_case)                         */
/* ------------------------------------------------------------------ */

export type SiteSettingsRow = {
  id: number;
  nama: string;
  nama_panjang: string;
  nama_lengkap: string;
  tagline: string;
  visi: string[];
  pilar_misi: PilarMisi[];
  statistik: Statistik[];
  sosial: Sosial[];
  kontak_email: string;
  kontak_instagram: string;
  kontak_lokasi: string;
  hero_headline: string[];
  hero_subcopy: string;
  tentang_intro: string;
  tentang_tags: string[];
  logo_light_url: string;
  logo_dark_url: string;
  testimoni_nama: string;
  testimoni_teks: string;
  testimoni_peran: string;
  marquee_items: string[];
  tahun_berdiri: string;
  periode_kepengurusan: string;
  updated_at: string;
};

export type SectionRow = {
  id: string;
  key: string;
  kicker: string;
  label: string;
  title: string;
  accent: string;
  sort: number;
  visible: boolean;
  updated_at: string;
};

export type DivisiRow = {
  id: string;
  slug: string;
  nama: string;
  nama_panjang: string;
  angka: string;
  tagline: string;
  deskripsi: string;
  akronim: string;
  warna: Partial<WarnaDivisi>;
  sort: number;
  published: boolean;
  updated_at: string;
};

export type KurikulumRow = {
  id: string;
  divisi_id: string;
  nomor: string;
  judul: string;
  durasi: string;
  deskripsi: string;
  sort: number;
};

export type MentorRow = {
  id: string;
  divisi_id: string;
  nama: string;
  fokus: string;
  sort: number;
};

export type PengurusRow = {
  id: string;
  nama: string;
  jabatan: string;
  deskripsi: string;
  inisial: string;
  gradien: string;
  kategori: KategoriPengurus;
  sort: number;
  published: boolean;
};

export type ProkerRow = {
  id: string;
  judul: string;
  kategori: string;
  divisi_slug: string;
  tahun: string;
  deskripsi: string;
  dana: string;
  warna: string;
  sort: number;
  published: boolean;
};

export type GaleriRow = {
  id: string;
  image_url: string;
  judul: string;
  keterangan: string;
  span: "wide" | "tall" | null;
  sort: number;
  published: boolean;
};

export type FaqRow = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  sort: number;
  published: boolean;
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  body_md: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Minimal but complete Database shape so the typed client resolves table
 * queries correctly. supabase-js requires `Insert`, `Update` and
 * `Relationships` per table — omitting them makes `select()` resolve to
 * `never`.
 */
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      site_settings: Table<SiteSettingsRow>;
      sections: Table<SectionRow>;
      divisi: Table<DivisiRow>;
      kurikulum: Table<KurikulumRow>;
      mentor: Table<MentorRow>;
      pengurus: Table<PengurusRow>;
      proker: Table<ProkerRow>;
      galeri: Table<GaleriRow>;
      faq: Table<FaqRow>;
      posts: Table<PostRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
