# HIC — Roadmap & Tracking

## Phase 0 — Scaffold
- [x] create-next-app (TS, App Router, Tailwind)
- [x] Install deps: framer-motion, gsap, @phosphor-icons/react
- [x] Fonts self-hosted (Clash Display / Satoshi via Fontshare, JetBrains Mono via fontsource)
- [x] Global styles: orange/white tokens, warm tints, glass-panel, mesh, marquee keyframes

## Phase 1 — Data layer (placeholders)
- [x] data/club.ts, pengurus.ts, divisi.ts, karya.ts
- [x] Believable Indonesian placeholder names/roles/curricula (ketum/sekre/bendahara + koordinator divisi)

## Phase 2 — Design system
- [x] Reusable UI: GlassPanel, MagneticButton, Button, Marquee, SectionHead, Reveal, Parallax, Cursor
- [x] Stagger/motion presets (ease-out-expo)

## Phase 3 — Homepage sections
- [x] Hero (canvas particle field + staggered word reveal + scroll rail + stats strip + divisi rail)
- [x] MarqueeBand -> Tentang -> Divisi index (accordion) -> Pengurus -> Karya (bento) -> CTA -> footer

## Phase 4 — Divisi pages
- [x] /divisi/web, /divisi/uiux, /divisi/iot (hero, kurikulum, mentors, karya, next-divisi nav, CTA)

## Phase 5 — Motion & polish
- [x] GSAP Parallax (hero blobs), canvas hero, magnetic/hover states, stagger reveals
- [x] Lint + typecheck + production build clean
- [x] Reduced-motion support, mobile-collapse layouts
- [x] De-AI pass: native cursor, no pill, no hint, roman-numeral kickers, firm Filosofi bg
- [x] Dark mode (CSS vars + toggle + localStorage + FOUC guard)
- [x] Seamless enlarged marquee (2-copy -50%, squeezed glyphs, no overlap)
- [x] Footer craft.do structure + SVG-grain overlay
- [x] FAQ section (data/faq.ts)
- [x] Navbar: Beranda link, scroll-spy active pill, real-X hamburger

## Phase 6 — Deploy
- [ ] Vercel deploy
- [x] Metadata/SEO + OG (layout.tsx), branded favicon (app/icon.svg)

## Phase 7 — Real content swap
- [ ] Replace placeholders in data/*, drop in real photos

## Milestones
- [x] [Milestone] Homepage complete
- [x] [Milestone] All 3 divisi pages complete
- [ ] [Milestone] Deployed live