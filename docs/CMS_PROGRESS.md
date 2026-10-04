# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: Phase 5 COMPLETE & VERIFIED. Ready for Phase 6 (blog).

### ✅ Phase 5 done
- **Field primitives** (`components/admin/fields/`): TextField, TextArea,
  SelectField, ToggleField, ColorField, ImageField (upload + URL), RepeaterField
  (JSON arrays/objects with reorder), SubmitButton (pending state), FieldWrap.
- **Generic CRUD**: `lib/admin/tables.ts` (allow-list), `lib/admin/resource.ts`
  (FieldSpec/ResourceConfig), `lib/actions/crud.ts` (create/update/delete/reorder),
  `components/admin/ResourceManager.tsx` (list + form renderer).
- **Per-entity configs**: `lib/admin/configs.ts` (sections, divisi, pengurus,
  proker, galeri, faq, kurikulum, mentor).
- **Site settings**: `lib/actions/site.ts` + `components/admin/SiteForm.tsx` —
  identity, logo, hero, tentang, pilar misi, statistik, marquee, kontak, sosial,
  testimoni.
- **Admin pages**: site, sections, divisi (+ `divisi/[id]` for kurikulum &
  mentor), pengurus, proker, galeri, faq, media (uploader w/ copy URL).
- **Uploads**: `lib/actions/upload.ts` → Supabase Storage `media` bucket.
- `next.config.ts`: Supabase host added to `images.remotePatterns`.

### 🔧 Issues found & fixed
1. **`@phosphor-icons/react` in Server Components** — icons use React context.
   Fix: import from `@phosphor-icons/react/dist/ssr` in server files, or move
   icons into client components.
2. **`"use server"` file exported a non-function** (`CRUD_TABLES` const) →
   build error "A 'use server' file can only export async functions". Fix: moved
   constants to `lib/admin/tables.ts`.
3. **Dynamic table name broke typed client** → used a loosely-typed view of the
   authenticated client (RLS remains the real guard).

### ✅ Phase 5 verification
- `tsc` + `eslint` clean. `npm run build` EXIT 0, all 18 admin routes present.
- **All admin pages render 200** with a real session cookie (9 pages + divisi
  detail with kurikulum/mentor data).
- **CRUD proven end-to-end** (via a temp route exercising the real action logic):
  site update persisted (incl. JSON arrays), FAQ create → update → delete all
  `ok:true`; DB confirmed via SQL; **unauthenticated call rejected**
  (`"Tidak diizinkan."`).
- Public site verified unchanged after CRUD testing; test data cleaned up.

### ⏭️ NEXT — Phase 6 (blog)
- `posts` admin CRUD (Markdown editor + live preview), public `/blog` +
  `/blog/[slug]` with react-markdown, nav/footer links.

### Phase map
0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ · 5 ✅ · 6 ⏳ · 7 · 8(opt)





### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
