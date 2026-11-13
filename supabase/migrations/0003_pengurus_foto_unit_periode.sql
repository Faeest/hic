-- ---------------------------------------------------------------------------
-- 0003 — pengurus: portrait, unit link, and period scoping
--
-- `foto`    real portrait URL (Supabase Storage `media` bucket or a /public path).
--           Empty string keeps the typographic-initial fallback.
-- `unit`    link key. For PJ divisi it mirrors `divisi.slug` (web / uiux /
--           robotics) so a divisi page can pull its own coordinator. For biro
--           rows it is a free label (humas / pdd / webdev / …).
-- `periode` kepengurusan period, e.g. '2025/2026'. Empty = always shown, which
--           is what every pre-existing row gets.
--
-- The org chart is data, not code: next year adds rows and deletes the old
-- ones, no deploy. That is why `kategori` gains 'biro' (the working bodies that
-- are not BPH and not divisions) and why nothing is hardcoded in the UI.
-- ---------------------------------------------------------------------------

alter table public.pengurus
  add column if not exists foto    text not null default '';

alter table public.pengurus
  add column if not exists unit    text not null default '';

alter table public.pengurus
  add column if not exists periode text not null default '';

-- Broaden the category check. Drop first: the original constraint was created
-- inline with the table, so its definition cannot be replaced in place.
alter table public.pengurus drop constraint if exists pengurus_kategori_check;

alter table public.pengurus
  add constraint pengurus_kategori_check
  check (kategori in ('pembina', 'inti', 'biro', 'koordinator'));

-- Divisi pages look their coordinator up by unit; the admin lists sort by it.
create index if not exists pengurus_unit_idx on public.pengurus (unit);

-- Backfill the period on rows that belong to the current board, so the homepage
-- keeps showing them once period filtering exists. Existing rows are all from
-- the 2025/2026 board.
update public.pengurus
   set periode = '2025/2026'
 where periode = '';

-- Link the three division coordinators to their divisions by slug.
update public.pengurus set unit = 'web'      where kategori = 'koordinator' and jabatan ilike '%web%';
update public.pengurus set unit = 'uiux'     where kategori = 'koordinator' and jabatan ilike '%ui/ux%';
update public.pengurus set unit = 'robotics' where kategori = 'koordinator' and jabatan ilike '%robotic%';
