-- ---------------------------------------------------------------------------
-- 0011 — soft-delete kepengurusan
--
-- Deleting a board used to cascade its pengurus and groups permanently. A
-- misclick after activating the new board destroyed the archive. Boards are now
-- hidden (`deleted_at`) instead of removed; the rows stay recoverable.
--
-- Hard deletes remain available to the service role / SQL for real cleanup.
-- ---------------------------------------------------------------------------

alter table public.kepengurusan
  add column if not exists deleted_at timestamptz;

create index if not exists kepengurusan_live_idx
  on public.kepengurusan (sort) where deleted_at is null;

-- Anon must not see a hidden board even if it is still flagged aktif.
drop policy if exists "anon read active" on public.kepengurusan;
create policy "anon read active" on public.kepengurusan
  for select to anon using (aktif = true and deleted_at is null);

-- Activation must reject hidden boards.
create or replace function public.activate_kepengurusan(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  if not exists (
    select 1 from public.kepengurusan
     where id = p_id and deleted_at is null
  ) then
    raise exception 'kepengurusan % tidak ditemukan', p_id;
  end if;

  update public.kepengurusan set aktif = false where aktif and id <> p_id;
  update public.kepengurusan set aktif = true  where id = p_id;

  update public.site_settings
     set periode_kepengurusan = (select periode from public.kepengurusan where id = p_id)
   where id = 1;
end;
$$;

revoke all on function public.activate_kepengurusan(uuid) from public, anon;
grant execute on function public.activate_kepengurusan(uuid) to authenticated;
