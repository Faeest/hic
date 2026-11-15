# Operations — HIC

Everything a new committee needs that is not obvious from the admin panel.

## Admin access

- Only users listed in `public.admin_users` can read unpublished rows or write
  anything. A Supabase account alone is not enough.
- `/admin/users` (nav: **Admin**) adds or removes admins.
  - Existing account → allowlisted immediately.
  - New email → Supabase sends an invite; the link lands on `/admin/reset` to
    set a password.
- `/admin/forgot` sends a password-reset link. No developer needed.
- **Disable public signup** in Supabase → Authentication → Providers → Email
  (`Allow new users to sign up` = off). The allowlist already blocks strangers,
  but signup should stay closed.
- **Auth URL configuration** (Supabase → Authentication → URL Configuration):
  - Site URL: `https://hic.ubhinus.ac.id`
  - Redirect URLs: `https://hic.ubhinus.ac.id/**` and `http://localhost:3000/**`
  Without this, invite and reset e-mails fall back to the Site URL and can point
  at `localhost`. `NEXT_PUBLIC_SITE_URL` in Vercel is the app-side half of the
  same setting.
- Removing an admin only removes the allowlist row; the auth account remains.

## Backups

Supabase's free plan has no automated database backups. Two layers:

1. **GitHub Actions `Backup`** (`.github/workflows/backup.yml`) runs daily at
   03:40 UTC and on demand. It dumps every content table to JSON and downloads
   the whole `media` bucket, then uploads the bundle as a workflow artifact
   kept **90 days**.
   - Secrets: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`.
   - Run manually: Actions → Backup → Run workflow.
2. **Local run** (same script):
   ```bash
   node --env-file=.env.local scripts/backup-data.mjs backups/$(date +%F)
   ```

### Restore

1. Create a fresh Supabase project.
2. Run `supabase/migrations/*.sql` in numeric order.
3. Upload `media/<key>` back into the `media` bucket (keep the same keys).
4. Insert `tables/<table>.json` with the service role, parents first:
   `site_settings`, `sections`, `divisi`, `kurikulum`, `mentor`,
   `kepengurusan`, `pengurus_grup`, `pengurus`, `proker`, `galeri`, `faq`,
   `posts`, `admin_users`.
5. Re-add the admin user to `admin_users` (or sign in and use `/admin/users`).
6. Update `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` /
   `SUPABASE_SECRET_KEY` in Vercel and redeploy.

## Yearly handover

1. `/admin/kepengurusan` → **Duplikat** last year's board (copies groups and
   remaps every member).
2. Edit pengurus, groups (`/admin/pengurus/kategori`), divisi, proker, gallery,
   FAQ, blog.
3. **Aktifkan** the new board. The old one stays as an archive.
4. `/admin/users` → add the new officers, remove the ones who left.
5. Old boards are **hidden**, not deleted: the trash button asks you to type the
   board name and sets `deleted_at`. Rows stay in the database. To restore one,
   clear `deleted_at` in SQL (service role).
6. Interface copy (mentor/kurikulum headings, divisi CTA, blog title, nav and
   footer labels) is edited in `/admin/site` → **Teks antarmuka**.

## Deploy

Push to `master` on `Faeest/hic`; Vercel builds and promotes automatically.
`deploy.sh` and the VPS are legacy and currently unreachable.

## Content cache

Public pages are cached with `cacheLife("max")` (30 days) and invalidated by
every admin write. Editing rows directly in the Supabase table editor does **not**
invalidate the cache — use the admin panel, or redeploy.
