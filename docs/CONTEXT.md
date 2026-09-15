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
- Pengurus: Dosen Pembina + BPH (Ketua Umum, Sekretaris, Bendahara) +
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
- No DB, no auth

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