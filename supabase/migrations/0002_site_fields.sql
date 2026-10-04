-- ============================================================================
-- HIC CMS — migration 0002
-- Add editable site-wide fields surfaced in Phase 3:
--   tahun_berdiri         -> "est. 1996" (Footer/Navbar/Tentang)
--   periode_kepengurusan  -> "Periode 2025–2026" (Pengurus section)
-- Idempotent.
-- ============================================================================

alter table public.site_settings
  add column if not exists tahun_berdiri text not null default '1996';

alter table public.site_settings
  add column if not exists periode_kepengurusan text not null default '2025–2026';

-- Backfill the singleton if it already exists.
update public.site_settings
  set tahun_berdiri = coalesce(nullif(tahun_berdiri, ''), '1996'),
      periode_kepengurusan = coalesce(nullif(periode_kepengurusan, ''), '2025–2026')
  where id = 1;
