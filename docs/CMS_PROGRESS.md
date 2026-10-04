# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: Phase 4 COMPLETE & VERIFIED. Ready for Phase 5 (admin CRUD).

### ✅ Phase 4 done
- `lib/auth/dal.ts` — `getAdminSession()`, `requireAdmin()` (redirect),
  `assertAdmin()` (fail-closed for Server Actions).
- `lib/actions/auth.ts` — `signIn` (useActionState-compatible), `signOut`.
- `proxy.ts` — Next 16 Proxy: refreshes Supabase session, optimistic `/admin`
  gate (redirects with `?next=`), skips login when already authed.
- `app/admin/login/page.tsx` + `components/admin/LoginForm.tsx` — login UI.
- `app/admin/(protected)/layout.tsx` — route group so login stays public while
  everything else requires admin.
- `components/admin/AdminShell.tsx` — sidebar nav + top bar + sign out.
- `app/admin/(protected)/page.tsx` + `components/admin/DashboardGrid.tsx` —
  dashboard with live content counts.

### 🔧 Issue found & fixed
`@phosphor-icons/react` uses React context → **cannot be imported into a Server
Component** (build error `createContext is not a function`). Fix: dashboard page
is a Server Component that fetches counts and passes them to the client
`DashboardGrid`. Pattern applies to all admin pages: **server page = data,
client component = icons/UI**.

### ✅ Phase 4 verification
- `tsc` + `eslint` clean. `npm run build` EXIT 0.
- Routes: `/` static, `/divisi/*` SSG, `/admin` dynamic, `/admin/login` static,
  **Proxy (Middleware) registered**.
- **Auth gate proven**: `/admin` → 307 `→ /admin/login?next=%2Fadmin`;
  `/admin/login` → 200; `/` → 200.
- **Login proven**: password grant against Supabase Auth returns a token.
- **RLS write proven**: authenticated PATCH succeeds (1 row); anon PATCH denied.
- Admin user created: `hic.stiki@gmail.com` (email confirmed).

### ⚠️ Security follow-ups
- Admin password is currently `12345678` — **change before launch** (weak).
- Rotate the secret key (shared in plain chat).

### ⏭️ NEXT — Phase 5 (admin CRUD)
- Reusable field primitives (TextField, TextArea, ImageField, ColorField,
  SelectField, ToggleField, RepeaterField, SortableList, SubmitButton).
- Server Actions per entity + `revalidatePublic()` after each mutation.
- Pages: site, sections, divisi, pengurus, proker, galeri, faq, media.

### Phase map
0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ · 5 ⏳ · 6 · 7 · 8(opt)




### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
