# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: Phase 0–2 COMPLETE & VERIFIED. Migration applied. Ready for Phase 3.

### ✅ Done
- **Phase 0** deps: `@supabase/supabase-js`, `@supabase/ssr`, `react-markdown`,
  `remark-gfm`, `tsx` (dev), `server-only`. Env: `.env.local` + `.env.example`.
- **Phase 1**:
  - `supabase/migrations/0001_init.sql` — 10 tables, RLS, `updated_at` triggers,
    `media` bucket + storage policies. Idempotent.
  - Migration **APPLIED** via Supabase MCP as `hic_init_schema` (20261004024954).
  - `scripts/seed.ts` — idempotent, deterministic UUIDv5. Ran twice, no duplicates.
- **Phase 2**:
  - `lib/types.ts`, `lib/supabase/{env,client,server,admin}.ts`
  - `lib/content/{seed,util,site,divisi,pengurus,proker,galeri,faq,posts}.ts`
  - `data/*.ts` re-export types from `lib/types.ts`.
- `npx tsc --noEmit` → clean.

### ✅ Verification results
- 10 tables created, all RLS-enabled. Policy counts correct (3 each, 2 for
  site_settings/sections). `media` bucket public + storage policies present.
- Seeded: site_settings 1, sections 7, divisi 3, kurikulum 12, mentor 6,
  pengurus 7, proker 6, galeri 5, faq 6, posts 0.
- **Idempotency proven**: re-ran seed, counts unchanged.
- **RLS proven with anon key**: reads published ✓; INSERT denied (42501) ✓;
  UPDATE/DELETE affect 0 rows ✓; unpublished rows hidden ✓.
- **Content layer proven end-to-end** via a temporary Next.js route (19/19
  checks passed), then removed. Zero fallback warnings, zero errors.
- Security advisor: my `set_updated_at` warning fixed (search_path + revoke).

### ⏭️ NEXT — Phase 3 (rewire public site to props)
- `app/page.tsx` → async Server Component fetching all content, passing props.
- Update components: Hero, MarqueeBand, Tentang, DivisiIndex, Pengurus, Proker,
  Galeri, Faq, Gabung, Navbar, Footer, + divisi components.
- Fix "est. 2018" → 1996 (Footer.tsx:144, Navbar.tsx:307).


### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
