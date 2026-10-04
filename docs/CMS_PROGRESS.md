# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: ALL PHASES COMPLETE ✅ — live at https://hic.faeest.my.id

### ✅ Phase 8 done (Cache Components)
- `next.config.ts`: `cacheComponents: true` (PPR enabled).
- `lib/cache/tags.ts`: shared `CONTENT_TAGS` for on-demand invalidation.
- All public readers (`lib/content/*`) use `'use cache'` + `cacheTag` +
  `cacheLife("max")` — content is cached long-term, invalidated on edit.
- `lib/actions/revalidate.ts`: `revalidatePublic()` now calls `updateTag`
  (immediate, Server-Action-only API) per tag + `revalidatePath` per route.
  All mutation actions (`site`, `crud`, `posts`) centralized on it.
- `app/admin/(protected)/layout.tsx`: `instant = false` opt-out — admin pages
  read session cookies, so they stay dynamic; the public site keeps full PPR.
- Fixed a real prerender bug Cache Components caught: `new Date()` in
  `Footer.tsx` (Client Component) → new `components/layout/Copyright.tsx`
  streams the year at request time behind `<Suspense>`.

### ✅ Phase 8 verification
- `tsc` + `eslint` clean. `npm run build` EXIT 0 with `- Cache Components enabled`.
- Route table: `/` static (`30d`/`1y`), `/divisi/*` + `/blog/*` static via
  generateStaticParams, `[slug]` routes show `◐` Partial Prerender, `/admin/*`
  dynamic.
- **Cache round-trip proven**: edited tagline in DB → page stayed stale →
  triggered revalidation → page refreshed. (`updateTag` in real Server Actions
  behaves the same, only immediate.)

### ✅ Docs
- `docs/SUBDOMAIN.md`: handover text for campus IT — subdomain via A record
  (recommended) vs separate deploy from the GitHub repo.

### ✅ Phase 7 done (DEPLOYED)
- `/home/lerraf/hic.env` on VPS (mode 600, outside app dir): holds the two
  public Supabase vars. The **secret key never touches the server** — nothing
  at runtime imports the service-role client (seed-only).
- `deploy/hic.service`: systemd unit with `EnvironmentFile=/home/lerraf/hic.env`.
  Installed on the server (old unit backed up as
  `hic.service.bak-20261004`); `daemon-reload` done.
- `deploy.sh`: checks the server env file first; copies it to `.env.local`
  for the Supabase-backed build; EXIT-trap **rollback** restores `APP.old`
  and restarts the service on any failure.
- Staged verification BEFORE touching prod: built + ran the release in
  `/tmp/hic-stage` on the VPS (Node v26) — identical route table, auth gate
  307, DB content present — then cleaned up (incl. a `pkill -f` self-match
  lesson: always use the `[3]199` bracket trick).
- **Production deploy: `DEPLOY_EXIT:0`** — 22/22 static pages built on the
  server from Supabase; health check 200; cleanup complete.

### ✅ Live verification (https://hic.faeest.my.id)
- `/` `/blog` `/blog/selamat-datang-di-blog-hic` `/divisi/robotics` → 200
- `/admin` → 307 (gate works through the public URL)
- All DB content present (tagline, tags, proker, est. 1996, kursi title,
  pengurus); `2018` absent.
- `hic.service` active; no `hic.old` / `hic.failed` leftovers.

### ⚠️ Remaining follow-ups (not code)
- Change the admin password (`12345678` is weak) — do in Supabase Auth.
- **Rotate `SUPABASE_SECRET_KEY`** (shared in plain chat).
- Consider bumping `next@16.3.5` → `16.3.8` (critical RCE advisory).
- Point the campus subdomain at the VPS when ready (A record → 103.169.186.163).

### Phase map
0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ · 5 ✅ · 6 ✅ · 7 ✅ · 8(opt)







### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
