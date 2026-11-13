-- ---------------------------------------------------------------------------
-- 0005 — site_settings: configurable primary CTA
--
-- The "Gabung HIC" button was hardcoded in the navbar, mobile menu and footer.
-- Label + target now come from settings so the next board can point it at a
-- registration form instead of the #gabung section.
-- ---------------------------------------------------------------------------

alter table public.site_settings
  add column if not exists cta_label text not null default 'Gabung HIC';

alter table public.site_settings
  add column if not exists cta_href  text not null default '/#gabung';
