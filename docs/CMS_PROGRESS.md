# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: Phase 0–2 COMPLETE, blocked on applying migration

### ✅ Done
- **Phase 0** deps: `@supabase/supabase-js`, `@supabase/ssr`, `react-markdown`,
  `remark-gfm`, `tsx` (dev), `server-only`. Env: `.env.local` + `.env.example`.
- **Phase 1**:
  - `supabase/migrations/0001_init.sql` — 10 tables, RLS, `updated_at` triggers,
    `media` bucket + storage policies. Idempotent.
  - `scripts/seed.ts` — idempotent, deterministic UUIDv5 from natural keys.
    VERIFIED: connects, resolves imports, reports tables missing (expected).
- **Phase 2**:
  - `lib/types.ts` — canonical app + row types, `Database` type (complete shape).
  - `lib/supabase/{env,client,server,admin}.ts`
  - `lib/content/{seed,util,site,divisi,pengurus,proker,galeri,faq,posts}.ts`
    All readers fall back to `data/*.ts` seed on error/empty.
  - `data/*.ts` now re-export types from `lib/types.ts` (single source of truth).
- `npx tsc --noEmit` → **clean (exit 0)**.

### ⏭️ NEXT (after opencode restart loads Supabase MCP)
1. Apply `supabase/migrations/0001_init.sql` via MCP (`apply_migration` or
   `execute_sql`), project_ref `zluqwvumzzrursptfrod`.
2. Run seed: `npm run seed`.
3. Verify with anon key that RLS allows reads (not just service role).
4. Proceed to **Phase 3** (rewire public site to props) — the big one.

### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
