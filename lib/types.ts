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

/**
 * Where a portrait sits inside its frame. `x`/`y` are percentages for CSS
 * `object-position` (0 = left/top edge, 100 = right/bottom edge); `zoom`
 * scales the image about that point (1 = the full cover crop).
 */
export type FotoCrop = {
  x: number;
  y: number;
  zoom: number;
};

export type Pengurus = {
  nama: string;
  jabatan: string;
  deskripsi: string;
  inisial: string;
  gradien: string;
  /** Real portrait, when we have one. Missing → typographic treatment. */
  foto?: string;
  /** Crop applied to `foto` in every frame it appears in. */
  fotoCrop?: FotoCrop;
  /** Link key: divisi slug for a PJ, free label for a biro. */
  unit?: string;
  /** NRP / student id. Empty for the dosen pembina and external PJs. */
  nrp?: string;
  /** Board period, inherited from the active kepengurusan. Display only. */
  periode?: string;
};

/** Legacy bucket column. New code groups by `grup_id`; kept for old builds. */
export type KategoriPengurus = "pembina" | "inti" | "biro" | "koordinator";

/**
 * A group inside one kepengurusan board. `pembina` and `inti` are reserved
 * slugs seeded for every board; the rest are admin-defined.
 */
export type PengurusGrup = {
  slug: string;
  label: string;
  deskripsi: string;
  sort: number;
};

/**
 * A kepengurusan board — the "loadout". Exactly one row is `aktif`; that is the
 * board the public site renders. `pengurus` rows belong to one board.
 */
export type Kepengurusan = {
  id: string;
  nama: string;
  periode: string;
  aktif: boolean;
  catatan: string;
  sort: number;
};

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
  /** Ordered photos of this moment. `src` is the cover (= images[0]). */
  images?: string[];
};

export type FaqItem = {
  pertanyaan: string;
  jawaban: string;
};

/** One object in the public `media` bucket. */
export type MediaItem = {
  /** Bucket-relative path, e.g. `galeri/ditkom-2025.webp`. */
  path: string;
  url: string;
  name: string;
  folder: string;
  size: number;
  updatedAt: string | null;
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
export type SiteCopy = {
  mentorHeading: string;
  kurikulumHeading: string;
  prokerHeading: string;
  pjNote: string;
  gabungBody: string;
  blogH1: string;
  blogLabel: string;
  navLinks: { label: string; href: string }[];
  footerNav: { label: string; href: string }[];
};

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
  cta: { label: string; href: string };
  ctaHero: {
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  ctaGabung: {
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  footerCopy: { eyebrow: string; title: string };
  testimoni: Testimoni[];
  marqueeItems: string[];
  tahunBerdiri: string;
  periodeKepengurusan: string;
  copy: SiteCopy;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  /** Crop applied to `coverUrl` in the index and article frames. */
  coverCrop?: FotoCrop;
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
  cta_label: string;
  cta_href: string;
  hero_cta_primary_label: string;
  hero_cta_primary_href: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_href: string;
  gabung_body: string;
  gabung_primary_label: string;
  gabung_primary_href: string;
  gabung_secondary_label: string;
  gabung_secondary_href: string;
  footer_eyebrow: string;
  footer_title: string;
  testimoni_items: Testimoni[];
  /** Legacy single-quote columns — superseded by `testimoni_items`. */
  testimoni_nama: string;
  testimoni_teks: string;
  testimoni_peran: string;
  marquee_items: string[];
  tahun_berdiri: string;
  periode_kepengurusan: string;
  copy?: SiteCopy | null;
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
  nrp: string;
  foto?: string | null;
  /** JSONB crop: x, y, zoom. */
  foto_crop?: FotoCrop | null;
  unit?: string | null;
  kepengurusan_id: string;
  /** Group this person belongs to. Null only for rows written by an old build. */
  grup_id?: string | null;
  /** @deprecated superseded by `grup_id`; kept for the rollout window. */
  kategori: KategoriPengurus;
  sort: number;
  published: boolean;
};

export type PengurusGrupRow = PengurusGrup & {
  id: string;
  kepengurusan_id: string;
  updated_at: string;
};

/** Allowlist row: only these Supabase users may write the CMS. */
export type AdminUserRow = {
  user_id: string;
  email: string;
  created_at: string;
};

export type KepengurusanRow = Kepengurusan & {
  updated_at: string;
  /** Set when the board is hidden; rows are kept for recovery. */
  deleted_at?: string | null;
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
  images: string[];
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
  /** JSONB crop: x, y, zoom. */
  cover_crop?: FotoCrop | null;
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
      pengurus_grup: Table<PengurusGrupRow>;
      admin_users: Table<AdminUserRow>;
      kepengurusan: Table<KepengurusanRow>;
      proker: Table<ProkerRow>;
      galeri: Table<GaleriRow>;
      faq: Table<FaqRow>;
      posts: Table<PostRow>;
    };
    Views: Record<string, never>;
    Functions: {
      activate_kepengurusan: {
        Args: { p_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
