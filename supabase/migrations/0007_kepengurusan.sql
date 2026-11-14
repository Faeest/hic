-- ---------------------------------------------------------------------------
-- 0007 — kepengurusan (the "loadout" model) + pengurus.nrp
--
-- A board is now a row in `kepengurusan`, not a free-text `periode` repeated on
-- every pengurus row. `pengurus.kepengurusan_id` points at its board, and
-- exactly one board is `aktif` — that is the one the public site renders.
--
-- `pengurus.periode` is intentionally NOT dropped here. The build that is live
-- while this migration runs still writes it, so dropping it would break admin
-- edits for the length of the deploy. It is deprecated: nothing reads it after
-- this release, and a later migration can drop it.
-- ---------------------------------------------------------------------------

create table if not exists public.kepengurusan (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  periode    text not null,
  aktif      boolean not null default false,
  catatan    text not null default '',
  sort       integer not null default 0,
  updated_at timestamptz not null default now()
);

-- At most one active board. Partial unique index on the boolean itself.
create unique index if not exists kepengurusan_satu_aktif
  on public.kepengurusan ((aktif)) where aktif;

-- ---- backfill: one board per distinct periode already in use ----------------
insert into public.kepengurusan (nama, periode, aktif, sort)
select
  'Kepengurusan ' || p.periode,
  p.periode,
  false,
  row_number() over (order by p.periode)
from (select distinct periode from public.pengurus where periode <> '') p
where not exists (select 1 from public.kepengurusan);

-- Fallback for an empty pengurus table (fresh project).
insert into public.kepengurusan (nama, periode, aktif, sort)
select 'Kepengurusan 2025/2026', '2025/2026', false, 0
where not exists (select 1 from public.kepengurusan);

-- Activate the newest board if none is active yet.
update public.kepengurusan
   set aktif = true
 where id = (select id from public.kepengurusan order by periode desc limit 1)
   and not exists (select 1 from public.kepengurusan where aktif);

-- ---- pengurus -> board ------------------------------------------------------
alter table public.pengurus
  add column if not exists kepengurusan_id uuid
  references public.kepengurusan(id) on delete cascade;

update public.pengurus p
   set kepengurusan_id = k.id
  from public.kepengurusan k
 where k.periode = p.periode
   and p.kepengurusan_id is null;

-- Anything left (empty periode, or a periode with no board) joins the active one.
update public.pengurus
   set kepengurusan_id = (select id from public.kepengurusan where aktif limit 1)
 where kepengurusan_id is null;

alter table public.pengurus alter column kepengurusan_id set not null;

create index if not exists pengurus_kepengurusan_idx
  on public.pengurus (kepengurusan_id);

-- ---- nrp: promote it out of the description text ----------------------------
alter table public.pengurus
  add column if not exists nrp text not null default '';

update public.pengurus
   set nrp = substring(deskripsi from 'NRP[[:space:]]+([0-9]+)')
 where nrp = ''
   and deskripsi ~ 'NRP[[:space:]]+[0-9]+';

update public.pengurus
   set deskripsi = btrim(
     regexp_replace(deskripsi, '[[:space:]]*NRP[[:space:]]+[0-9]+\.?', '', 'g')
   )
 where deskripsi ~ 'NRP[[:space:]]+[0-9]+';

-- ---- updated_at trigger -----------------------------------------------------
drop trigger if exists trg_kepengurusan_updated on public.kepengurusan;
create trigger trg_kepengurusan_updated before update on public.kepengurusan
  for each row execute function public.set_updated_at();

-- ---- RLS --------------------------------------------------------------------
alter table public.kepengurusan enable row level security;

drop policy if exists "anon read active" on public.kepengurusan;
create policy "anon read active" on public.kepengurusan
  for select to anon using (aktif = true);

drop policy if exists "auth read all" on public.kepengurusan;
create policy "auth read all" on public.kepengurusan
  for select to authenticated using (true);

drop policy if exists "auth write" on public.kepengurusan;
create policy "auth write" on public.kepengurusan
  for all to authenticated using (true) with check (true);

-- Only the active board's rows are public. Without this, anon could still read
-- every historical board through the old `published = true` policy.
drop policy if exists "anon read published" on public.pengurus;
create policy "anon read published" on public.pengurus
  for select to anon using (
    published = true
    and exists (
      select 1 from public.kepengurusan k
       where k.id = kepengurusan_id and k.aktif
    )
  );

-- ---- atomic swap ------------------------------------------------------------
-- Supabase JS cannot run a multi-statement transaction, so activation lives in
-- one function. SECURITY DEFINER + explicit grants: anon must not call it.
create or replace function public.activate_kepengurusan(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.kepengurusan where id = p_id) then
    raise exception 'kepengurusan % tidak ditemukan', p_id;
  end if;

  update public.kepengurusan set aktif = false where aktif and id <> p_id;
  update public.kepengurusan set aktif = true  where id = p_id;

  -- Keep the display string in sync so Tentang/Pengurus headers stay correct.
  update public.site_settings
     set periode_kepengurusan = (select periode from public.kepengurusan where id = p_id)
   where id = 1;
end;
$$;

revoke all on function public.activate_kepengurusan(uuid) from public, anon;
grant execute on function public.activate_kepengurusan(uuid) to authenticated;
