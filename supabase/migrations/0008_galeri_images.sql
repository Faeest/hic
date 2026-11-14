-- ---------------------------------------------------------------------------
-- 0008 — galeri: one moment, many photos
--
-- A gallery row is a moment (DITKOM, Sekret, …) and can now hold several
-- photos. `images` is the ordered list; `image_url` stays as the cover
-- (= images[0]) so the build that is live during this rollout keeps working and
-- every existing row keeps rendering.
--
-- Expand-only: nothing is dropped. A later migration can drop `image_url` once
-- no reader depends on it.
-- ---------------------------------------------------------------------------

alter table public.galeri
  add column if not exists images text[] not null default '{}';

-- Backfill: every existing row becomes a one-photo moment.
update public.galeri
   set images = array[image_url]
 where images = '{}'
   and image_url <> '';

-- Keep the cover column honest for rows that already have a list.
update public.galeri
   set image_url = images[1]
 where images <> '{}'
   and image_url <> images[1];
