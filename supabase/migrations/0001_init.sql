-- ============================================================================
-- HIC CMS — initial schema
-- Project: HIC (Hardware Interactive Club)
-- Idempotent: safe to re-run. Non-destructive (no DROP TABLE).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- site_settings — singleton row (id = 1) for site-wide copy
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id                integer primary key default 1 check (id = 1),
  nama              text    not null default 'HIC',
  nama_panjang      text    not null default '',
  nama_lengkap      text    not null default '',
  tagline           text    not null default '',
  visi              jsonb   not null default '[]'::jsonb,
  pilar_misi        jsonb   not null default '[]'::jsonb,
  statistik         jsonb   not null default '[]'::jsonb,
  sosial            jsonb   not null default '[]'::jsonb,
  kontak_email      text    not null default '',
  kontak_instagram  text    not null default '',
  kontak_lokasi     text    not null default '',
  hero_headline     jsonb   not null default '[]'::jsonb,
  hero_subcopy      text    not null default '',
  tentang_intro     text    not null default '',
  tentang_tags      jsonb   not null default '[]'::jsonb,
  logo_light_url    text    not null default '',
  logo_dark_url     text    not null default '',
  testimoni_nama    text    not null default '',
  testimoni_teks    text    not null default '',
  testimoni_peran   text    not null default '',
  marquee_items     jsonb   not null default '[]'::jsonb,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sections — editable/hideable section headers
-- NOTE: column is `kicker` (the Roman numeral), not `index` (SQL reserved word).
-- ---------------------------------------------------------------------------
create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  kicker     text not null default '',
  label      text not null default '',
  title      text not null default '',
  accent     text not null default '',
  sort       integer not null default 0,
  visible    boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- divisi + kurikulum + mentor
-- ---------------------------------------------------------------------------
create table if not exists public.divisi (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  nama         text not null,
  nama_panjang text not null default '',
  angka        text not null default '',
  tagline      text not null default '',
  deskripsi    text not null default '',
  akronim      text not null default '',
  warna        jsonb not null default '{}'::jsonb,
  sort         integer not null default 0,
  published    boolean not null default true,
  updated_at   timestamptz not null default now()
);

create table if not exists public.kurikulum (
  id         uuid primary key default gen_random_uuid(),
  divisi_id  uuid not null references public.divisi(id) on delete cascade,
  nomor      text not null default '',
  judul      text not null default '',
  durasi     text not null default '',
  deskripsi  text not null default '',
  sort       integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists kurikulum_divisi_id_idx on public.kurikulum(divisi_id);

create table if not exists public.mentor (
  id         uuid primary key default gen_random_uuid(),
  divisi_id  uuid not null references public.divisi(id) on delete cascade,
  nama       text not null default '',
  fokus      text not null default '',
  sort       integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists mentor_divisi_id_idx on public.mentor(divisi_id);

-- ---------------------------------------------------------------------------
-- pengurus (kategori replaces the 3 separate TS exports)
-- ---------------------------------------------------------------------------
create table if not exists public.pengurus (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  jabatan    text not null default '',
  deskripsi  text not null default '',
  inisial    text not null default '',
  gradien    text not null default '',
  kategori   text not null default 'inti'
             check (kategori in ('pembina', 'inti', 'koordinator')),
  sort       integer not null default 0,
  published  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- proker
-- ---------------------------------------------------------------------------
create table if not exists public.proker (
  id          uuid primary key default gen_random_uuid(),
  judul       text not null,
  kategori    text not null default '',
  divisi_slug text not null default '',
  tahun       text not null default '',
  deskripsi   text not null default '',
  dana        text not null default '',
  warna       text not null default '',
  sort        integer not null default 0,
  published   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- galeri
-- ---------------------------------------------------------------------------
create table if not exists public.galeri (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null default '',
  judul      text not null default '',
  keterangan text not null default '',
  span       text check (span is null or span in ('wide', 'tall')),
  sort       integer not null default 0,
  published  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- faq
-- ---------------------------------------------------------------------------
create table if not exists public.faq (
  id         uuid primary key default gen_random_uuid(),
  pertanyaan text not null,
  jawaban    text not null default '',
  sort       integer not null default 0,
  published  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- posts (blog)
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  cover_url    text not null default '',
  body_md      text not null default '',
  tags         jsonb not null default '[]'::jsonb,
  published    boolean not null default false,
  published_at timestamptz default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists posts_published_idx on public.posts(published, published_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_sections_updated on public.sections;
create trigger trg_sections_updated before update on public.sections
  for each row execute function public.set_updated_at();

drop trigger if exists trg_divisi_updated on public.divisi;
create trigger trg_divisi_updated before update on public.divisi
  for each row execute function public.set_updated_at();

drop trigger if exists trg_kurikulum_updated on public.kurikulum;
create trigger trg_kurikulum_updated before update on public.kurikulum
  for each row execute function public.set_updated_at();

drop trigger if exists trg_mentor_updated on public.mentor;
create trigger trg_mentor_updated before update on public.mentor
  for each row execute function public.set_updated_at();

drop trigger if exists trg_pengurus_updated on public.pengurus;
create trigger trg_pengurus_updated before update on public.pengurus
  for each row execute function public.set_updated_at();

drop trigger if exists trg_proker_updated on public.proker;
create trigger trg_proker_updated before update on public.proker
  for each row execute function public.set_updated_at();

drop trigger if exists trg_galeri_updated on public.galeri;
create trigger trg_galeri_updated before update on public.galeri
  for each row execute function public.set_updated_at();

drop trigger if exists trg_faq_updated on public.faq;
create trigger trg_faq_updated before update on public.faq
  for each row execute function public.set_updated_at();

drop trigger if exists trg_posts_updated on public.posts;
create trigger trg_posts_updated before update on public.posts
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
--   anon          -> read published content only
--   authenticated -> read everything + full write
-- ============================================================================
alter table public.site_settings enable row level security;
alter table public.sections      enable row level security;
alter table public.divisi        enable row level security;
alter table public.kurikulum     enable row level security;
alter table public.mentor        enable row level security;
alter table public.pengurus      enable row level security;
alter table public.proker        enable row level security;
alter table public.galeri        enable row level security;
alter table public.faq           enable row level security;
alter table public.posts         enable row level security;

-- ---- read-everything tables (site_settings, sections) ----
drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "public read" on public.sections;
create policy "public read" on public.sections
  for select to anon, authenticated using (true);

-- ---- published-gated tables ----
do $$
declare t text;
begin
  foreach t in array array['divisi','kurikulum','mentor','pengurus','proker','galeri','faq','posts']
  loop
    execute format('drop policy if exists "anon read published" on public.%I', t);
    execute format('drop policy if exists "auth read all" on public.%I', t);
    execute format('drop policy if exists "auth write" on public.%I', t);
  end loop;
end $$;

create policy "anon read published" on public.divisi
  for select to anon using (published = true);
create policy "auth read all" on public.divisi
  for select to authenticated using (true);
create policy "auth write" on public.divisi
  for all to authenticated using (true) with check (true);

create policy "anon read published" on public.pengurus
  for select to anon using (published = true);
create policy "auth read all" on public.pengurus
  for select to authenticated using (true);
create policy "auth write" on public.pengurus
  for all to authenticated using (true) with check (true);

create policy "anon read published" on public.proker
  for select to anon using (published = true);
create policy "auth read all" on public.proker
  for select to authenticated using (true);
create policy "auth write" on public.proker
  for all to authenticated using (true) with check (true);

create policy "anon read published" on public.galeri
  for select to anon using (published = true);
create policy "auth read all" on public.galeri
  for select to authenticated using (true);
create policy "auth write" on public.galeri
  for all to authenticated using (true) with check (true);

create policy "anon read published" on public.faq
  for select to anon using (published = true);
create policy "auth read all" on public.faq
  for select to authenticated using (true);
create policy "auth write" on public.faq
  for all to authenticated using (true) with check (true);

create policy "anon read published" on public.posts
  for select to anon using (published = true);
create policy "auth read all" on public.posts
  for select to authenticated using (true);
create policy "auth write" on public.posts
  for all to authenticated using (true) with check (true);

-- kurikulum + mentor are child rows: readable with parent, writable by admin
create policy "anon read published" on public.kurikulum
  for select to anon using (
    exists (select 1 from public.divisi d where d.id = kurikulum.divisi_id and d.published = true)
  );
create policy "auth read all" on public.kurikulum
  for select to authenticated using (true);
create policy "auth write" on public.kurikulum
  for all to authenticated using (true) with check (true);

create policy "anon read published" on public.mentor
  for select to anon using (
    exists (select 1 from public.divisi d where d.id = mentor.divisi_id and d.published = true)
  );
create policy "auth read all" on public.mentor
  for select to authenticated using (true);
create policy "auth write" on public.mentor
  for all to authenticated using (true) with check (true);

-- ---- write policies for the read-everything tables ----
drop policy if exists "auth write" on public.site_settings;
create policy "auth write" on public.site_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "auth write" on public.sections;
create policy "auth write" on public.sections
  for all to authenticated using (true) with check (true);

-- ============================================================================
-- Storage: public `media` bucket
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml','image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media auth write" on storage.objects;
create policy "media auth write" on storage.objects
  for all to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');
