-- ---------------------------------------------------------------------------
-- 0009 — pengurus groups ("Orang-orang di balik kursi")
--
-- The section used to be four hardcoded buckets: pembina, inti (BPH), biro and
-- koordinator. Pembina and BPH are structural and always exist; every other
-- bucket is now a row in `pengurus_grup`, scoped to one kepengurusan board.
-- Admins can add, rename, reorder and delete those groups per period.
--
-- Reserved slugs `pembina` and `inti` are seeded for every board and are
-- protected in the app layer (no delete, slug immutable). They are rows — not
-- hardcoded — so the person form has one uniform "Kelompok" picker and the
-- public reader has one code path.
--
-- `pengurus.grup_id` is the real reference. `pengurus.kategori` is kept for the
-- build that is live while this migration runs: a trigger maps legacy writes
-- (kategori = 'biro' / 'koordinator') onto the matching group. Nothing in the
-- new code reads `kategori`; a later migration can drop it.
-- ---------------------------------------------------------------------------

create table if not exists public.pengurus_grup (
  id              uuid primary key default gen_random_uuid(),
  kepengurusan_id uuid not null references public.kepengurusan(id) on delete cascade,
  slug            text not null,
  label           text not null,
  deskripsi       text not null default '',
  sort            integer not null default 0,
  updated_at      timestamptz not null default now(),
  unique (kepengurusan_id, slug)
);

create index if not exists pengurus_grup_board_sort_idx
  on public.pengurus_grup (kepengurusan_id, sort);

-- ---- seed the four groups every board starts with --------------------------
insert into public.pengurus_grup (kepengurusan_id, slug, label, deskripsi, sort)
select k.id, v.slug, v.label, v.deskripsi, v.sort
from public.kepengurusan k
cross join (values
  ('pembina',    'Dosen Pembina',              '',                                                          0),
  ('inti',       'Badan Pengurus Harian',      'Mengurus organisasi: jadwal, kas, dan dokumen.',           10),
  ('biro',       'Biro',                       'Mengurus mesin yang menjalankan kelas dan publikasinya.',  20),
  ('koordinator','Penanggung jawab divisi',    'Diangkat oleh tiap divisi, bukan bagian dari BPH.',        30)
) as v(slug, label, deskripsi, sort)
on conflict (kepengurusan_id, slug) do nothing;

-- ---- pengurus -> group ------------------------------------------------------
-- NO ACTION (the default) rather than RESTRICT: deleting a board cascades both
-- pengurus rows and groups in one statement, and NO ACTION is checked at the
-- end of the statement, after the cascade has removed the referencing rows.
alter table public.pengurus
  add column if not exists grup_id uuid
  references public.pengurus_grup(id) on delete no action;

update public.pengurus p
   set grup_id = g.id
  from public.pengurus_grup g
 where g.kepengurusan_id = p.kepengurusan_id
   and g.slug = p.kategori
   and p.grup_id is null;

create index if not exists pengurus_grup_idx on public.pengurus (grup_id);

-- ---- legacy-write bridge ----------------------------------------------------
-- The previous build inserts/updates `kategori` and knows nothing about
-- `grup_id`. Map it so those rows stay visible for the length of the deploy.
create or replace function public.pengurus_assign_grup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.grup_id is null then
    select id into new.grup_id
      from public.pengurus_grup
     where kepengurusan_id = new.kepengurusan_id
       and slug = new.kategori
     limit 1;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_pengurus_assign_grup on public.pengurus;
create trigger trg_pengurus_assign_grup
  before insert or update of kategori, kepengurusan_id on public.pengurus
  for each row execute function public.pengurus_assign_grup();

-- ---- updated_at trigger -----------------------------------------------------
drop trigger if exists trg_pengurus_grup_updated on public.pengurus_grup;
create trigger trg_pengurus_grup_updated before update on public.pengurus_grup
  for each row execute function public.set_updated_at();

-- ---- RLS --------------------------------------------------------------------
alter table public.pengurus_grup enable row level security;

drop policy if exists "anon read active board groups" on public.pengurus_grup;
create policy "anon read active board groups" on public.pengurus_grup
  for select to anon using (
    exists (
      select 1 from public.kepengurusan k
       where k.id = kepengurusan_id and k.aktif
    )
  );

drop policy if exists "auth read all groups" on public.pengurus_grup;
create policy "auth read all groups" on public.pengurus_grup
  for select to authenticated using (true);

drop policy if exists "auth write groups" on public.pengurus_grup;
create policy "auth write groups" on public.pengurus_grup
  for all to authenticated using (true) with check (true);
