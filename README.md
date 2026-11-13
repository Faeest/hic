This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Ops notes

### Image uploads
`ImageField` downscales to a 2000px longest edge and re-encodes to WebP (q=0.82)
in the browser before uploading, so a 4 MB camera JPEG lands in the `media`
bucket at a few hundred KB. SVG and GIF are passed through untouched, and files
under 400 KB are left alone. The server still enforces the 10 MB bucket limit.

### Keeping Supabase awake

Free Supabase projects pause after ~7 days without activity. Three layers, in
order of reliability:

1. **GitHub Actions (primary)** — `.github/workflows/keepalive.yml` runs daily on
   GitHub's infrastructure, so it keeps working when the VPS is down. It needs two
   repository secrets: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Settings → Secrets
   and variables → Actions). Trigger it once from the Actions tab to confirm.
   Note: GitHub disables scheduled workflows after ~60 days without repo activity.
2. **systemd user timer on the VPS (fallback)** — `deploy/keepalive.sh` calls the
   Supabase REST API directly, so it does not depend on the app being up. The box
   has no `crontab` (fish shell, systemd only; `hic.service` is a user unit):

   ```bash
   cp deploy/hic-keepalive.{service,timer} ~/.config/systemd/user/
   systemctl --user daemon-reload
   systemctl --user enable --now hic-keepalive.timer
   systemctl --user list-timers hic-keepalive.timer
   ```

3. **`GET /api/keepalive`** — the in-app endpoint (one trivial query, optional
   `KEEPALIVE_TOKEN`). Useful for uptime checks; the cron layers do not need it.

### Media library

`/admin/media` lists every object in the `media` bucket (one folder level, newest
first) with size, folder and date, plus copy-URL, replace-in-place and permanent
delete. Deleting a file that a row still references leaves a broken image — the
confirm dialog says so.

**Copied URLs use the site's own domain.** The button emits
`https://<site>/media/<bucket-path>`, served by `app/media/[...path]/route.ts`,
which streams the object from the public bucket. This keeps the Supabase project
ref out of shared links. Rows that still hold an absolute
`https://<project>.supabase.co/storage/v1/object/public/media/...` URL keep
working — the bucket is public either way, so this hides the project ref; it does
not add access control.

**Replacing a file keeps its URL.** The ↻ button on a card overwrites the object
in place (`replaceMedia`, `upsert: true`), so every row pointing at that URL
shows the new image without an edit. The replacement must keep the same
extension. Caching is `public, max-age=60, must-revalidate` with the bucket's
`ETag` forwarded, so a swap appears within about a minute and revalidations are
cheap 304s.

Why the minute: Supabase's CDN keeps serving the old bytes for the object's whole
TTL after an overwrite and has no purge API — verified that `cacheControl: "0"`
on the replacement does not help and no request header bypasses it. Only a
different URL gets fresh bytes, so the route fetches upstream with a per-minute
`?v=` bucket. Legacy rows that point straight at Supabase can lag up to the
object's TTL (1 h) after a replace.

**Where uploads land.** Every upload goes to a folder in the `media` bucket, and
`/admin/media` lists the root plus one folder level, so all of them show up:

| Field | folder |
| --- | --- |
| Media library | `media` |
| Site logo / favicon | `logo` |
| Gallery entries | `galeri` |
| Pengurus photos | `pengurus` |
| Blog covers | `posts` |
| other `ImageField`s | `site` |

### One source for content images

The bucket is the single source for content images. `public/` keeps only
build-owned brand assets (logo variants, favicon, OG image) — things an editor
never changes and that must survive a Supabase outage.

The rule: **can an editor change it?** Yes → bucket. No → `public/`.

This was not always true. The five seeded gallery photos used to live in
`public/` and were referenced as `/ditkom_hic_2025.JPG`, which meant two live
URLs for one image and a stale copy whenever one side was replaced.
`scripts/migrate-public-media.mjs` moved them into `site/` in the bucket and
repointed the rows at `/media/site/...`:

```bash
node --env-file=.env.local scripts/migrate-public-media.mjs --dry
node --env-file=.env.local scripts/migrate-public-media.mjs --apply
```

It is idempotent (rows already on `/media/...` are skipped, existing objects are
not re-uploaded) and covers `galeri.image_url`, `pengurus.foto`,
`posts.cover_url`. The originals stay in `public/` as a cold spare and as the
offline fallback for `data/galeri.ts`; nothing references them any more.

**Fallback when Supabase is unreachable.** `app/media/[...path]/route.ts` serves
the repo logo with a 60 s cache instead of a 404 when the upstream errors or the
network fails, so a paused project never leaves the site unbranded. A genuine
missing object still returns 404.

**Backup.** The bucket has no versioning — an in-place replace or a delete is
unrecoverable. `scripts/snapshot-media.mjs` copies every object to disk and keeps
the last 7 days. It runs from `deploy/keepalive.sh` (the daily systemd timer) and
skips cleanly when `SUPABASE_SECRET_KEY` is absent, so it never breaks the
keepalive. Add the secret key to `/home/lerraf/hic.env` to enable it:

```bash
HIC_MEDIA_SNAPSHOT_DIR=/home/lerraf/media-snapshots   # default: ./media-snapshots
HIC_MEDIA_SNAPSHOT_KEEP=7
```

Restore = copy the file back from `<snapshot>/<date>/<bucket-key>`.
