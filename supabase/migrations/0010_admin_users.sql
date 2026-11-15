-- ---------------------------------------------------------------------------
-- 0010 — admin allowlist
--
-- Until now every policy was `to authenticated using (true)`, so any Supabase
-- user could write the whole CMS. Signup was open, which made that a public
-- hole. This migration:
--   1. adds `admin_users` (the allowlist),
--   2. adds `is_admin()` (SECURITY DEFINER, so it can read the allowlist
--      without recursing through RLS),
--   3. rewrites every authenticated read/write policy to require it,
--   4. guards the `activate_kepengurusan` RPC,
--   5. seeds the existing account(s) so the current owner keeps access.
--
-- Signup itself is disabled in Supabase Auth settings (not SQL).
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null default '',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- SECURITY DEFINER: the function owner bypasses RLS, so this does not recurse
-- when it is used inside a policy on `admin_users` itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admins can list the allowlist; everyone else sees only their own row (which
-- is empty for non-admins, so the app can tell them apart).
drop policy if exists "admin read allowlist" on public.admin_users;
create policy "admin read allowlist" on public.admin_users
  for select to authenticated using (public.is_admin() or user_id = auth.uid());

-- No insert/update/delete policy: only the service role manages the allowlist.

-- ---- seed the current owner(s) ---------------------------------------------
insert into public.admin_users (user_id, email)
select id, coalesce(email, '') from auth.users
on conflict (user_id) do nothing;

-- ---- rewrite content policies ----------------------------------------------
-- Read: unpublished rows are admin-only. Write: admin-only.
do $$
declare
  t text;
begin
  foreach t in array array[
    'divisi', 'faq', 'galeri', 'kepengurusan', 'kurikulum', 'mentor',
    'pengurus', 'pengurus_grup', 'posts', 'proker'
  ]
  loop
    execute format('drop policy if exists "auth read all" on public.%I', t);
    execute format(
      'create policy "auth read all" on public.%I for select to authenticated using (public.is_admin())',
      t
    );
    execute format('drop policy if exists "auth write" on public.%I', t);
    execute format(
      'create policy "auth write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end;
$$;

-- pengurus_grup used different policy names.
drop policy if exists "auth read all groups" on public.pengurus_grup;
create policy "auth read all groups" on public.pengurus_grup
  for select to authenticated using (public.is_admin());
drop policy if exists "auth write groups" on public.pengurus_grup;
create policy "auth write groups" on public.pengurus_grup
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- sections / site_settings have no "auth read all" (public read covers it).
drop policy if exists "auth write" on public.sections;
create policy "auth write" on public.sections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "auth write" on public.site_settings;
create policy "auth write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- storage ----------------------------------------------------------------
drop policy if exists "media auth write" on storage.objects;
create policy "media auth write" on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- ---- RPC guard --------------------------------------------------------------
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

  if not exists (select 1 from public.kepengurusan where id = p_id) then
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
