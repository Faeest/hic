// Canonical content types. Every shape that appears in content/*.json lives here.
// Components and loaders import from this file so the JSON stays validated in one place.

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

export type Logo = {
  light: string;
  dark: string;
};

export type NavLink = {
  href: string;
  label: string;
  id: string;
};

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterCopy = {
  ctaEyebrow: string;
  ctaTitle: string;
  ctaLabel: string;
  navigasiTitle: string;
  kontakTitle: string;
  sosialTitle: string;
  nav: FooterLink[];
  note: string;
};

export type Seo = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  locale: string;
};

export type Site = {
  nama: string;
  namaPanjang: string;
  namaLengkap: string;
  tagline: string;
  logo: Logo;
  visi: string[];
  pilarMisi: PilarMisi[];
  statistik: Statistik[];
  kontak: Kontak;
  sosial: Sosial[];
  nav: NavLink[];
  footer: FooterCopy;
  seo: Seo;
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
  warna: {
    utama: string;
    terang: string;
    latar: string;
    latarDark: string;
    border: string;
    borderDark: string;
  };
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

export type PengurusContent = {
  pembina: Pengurus;
  inti: Pengurus[];
  koordinator: Pengurus[];
  periode: string;
  pjLabel: string;
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
};

export type FaqItem = {
  pertanyaan: string;
  jawaban: string;
};

export type Cta = {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  caption: string;
};

// ---- Homepage blocks (reorderable / addable / removable via the CMS) ----

export type HeroBlock = {
  type: "hero";
  id: string;
  headline: string[];
  subcopy: string;
  subcopyHighlight?: string;
  ctas: Cta[];
};

export type MarqueeBlock = {
  type: "marquee";
  words: string[];
  speed?: number;
};

export type TentangBlock = {
  type: "tentang";
  id: string;
  index?: string;
  label: string;
  title: string;
  accent?: string;
  tags: string[];
  paragraphs: string[];
  visiTitle: string;
  pilarTitle: string;
  pilarSubtitle: string;
};

export type DivisiIndexBlock = {
  type: "divisiIndex";
  id: string;
  index?: string;
  label: string;
  title: string;
  accent?: string;
};

export type PengurusBlock = {
  type: "pengurus";
  id: string;
  index?: string;
  label: string;
  title: string;
  accent?: string;
};

export type ProkerBlock = {
  type: "proker";
  id: string;
  index?: string;
  label: string;
  title: string;
  accent?: string;
  linkLabel: string;
  linkHref: string;
};

export type GaleriBlock = {
  type: "galeri";
  id: string;
  index?: string;
  label: string;
  title: string;
  accent?: string;
  noteSuffix: string;
};

export type FaqBlock = {
  type: "faq";
  id: string;
  index?: string;
  label: string;
  title: string;
  accent?: string;
};

export type GabungBlock = {
  type: "gabung";
  id: string;
  index?: string;
  label: string;
  title: string;
  body: string;
  ctas: Cta[];
  marqueeWords: string[];
  marqueeSpeed?: number;
  testimonial: Testimonial;
};

export type Block =
  | HeroBlock
  | MarqueeBlock
  | TentangBlock
  | DivisiIndexBlock
  | PengurusBlock
  | ProkerBlock
  | GaleriBlock
  | FaqBlock
  | GabungBlock;

export type HomeContent = {
  blocks: Block[];
};
