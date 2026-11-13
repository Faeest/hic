-- ---------------------------------------------------------------------------
-- 0004 — site_settings: multiple testimonials
--
-- The single `testimoni_nama/teks/peran` triple becomes an ordered array so the
-- homepage can show one quote or several. The legacy columns are kept (and
-- backfilled into the array) so a rollback to the previous build still renders;
-- nothing reads them once this ships.
-- ---------------------------------------------------------------------------

alter table public.site_settings
  add column if not exists testimoni_items jsonb not null default '[]'::jsonb;

-- Backfill the existing single quote, only when the array is still empty.
update public.site_settings
   set testimoni_items = jsonb_build_array(
         jsonb_build_object(
           'teks',  coalesce(testimoni_teks, ''),
           'nama',  coalesce(testimoni_nama, ''),
           'peran', coalesce(testimoni_peran, '')
         )
       )
 where testimoni_items = '[]'::jsonb
   and coalesce(testimoni_teks, '') <> '';
