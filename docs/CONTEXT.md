# HIC — UKM Profile Website

## What
Profile/landing website for HIC (Hardware Interactive Club) STIKI Malang, a
keilmuan (academic) UKM. Members mentor each other in small classes/tracks.
Founded 26 August 1996, based at Jl. Raya Tidar 100, Malang.

## Tracks (divisi)
- Web (Website Development)
- UI/UX
- Robotics

## Structure (hybrid)
- Homepage (Beranda): one-scroll cinematic — hero → marquee → tentang →
  divisi index → pengurus → program kerja → galeri → FAQ → CTA → footer
- 3 divisi pages: /divisi/web, /divisi/uiux, /divisi/robotics
  (track hero, kurikulum, mentors, program kerja divisi)
  - `/divisi/iot` 307-redirects to `/divisi/robotics` (legacy slug)
- Pengurus: Dosen Pembina + BPH (Ketua Umum, Sekretaris, Bendahara) + Biro
  (Inventaris, Humas, 3D, Program dan Acara, Website HIC, Keilmuan) +
  Penanggung Jawab Divisi (Web / UI/UX / Robotics)

## Real content sources
- `docs/proker_hic_kepengurusan_25-26.pdf` — visi, 7 pilar misi, program kerja,
  kurikulum tiap jurusan, struktur kepengurusan 2025–2026 (real names)
- `docs/revisi AD ART (2)[1].docx` — AD/ART: nama, tanggal berdiri, kedudukan,
  struktur, keanggotaan, logo
- Real photos in `public/`: ditkom_hic_2024/2025, orsi_web_24, seminar_hardware,
  main_di_sekre
- Real logo variants in `public/variant_logo-hic/` (used in navbar/footer/favicon)

## Data layer (all swappable)
- data/club.ts — identity, visi, pilarMisi (7), statistik, kontak
- data/divisi.ts — 3 divisi + real curricula + mentors
- data/pengurus.ts — pembina, pengurusInti (BPH), koordinatorDivisi (PJ)
- data/proker.ts — program kerja (DITKOM, ORJU, Hackathon, Seminar, GTS/GTC)
- data/galeri.ts — event photos
- data/faq.ts — FAQ items

## Stack
- Next.js (App Router) + TypeScript, deploy on Vercel
- Tailwind CSS v4
- Framer Motion (UI motion) + GSAP ScrollTrigger (scroll choreography) —
  NEVER mixed in the same component tree
- Lightweight canvas particle field in hero
- Fonts (self-hosted via Fontshare): Clash Display (headers), Satoshi (body),
  JetBrains Mono (labels)
- Icons: @phosphor-icons/react, strokeWidth 1.5
- ~~No DB, no auth~~ — superseded: Supabase (Postgres + Storage) + Supabase
  Auth admin CMS. See "Deployment, data and cache" below.

## Visual language — "Colorful glassmorphism × brutalist-modern"
- LIGHT theme: white base (#ffffff) + warm tints (#fdf9f4, #fff6ec)
- Brand orange: #D45311 (primary/deep), #FB9606 (accent/bright)
- Ink: warm charcoal (#1c1512), no pure black
- Light glassmorphism: white-glass panels, 1px warm borders, soft inset highlight
- Brutalist accents: oversized display type, roman-numeral kickers, mono labels,
  marquee bands
- NO radial gradients — replaced with `.dot-grid` (SVG solid dots) + `.line-grid`
- Hero headline uses `.text-grain` (paper-wrinkle SVG lighting clipped in glyphs)
- All-asymmetric sections; collapse to single column below 768px;
  use min-h-dvh not h-screen

## Dark mode
- Class-based via `.dark` on <html>; CSS custom properties swap in globals.css
- ThemeToggle (sun/moon) in navbar; first visit = follows system, persisted in localStorage `hic-theme`
- FOUC-guard inline script in app/layout.tsx head
- Divisi accent colors are dual (latar/latarDark, border/borderDark) via `divisiVars()` CSS-var helper

## Design decisions (de-AI polish)
- Native cursor (no custom cursor)
- Roman-numeral sentence-case kickers (e.g. "I — Tentang HIC"), no letterspaced-uppercase mono
- Hero has NO bottom divisi rail
- Marquee rows are strictly 2 identical halves animating -50% for a seamless loop
- Footer: mini-CTA band → column grid (Divisi/Navigasi/Kontak) → bottom utility bar,
  with SVG-grain overlay (`.grain`, footer only)
- Scroll-spy locks during nav jumps (no indicator bounce through sections)

## Conventions
- Indonesian (Bahasa) copy throughout
- REST full keyboard, accessible, no emojis in code/UI

## Deployment, data and cache (verified 2026-11-14)

### Two deployments, one database

| Domain | Host | Updated by |
| --- | --- | --- |
| `hic.ubhinus.ac.id` | **Vercel** (project `hic`) | push to GitHub `Faeest/hic` master → auto-build |
| `hic.faeest.my.id` | VPS `103.169.186.163:25567` (user `lerraf`) | `bash deploy.sh` (git archive HEAD → tar → `npm ci` + `npm run build` + `systemctl --user restart hic.service`) |

- Vercel project id `prj_elmuJQauKOAJNFYGIvZPhBDa2gtN`, team `team_GaiIJssCOqxbyusdBGczIBvm`.
- VPS app dir `/home/lerraf/hic`, env `/home/lerraf/hic.env`, app port `3100`.
- **Both point at the same Supabase project** `zluqwvumzzrursptfrod.supabase.co`.
- `deploy.sh` does NOT update `hic.ubhinus.ac.id`. Editing the VPS is not enough.
- The VPS checkout is a tar extract, not a git repo (`git log` fails there).

### Content is baked at build time

- `lib/content/*` readers use `"use cache"` + `cacheLife("max")` + a content tag
  (`lib/cache/tags.ts`).
- Pages are prerendered: `.next/server/app/index.html` is a static file written by
  `next build`. Deleting `.next/cache` does **not** refresh it — only a rebuild does.
- `revalidatePublic()` (`lib/actions/revalidate.ts`) calls `updateTag()` for every
  content tag plus `revalidatePath("/")`, `/divisi/[slug]`, `/blog`, `/blog/[slug]`.
  It is only called from admin Server Actions.
- **Consequence:** a direct SQL/REST write to Supabase is invisible on the live site
  until either (a) someone saves a row in `/admin/*`, or (b) a new deploy runs.
  Prefer editing through `/admin` — no rebuild needed.
- Vercel also serves `X-Vercel-Cache: HIT` with `Age`; a fresh deploy replaces the
  prerender, so no manual purge is needed.

### kepengurusan (the "loadout") + pengurus

A board is a row in `kepengurusan`, not a free-text period repeated on every
pengurus row. Exactly one board is `aktif`; that is the one the public site
renders. Swapping boards is one row update, so the whole section changes without
touching individual pengurus rows.

`kepengurusan`: `id uuid pk`, `nama`, `periode`, `aktif`, `catatan`, `sort`,
`updated_at`. A partial unique index (`kepengurusan_satu_aktif`) enforces at most
one active board.

`pengurus`: `id uuid pk`, `nama`, `jabatan`, `deskripsi`, `inisial`, `gradien`,
`nrp`, `kategori` (`pembina|inti|biro|koordinator`), `unit`, `foto`, `sort`,
`published`, `kepengurusan_id` (FK, `on delete cascade`), `updated_at`.

- `unit` = divisi slug for a PJ (`web`/`uiux`/`robotics`), free label for a biro
  (`humas`, `3d`, `keilmuan`, `program-acara`, `website`, `inventaris`).
- `nrp` is a real column now (migration 0007 promoted it out of `deskripsi`).
  Empty for the dosen pembina and the external PJs.
- `pengurus.periode` still exists but is **deprecated** — nothing reads or writes
  it. It was kept so the build that was live during the 0007 rollout kept working.
  A later migration can drop it.
- `site_settings.periode_kepengurusan` is a display string kept in sync by
  `activate_kepengurusan()`. It is no longer editable in `/admin/site`.
- Biro cards are keyed `${nama}-${jabatan}` because two people hold two biro roles
  each (Berliani Hana Safira and Deswiryawan Saragih: Humas + Keilmuan).

**Admin flow**

- `/admin/kepengurusan` — list boards, **Aktifkan** (atomic RPC), **Duplikat**
  (copies every pengurus row into a new board), **Ubah**, **Hapus**. The active
  board cannot be deleted.
- `/admin/pengurus?loadout=<id>` — the board switcher plus the normal CRUD list,
  scoped to that board. New rows inherit `kepengurusan_id` via `fixedValues`.
- All mutations are Server Actions, so `revalidatePublic()` runs and the live site
  updates without a rebuild.
- Every admin mutation reports through `sonner` toasts: `withToast()` in
  `lib/admin/toast.ts` turns a `{ ok, error }` action into one toast that starts
  as a spinner and resolves to success or error. `<AdminToaster />` follows the
  site's `.dark` class. Media uploads/replaces/deletes call `toast` directly
  because those actions return `{ error }` rather than `{ ok }`.

**RLS**: anon reads only `kepengurusan.aktif = true` and only pengurus rows whose
board is active. Authenticated reads/writes everything. `activate_kepengurusan`
is `security definer`, revoked from `anon`, granted to `authenticated`.

### Board 2025/2026 as stored (17 rows)

- `pembina` — Hilman Nuril Hadi, S.Kom., M.Kom
- `inti` — Muhammad Ilham Wiradisastra (Ketua Umum, 241111009),
  Maria Dealova Indah Natara (Sekretaris, 241111004),
  Norbertus Bimantya Abadi (Bendahara, 241111021)
- `biro` — Fattih Kuwaka Bekti (Inventaris, 241111005),
  Berliani Hana Safira (Humas, 241131012), Deswiryawan Saragih (Humas, 241111008),
  Dico Havianto (3D, 241111017), Angie Nabilah Fidela (3D, 242111025),
  Nanda Rizky Ramadhani Wijaya (Program dan Acara, 241111007),
  Akhmad Zakariya (Program dan Acara, 241111010),
  Faiz Ramadhan (Website HIC, 241111011),
  Berliani Hana Safira (Keilmuan, 241131012),
  Deswiryawan Saragih (Keilmuan, 241111008)
- `koordinator` — Satya Garda Prasetyo (web), Muhammad Dimas Cahyo (uiux),
  Zulhan Arif Fasya (robotics). These are external to the board and kept as-is.

### galeri — one row is a moment

`galeri.images text[]` holds the ordered photos of a moment; `image_url` is the
cover and always mirrors `images[0]` (kept for the pre-0008 build and for any
reader that still wants a single URL). `lib/content/galeri.ts` maps the array to
`Foto.images` and drops rows with no image at all.

- Public: the grid shows the cover; a moment with more than one photo gets an
  `N foto` pill and opens `components/home/GaleriLightbox.tsx` (arrows, counter,
  Escape, dots).
- Admin: `galeriConfig` uses the `images` field kind → `ImagesField`, which
  submits a JSON array. The first thumbnail is the cover; arrows reorder.
- `crud.ts` parses `images` and writes `image_url = images[0] ?? ""`, so the
  cover column cannot drift.

### Media picker

`components/admin/fields/MediaPicker.tsx` is the shared "choose from media"
dialog: bucket listing via `listMediaAction()`, search, folder chips, multi-select,
and an **Unggah** button that uploads into the field's folder and selects the new
files immediately. `ImageField` (single) and `ImagesField` (multi) both use it, so
every image field can pick an existing file instead of only uploading.

### Reordering is deferred

`ResourceManager` keeps the list order in local state. Dragging the grip handle
(framer-motion `Reorder`) or using the arrow buttons only changes that state; a
sticky **Simpan urutan** bar appears while the order differs from the server and
writes once via `reorderRows()`. **Batalkan** restores the server order, and a
`beforeunload` guard warns on refresh/close. Create and delete still write
immediately, so they ask before discarding an unsaved order.

### Useful commands

```bash
# read pengurus straight from Supabase (secret key bypasses RLS)
node --env-file=.env.local -e '...'   # or a scratch .mjs using fetch + apikey header

# deploy the VPS copy
bash deploy.sh

# deploy the public site
git push origin master                # Vercel builds automatically
```

`.env.local` keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY`. The VPS `hic.env` has no `SUPABASE_SECRET_KEY`, so
`scripts/snapshot-media.mjs` skips there.
