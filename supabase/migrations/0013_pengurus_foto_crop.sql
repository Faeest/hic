-- ---------------------------------------------------------------------------
-- 0013 — pengurus: portrait focal point
--
-- One portrait file is rendered in three frames: the 4:3 BPH card, the square
-- compact card, and the 56px division coordinator row. `object-cover` centres
-- the crop, so an off-centre face gets cut. `foto_crop` records where the admin
-- pointed the frame instead:
--
--   { "x": 50, "y": 50, "zoom": 1 }
--
-- `x`/`y` are percentages for CSS `object-position` (0 = left/top edge,
-- 100 = right/bottom edge); `zoom` is a scale factor >= 1 applied about that
-- point. The default reproduces the old centred crop, so every existing row
-- renders exactly as before.
--
-- Expand-only: nothing is dropped and a build that predates this column simply
-- ignores it.
-- ---------------------------------------------------------------------------

alter table public.pengurus
  add column if not exists foto_crop jsonb not null
  default '{"x": 50, "y": 50, "zoom": 1}'::jsonb;
