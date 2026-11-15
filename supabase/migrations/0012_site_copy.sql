-- ---------------------------------------------------------------------------
-- 0012 — editable interface copy
--
-- A handful of headings and notes were hardcoded in components (mentor,
-- kurikulum, proker, PJ note, divisi CTA, blog H1, nav/footer labels). They now
-- live in one jsonb column on site_settings, edited from /admin/site and read
-- through getSite(). Missing keys fall back to seedCopy in TypeScript.
-- ---------------------------------------------------------------------------

alter table public.site_settings
  add column if not exists copy jsonb not null default '{}'::jsonb;
