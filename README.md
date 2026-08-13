# Gurnoor Tamber

yooo gng so wass up, this is me. I'm Gurnoor.

this is my home on the internet, and honestly I just wanted it to feel like me — so no template. I sat there and built it from zero, swapped stuff around a bunch of times until it clicked. It's live at https://praknoor.dev, go check it out.

---

## What this is

A long-scroll portfolio that treats my career like a plot. Dark, cinematic scrollytelling in — painted in by an actual brush — then an editorial, magazine-style "About" on paper pages, competition records, a capabilities chapter list, and a pinned project vault you flip through like dossiers.

## Sections

- **Brush-paint splash** — an SVG brush sweeps across and paints "Gurnoor Tamber", wet-ink edge, sheen, ink flecks, then dissolves into the page.
- **Scrollytelling intro** — GSAP + Lenis, scrubbed to scroll.
- **About (editorial paper)** — mugshot, manifesto, where I study, what I'm into... in small-caps red ink.
- **Hackathon records (paper)** — USAII finalist + United Hacks 3rd place, with certificates.
- **Expertise (chapters)** — Engineer, Creator, Thinker, Hustler — with stat bars.
- **Selected Works vault** — pinned, scroll-scrubbed, 8 projects with full-screen backgrounds.
- **Side hustle** — the startup I'm building, with platform + Discord.

## Stack

- Vite + vanilla JS (no framework)
- GSAP + ScrollTrigger (pinned scrollytelling)
- Lenis (smooth scroll)
- Tailwind (CDN, custom config)
- Google Fonts — Syncopate, Playfair Display, Space Grotesk, Space Mono, Outfit, Cormorant Garamond, Noto Sans JP
- Custom CSS: paper texture, brush-paint SVG filter, katana-blade scroll progress, custom cursor, glitch layers

## Run locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Deploy

Hosted on Vercel, auto-deployed from `main` (github.com/GurnoorLog/portfolio).

## Structure

```
├── index.html                        # markup + all custom CSS layers
├── src/
│   ├── main.js                       # Lenis, GSAP timelines, spotlight, boot
│   ├── works/portfolio-works.js      # the project vault
│   └── staggered-menu/StaggeredMenu.js
└── public/
    ├── phtots_projects/              # project images, portrait, startup preview
    └── certificates/                 # hackathon certs (PNG + PDF)
```

## Contact

- GitHub — GurnoorLog
- LinkedIn — gurnoortamber
- Email — gurnoor.tamber.x.01@gmail.com
- Startup — aether-sooty-one.vercel.app · Discord: c9tZsYGH

## License

All yours to poke at, but the work behind the pixels is mine. Don't lift it wholesale.