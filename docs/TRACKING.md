# HIC — Roadmap & Tracking

## Phase 0 — Scaffold
- [x] create-next-app (TS, App Router, Tailwind)
- [x] Install deps: framer-motion, gsap, @phosphor-icons/react
- [x] Fonts self-hosted (Clash Display / Satoshi via Fontshare, JetBrains Mono via fontsource)
- [x] Global styles: orange/white tokens, warm tints, glass-panel, marquee keyframes

## Phase 1 — Data layer
- [x] data/club.ts, pengurus.ts, divisi.ts, faq.ts
- [x] Replaced with real content from proker + AD/ART

## Phase 2 — Design system
- [x] Reusable UI: Button, MagneticButton, Marquee, SectionHead, Reveal, Parallax, ThemeToggle
- [x] Stagger/motion presets (ease-out-expo)

## Phase 3 — Homepage sections
- [x] Hero (canvas particle field + staggered word reveal + stats strip)
- [x] MarqueeBand -> Tentang (Visi + 7 Pilar) -> Divisi index -> Pengurus -> Program Kerja (bento) -> Galeri -> FAQ -> CTA -> footer

## Phase 4 — Divisi pages
- [x] /divisi/web, /divisi/uiux, /divisi/robotics (hero, kurikulum, mentors, program kerja, next-divisi nav, CTA)
- [x] /divisi/iot 307-redirect to /divisi/robotics

## Phase 5 — Motion & polish
- [x] Canvas hero, magnetic/hover states, stagger reveals
- [x] Lint + typecheck + production build clean
- [x] Reduced-motion support, mobile-collapse layouts
- [x] De-AI pass: native cursor, no pill, no hint, roman-numeral kickers, firm Filosofi bg
- [x] Radial gradients removed → dot-grid / line-grid textures; hero text paper-wrinkle grain
- [x] Dark mode (CSS vars + toggle + localStorage + FOUC guard)
- [x] Seamless enlarged marquee (2-copy -50%, vertical stretch, no overlap)
- [x] Footer craft.do structure + SVG-grain overlay
- [x] FAQ section (data/faq.ts)
- [x] Navbar: Beranda link, scroll-spy active pill (locks on nav jumps), real-X hamburger

## Phase 6 — Deploy
- [ ] Vercel deploy
- [x] Metadata/SEO + OG (layout.tsx), real logo favicon (app/icon.png)

## Phase 7 — Real content
- [x] Real identity: est. 1996, STIKI Malang, real kontak
- [x] Divisi: Web / UI/UX / Robotics (IoT replaced)
- [x] Real curricula per divisi (from proker)
- [x] Real pengurus 2025–2026 (Pembina + BPH + PJ)
- [x] Program kerja section (DITKOM, ORJU, Hackathon, Seminar, GTS/GTC)
- [x] Galeri Kegiatan with real event photos
- [x] Real logo variants in navbar/footer/favicon
- [ ] Swap any remaining placeholder copy if needed

## Phase 8 — CMS / flexible content
- [x] Types centralized in `lib/types.ts`; loader in `lib/content.ts`
- [x] All content moved to `content/*.json` (site, home blocks, divisi, pengurus, proker, galeri, faq)
- [x] `data/*.ts` reduced to re-export shims (no component import churn)
- [x] Hardcoded copy lifted into content: Hero, marquee, all SectionHead titles, footer, nav, SEO
- [x] Homepage driven by reorderable/addable/removable blocks (`components/home/BlockRenderer.tsx`)
- [x] Divisi add/remove supported; `DivisiNav` derives next from list order
- [x] Sveltia CMS at `/admin` (`public/admin/`), image uploads to `public/uploads/`
- [x] `next.config.ts` rewrite so `/admin` serves the CMS
- [x] `docs/CMS.md` editor + setup guide

## Milestones
- [x] [Milestone] Homepage complete
- [x] [Milestone] All 3 divisi pages complete
- [x] [Milestone] Real content integrated
- [x] [Milestone] Content editable via CMS (no code)
- [ ] [Milestone] Deployed live