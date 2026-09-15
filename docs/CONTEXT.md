# HIC — UKM Profile Website

## What
Profile/landing website for HIC (Hardware Interactive Club), a keilmuan
(academic) UKM. Members mentor each other in small classes/tracks.

## Tracks (divisi)
- Web
- UI/UX
- IoT

## Structure (hybrid)
- Homepage (Beranda): one-scroll cinematic — hero → marquee → tentang →
  divisi index → pengurus → karya → CTA → footer
- 3 divisi pages: /divisi/web, /divisi/uiux, /divisi/iot
  (track hero, kurikulum, mentors, contoh karya)
- Pengurus hierarchy: Ketua Umum, Sekretaris, Bendahara (+ divisi koordinator)

## Stack
- Next.js 15 + TypeScript (App Router), deploy on Vercel
- Tailwind CSS
- Framer Motion (UI motion) + GSAP ScrollTrigger (scroll choreography) —
  NEVER mixed in the same component tree
- Optional lightweight WebGL/Canvas hero
- Fonts: Clash Display (headers), Satoshi (body), JetBrains Mono (labels)
- Icons: @phosphor-icons/react, strokeWidth 1.5
- No DB, no auth. Placeholder data in src/data/*.ts, swap later

## Visual language — "Colorful glassmorphism × brutalist-modern"
- LIGHT theme: white base (#ffffff) + warm tints (#fdf9f4, #fff6ec)
- Brand orange: #D45311 (primary/deep), #FB9606 (accent/bright)
- Ink: warm charcoal (#1c1512), no pure black
- Light glassmorphism: white-glass panels, 1px warm borders, soft inset highlight
- Brutalist accents: oversized display type, index numbers, mono labels,
  marquee bands, orange mesh-gradients
- All-asymmetric sections; collapse to single column below 768px;
  use min-h-dvh not h-screen

## Dark mode
- Class-based via `.dark` on <html>; CSS custom properties swap in globals.css
- ThemeToggle (sun/moon) in navbar; first visit = follows system, persisted in localStorage `hic-theme`
- FOUC-guard inline script in app/layout.tsx head
- Divisi accent colors are dual (latar/latarDark, border/borderDark) via `divisiVars()` CSS-var helper

## Design decisions (de-AI polish)
- Custom cursor removed (native cursor)
- No pulsing "UKM Keilmuan" pill, no "Ketuk untuk lihat kurikulum" hint
- Section kickers use roman numerals + sentence case (e.g. "I — Tentang HIC"), no letterspaced-uppercase mono
- Hero has NO bottom divisi rail (removed to avoid marquee collision)
- Marquee rows are strictly 2 identical halves animating -50% for a seamless loop
- Footer: mini-CTA band → column grid (Divisi/Navigasi/Kontak) → bottom utility bar, with craft.do-style SVG-grain overlay (`.grain`, footer only)
- FAQ section (data/faq.ts, 6 items) sits between Karya and Gabung

## Conventions
- Indonesian (Bahasa) copy throughout
- REST full keyboard, accessible, no emojis in code/UI