-- ---------------------------------------------------------------------------
-- 0014 — posts: cover focal point
--
-- A cover is rendered at 16/10 in the blog index and 16/9 on the article page.
-- `object-cover` centres the crop, so a face or logo near an edge gets cut.
-- `cover_crop` records where the editor pointed the frame instead:
--
--   { "x": 50, "y": 50, "zoom": 1 }
--
-- Same shape and semantics as `pengurus.foto_crop` (see 0013): `x`/`y` are
-- percentages for CSS `object-position`, `zoom` scales about that point. The
-- default reproduces the old centred crop, so existing posts are unchanged.
--
-- Expand-only: nothing is dropped and a build that predates this column simply
-- ignores it.
-- ---------------------------------------------------------------------------

alter table public.posts
  add column if not exists cover_crop jsonb not null
  default '{"x": 50, "y": 50, "zoom": 1}'::jsonb;
