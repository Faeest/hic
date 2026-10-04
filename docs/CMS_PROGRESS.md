# HIC CMS — Build Progress / Resume Point

Branch: `feat/supabase-cms`
Plan: `C:\Users\faees\.opencode\plan\hic-supabase-cms-plan.md`

## Status: Phase 6 COMPLETE & VERIFIED. Ready for Phase 7 (deploy).

### ✅ Phase 6 done
- `lib/actions/posts.ts` — create/update/delete with slug auto-generation,
  tag parsing, first-publish `published_at` handling (assertAdmin guarded).
- `lib/content/admin-posts.ts` — admin reads (incl. drafts).
- `components/blog/Markdown.tsx` — shared Markdown renderer (react-markdown +
  remark-gfm) styled with Tailwind, used by admin preview AND public post page.
- `components/admin/PostEditor.tsx` — title/slug/excerpt/cover/tags/published +
  Markdown textarea with **live preview** toggle.
- `components/admin/PostListActions.tsx` — view/edit/delete.
- Admin pages: `/admin/posts` (list), `/admin/posts/new`, `/admin/posts/[id]`.
- Public pages: `/blog` (list, static) + `/blog/[slug]` (SSG, per-post
  `generateMetadata`/OG).
- Navbar (desktop + mobile) and Footer now link to `/blog`.

### ✅ Phase 6 verification
- `tsc` + `eslint` clean. `npm run build` EXIT 0 (22 routes).
- `/blog` static; `/blog/[slug]` SSG with the post prerendered via
  `generateStaticParams`.
- Public blog list shows the post + tags; post page renders Markdown correctly
  (`<h2>`, `<strong>`, `<blockquote>`, `<ul>`, `<code>`), and the **visible DOM
  contains no raw Markdown** (`##` / `**` only exist in the RSC payload).
- Admin `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]` all render 200
  with a session; unauth `/admin/posts` → 307 to login.
- A real post is live at `/blog/selamat-datang-di-blog-hic`.

### ⏭️ NEXT — Phase 7 (deploy)
- VPS: systemd `EnvironmentFile` for Supabase env; run `npm run seed` once.
- `deploy.sh` unchanged (git archive) — env must live on the server.
- Point campus subdomain at the VPS.

### Phase map
0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ · 5 ✅ · 6 ✅ · 7 ⏳ · 8(opt)






### ⚠️ Notes
- **Rotate the secret key** before launch (it was shared in plain chat).
- `next@16.3.5` has a critical RCE advisory fixed in `16.3.8` — upgrade later.
- Next 16: middleware = `proxy.ts`. Auth gate goes there (Phase 4).
- Known bug to fix in Phase 3: "est. 2018" in `Footer.tsx:144` + `Navbar.tsx:307`
  (should be 1996).
- Seed script loads env via `node --env-file=.env.local`.

### Phase map
0 ✅ · 1 ✅ (SQL written, NOT applied) · 2 ✅ · 3 ⏳ · 4 · 5 · 6 · 7 · 8(opt)
