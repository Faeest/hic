# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: Phase 3 COMPLETE & VERIFIED. Ready for Phase 4 (auth + admin).

### ✅ Phase 3 done
- `app/page.tsx` → async Server Component fetching all content, passing props.
- `app/divisi/[slug]/page.tsx` → fetches by slug + list for nav.
- All 17 components rewired to props (Hero, MarqueeBand, Tentang, DivisiIndex,
  Pengurus, Proker, Galeri, Faq, Gabung, Navbar, Footer, DivisiHero, Kurikulum,
  MentorSection, DivisiKarya, DivisiNav, DivisiGabung).
- Sections are now data-driven and hideable (`section.visible`).
- Bug fixed: "est. 2018" → 1996 (Footer + Navbar).
- New editable fields: `tahun_berdiri`, `periode_kepengurusan` (migration 0002).

### 🔧 Key architectural fix (found during build)
Public content readers originally used the cookie-bound SSR client, which
forced **dynamic rendering** and broke `generateStaticParams` (build warnings,
routes marked ƒ). Fixed by adding `lib/supabase/public.ts` — a **cookie-less
anon client** for public reads (RLS still protects writes). Result: `/` is
**static** and `/divisi/*` are **SSG**.

Trade-off: static pages won't reflect admin edits until revalidated. Solution:
`lib/actions/revalidate.ts` (`revalidatePublic()`) — call in every admin Server
Action. **PROVEN** end-to-end: changed a DB value, page stayed stale, called
`revalidatePath("/")`, page updated.

### ✅ Phase 3 verification
- `npx tsc --noEmit` → clean. `npx eslint .` → clean.
- `npm run build` → EXIT 0, **zero `[content]` fallback warnings**, `/` static,
  `/divisi/*` SSG via generateStaticParams.
- **Byte-level diff** vs original (git worktree of `a2390d9`): homepage and all
  3 divisi pages are **textually IDENTICAL** except the intentional
  `est. 2018` → `est. 1996` fix.
- Live DB proof: edited tagline in Supabase → stale until revalidate → updated.

### ⏭️ NEXT — Phase 4 (auth + admin shell)
- `@supabase/ssr` login page + Server Action; `proxy.ts` gate for `/admin/*`.
- Admin shell/layout. Then Phase 5 (CRUD) + Phase 6 (blog).

### Phase map
0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ⏳ · 5 · 6 · 7 · 8(opt)



### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
