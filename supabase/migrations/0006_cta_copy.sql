-- ---------------------------------------------------------------------------
-- 0006 — configurable copy for the CTA surfaces
--
-- Anything a new board would reasonably want to reword without a deploy:
-- the hero buttons, the whole "gabung" section (VI) down to both button links,
-- and the footer's closing lines.
--
-- Empty `*_href` means "fall back to mailto:konsumen email" for the gabung
-- buttons, so changing the contact email keeps them working.
-- ---------------------------------------------------------------------------

alter table public.site_settings
  add column if not exists hero_cta_primary_label   text not null default 'Jelajahi Divisi',
  add column if not exists hero_cta_primary_href    text not null default '/#divisi',
  add column if not exists hero_cta_secondary_label text not null default 'Tentang HIC',
  add column if not exists hero_cta_secondary_href  text not null default '/#tentang';

alter table public.site_settings
  add column if not exists gabung_body text not null default
    'Tidak perlu jadi jagoan lebih dulu — di HIC semua orang sedang belajar. Datanglah ke sekret, ikut kelas perdana, dan lihat sendiri dari dekat.',
  add column if not exists gabung_primary_label   text not null default 'Hubungi kami',
  add column if not exists gabung_primary_href    text not null default '',
  add column if not exists gabung_secondary_label text not null default 'Kirim formulir minat',
  add column if not exists gabung_secondary_href  text not null default '';

alter table public.site_settings
  add column if not exists footer_eyebrow text not null default 'Punya prinsip belajar yang sama?',
  add column if not exists footer_title   text not null default 'Mari tumbuh bareng di HIC.';

-- The gabung section was stored with kicker VI, duplicating FAQ.
update public.sections set kicker = 'VII' where key = 'gabung' and kicker = 'VI';
