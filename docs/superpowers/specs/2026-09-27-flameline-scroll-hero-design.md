# Flameline demo landing page with scroll-scrubbed hero film — Design

Status: approved in conversation 2026-09-27 (all six sections). Awaiting written-spec review.

## 1. Purpose

A demo landing page for Flameline AB (B2B premium cigar import and distribution, Borås, Sweden) whose only job is to persuade the client to sign one of the two proposed packages. The hero is near-final; body sections are placeholder grade. Audience of the finished site is high-end distributors, lounges and corporate buyers, so every motion reads unhurried and expensive.

Success: the developer screen-shares the page and the client asks when the build can start.

## 2. Locked decisions

| Decision | Value |
|---|---|
| Art direction | Photoreal cinematic. Full-bleed, dark, warm single key light, golden hour. |
| Camera | One continuous forward walkthrough (scroll-world architecture A). No connectors. Never reverses across a seam. |
| Journey | 4 scenes: Estelí tobacco field → rolling gallery → humidor and Yxtobak lounge → finale (single lit cigar, CTAs). |
| Mobile | Desktop film only. Phones get the landscape film centre-cropped plus the engine's phone hardening. No portrait chain. |
| Video model | Kling 3.0 on Kie AI, `mode: "pro"` (1080p), 10 s legs, 16:9, one model and one mode for every clip. |
| Still model | Drafts on Nano Banana 2 Lite (fal). Finals on one pro photoreal model on fal, recipe to be added before first paid run. |
| Stack | Next.js 16, TypeScript, App Router, `output: "export"`. Plain CSS with the prototype's tokens as custom properties. No Tailwind. |
| Identity | Inherit the v2 prototype: ground #0c0a08, panel #14110e, line #3a312a, ember #d49152, amber #e7b46a, bronze #b89968, cream #e9e2d3, muted #c9bfa8, dim #6f6350, oxblood #8b2d20. Cormorant Garamond display, Inter Tight body, JetBrains Mono labels. |
| Build path | Code-led. Ambition lives in this spec's first-viewport and motion contract; no comp round. |
| Out of demo | Age gate, real auth, real forms, price list, order flow, mobile chain, SEO. |

## 3. Repository layout

```
app/
  layout.tsx            fonts (next/font/google), globals.css, metadata
  page.tsx              composes HeroFilm + body sections + Footer
  globals.css           tokens, reset, type scale, grain overlay
components/
  Nav.tsx               fixed, translucent, brand + 4 links + B2B button
  HeroFilm.tsx          client component; mounts the scrub engine with the scene config
  Pathways.tsx          "Three ways in" cards
  EventsTeaser.tsx      events copy + 3 package rows
  TradeBand.tsx         B2B band + "Enter the portal"
  Footer.tsx
lib/scroll-world/
  scrub-engine.js       the portable engine, themed via CSS vars, unchanged in behaviour
  scenes.ts             the 4 scenes: id, label, copy, tags, pacing, accent
  config.ts             buildConfig(scenes, manifest) -> engine config (pure)
public/assets/
  stills/*.webp         posters, 16:9
  vid/*.mp4             encoded legs
  manifest.json         generated: which stills/clips exist
scripts/
  lib/prompts.mjs       style preamble + per-scene subject -> prompt text (pure)
  lib/chain.mjs         leg order, start-frame path for leg i, output paths (pure)
  lib/manifest.mjs      scan public/assets -> manifest.json (pure core + fs wrapper)
  gen-stills.mjs        fal calls, draft and final
  gen-legs.mjs          Kie Kling calls, sequential, frame handoff, sidecar logs
  encode.mjs            ffmpeg encode (1080p, crf 20, GOP 8, unsharp, -an, faststart)
  qa-seams.mjs          Playwright: seam screenshots, console, seekable, reduced motion
prompts/
  preamble.txt          the byte-identical style preamble
  still_<scene>.txt     one per scene
  leg_<scene>.txt       one per scene
generations/            raw API outputs + JSON sidecars (gitignored except sidecars)
tests/                  vitest for scripts/lib and lib/scroll-world/config.ts
```

The two prototype HTML files and the scope markdown stay untouched as reference.

## 4. Hero film

### First viewport
Full-bleed scene 1 still (field at dawn) under a near-black vignette. Fixed nav at top: FLAMELINE wordmark left in Cormorant, tracked uppercase, amber; four mono links and the outlined "B2B Login" button right. Copy pinned left, width 42vw max 520px: mono kicker "Premium cigar distribution · Borås · Sweden", display headline "The line from leaf to light." with "leaf" in italic ember, one body sentence, two mono tag pills. Route rail of four ember dots on the right with mono labels on hover. Scroll hint bottom centre in mono, fades within half a viewport. The film starts moving on the first pixel of scroll.

### Scenes and copy

| # | id | label | eyebrow | title | body | tags |
|---|---|---|---|---|---|---|
| 1 | field | The leaf | Premium cigar distribution · Borås · Sweden | The line from leaf to light. | Flameline curates and distributes premium, handcrafted cigars for the Nordics, and shares the culture that surrounds them. | Horacio · Barreda; Estelí · Jalapa · Ometepe |
| 2 | gallery | The hand | Rolled entubado | Made by hand, box after box. | Fillers rolled entubado and empalmado: a firm pack with an excellent draw, every time. | Hand-rolled; Nicaraguan-rooted |
| 3 | humidor | The house | Yxtobak Lounge · Borås | One house holds the whole line. | From distributor pricing to guided corporate tastings, beneath a floor-to-ceiling humidor. | Wholesale; Events; Education |
| 4 | light | The light | Trade & enthusiasts · 18+ | Give it your full attention. | A cigar is not smoked against the clock. That is the whole secret. | CTA primary "Explore the cigar experience" → #experience; secondary "B2B partner login" → #b2b |

Scene 1 copy greets on landing and fades by 62% of its leg. Scene 4 copy holds from 40% of its leg to the end. Scenes 2 and 3 peak mid-leg.

### Pacing
`diveScroll` 1.4 vh per leg. Scene 1 `scroll` 1.7, `linger` 0.35. Scene 4 `scroll` 1.8, `linger` 0.45. Scenes 2 and 3 default, `linger` 0.25. `crossfade` 0.08. `connectors: []`.

### Theming
Engine tokens overridden at `:root`: `--sw-bg` #0c0a08, `--sw-ink` #e9e2d3, `--sw-ink-soft` #c9bfa8, `--sw-accent` #d49152, display font Cormorant Garamond, body Inter Tight, mono JetBrains Mono for num, eyebrow, tags, hint, route labels. Pills and buttons are square-cornered (the prototype uses no radius). Nav pill and particles disabled (`nav: false`, `atmosphere: false`); the page's own Nav component replaces the engine's topbar. The prototype's SVG grain overlay sits above everything at low opacity.

### Fallbacks
- No clip file yet for a scene: `config.ts` omits `clip`; the engine shows the still with its slow scale drift and dissolves to the next. The page must look finished at every stage of asset delivery.
- `prefers-reduced-motion`: engine never loads clips; stills dissolve; copy fades without translate.
- No JavaScript: the four stills and copy render as stacked static sections (progressive enhancement in `HeroFilm.tsx` server markup, replaced on mount).

### Motion contract
One authored moment: the continuous flight. No hover lifts, no bounce, no per-section scroll reveals in the body; body sections use a single 300 ms opacity fade on first intersection, or nothing.

## 5. Asset pipeline

### Stills
Prompt = `preamble.txt` + `Subject: <scene subject>`. Preamble byte-identical across all four. 16:9, highest resolution the model offers. Draft all four on Nano Banana 2 Lite, review for cohesion (same light, same grade, same lens), then final on the pro model. No faces; hands allowed in scene 2. No text, letters or logos anywhere. Sidecar JSON per output: model, prompt, params, created.

Subjects:
1. field: Estelí tobacco field at dawn, dew on broad leaves, low mist, a curing barn on the horizon, volcanic hills.
2. gallery: a rolling gallery, cedar tables, a torcedor's hands pressing filler leaves into a bunch, chaveta, wooden molds, stacked wrapper leaves.
3. humidor: a floor-to-ceiling walk-in humidor and lounge, Spanish cedar shelving, rows of open cigar boxes, leather chairs, one brass lamp.
4. light: a single premium cigar held to a soft flame, foot toasting, thin smoke, dark cedar and leather background, two closed cigar boxes out of focus.

### Legs (Kling 3.0 pro, Kie AI)
Sequential. Leg 1 start image = scene 1 final still. Leg i start image = leg i−1's actual last frame, extracted with ffmpeg at `-sseof -0.15`, uploaded to obtain a public URL (fal storage or Kie upload; confirmed at implementation once the hosts are reachable). No end image. Each prompt: "Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward glide." + a mid-leg move + "In the final second, settle back into a slow, steady forward glide toward <next scene>." + style tail. Mid-leg moves: field, low rise-and-reveal over the rows toward the barn door; gallery, low lateral track along the table then push toward the doorway; humidor, steadicam glide through the cedar door and a gentle crane-up; light, slow half-orbit around the cigar, settling on the ember. Duration 10, aspect 16:9, mode pro.

Before chaining leg i+1, the developer inspects leg i's last frame: it must read as a calm forward-glide frame. Otherwise re-roll leg i (up to 3 attempts) before spending on i+1. Content-filter rejections: re-roll, then strip trigger words and add "unoccupied, architectural, tasteful".

### Encode
`ffmpeg -an -vf unsharp=5:5:0.8:5:5:0.0 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart`, native 1080p. Posters: scene stills to webp, 1800 px wide, q 84. Then regenerate `manifest.json`.

### Spend gates
Each paid phase is quoted and approved before it runs: still drafts (under $1), still finals (under $2), legs (about $17–37 at pro incl. re-rolls). Sidecars and `generations/*.json` are committed; raw media is gitignored except the encoded assets in `public/assets`.

## 6. Body sections

From the prototype's home page, in order below the film: Pathways ("Three ways in", three cards), EventsTeaser (headline "An evening your guests will talk about for years." plus the three package rows), TradeBand (distributor pricing headline + "Enter the portal →"), Footer. Real headings where the prototype supplies them; lorem ipsum in body copy where a section's copy is not final; image slots rendered as labelled dashed placeholders for the client's photos. Section numbering and hairline rules as in the prototype. Links to Events, Experience, Brands and B2B are anchors on this page for the demo.

## 7. Verification

- Unit (vitest): `prompts.mjs` produces the identical preamble prefix for all scenes; `chain.mjs` returns leg order, start-frame source (still for leg 1, previous last frame otherwise) and output paths; `manifest.mjs` reports presence per scene; `config.ts` omits `clip` for missing files and sets `connectors: []`.
- Playwright against `out/` served by a static server: screenshot just before and after each seam, near-identical composition; console has no errors; `video.seekable.end(0) > 0` for loaded clips; `currentTime` tracks scroll within a leg; reduced-motion run shows stills only; one phone viewport pass (poster shows, copy clear of bottom, no overlap).
- Impeccable detector once over the changed UI files, mechanical findings fixed.
- `next build` succeeds with static export; the design-contract HTML comment survives in `out/index.html`.

## 8. Environment prerequisites (user side)

Network allow-list must include api.kie.ai, fal.run, queue.fal.run, v3.fal.media, rest.alpha.fal.ai, cdn.jsdelivr.net, cdnjs.cloudflare.com, unpkg.com. Environment variables `FAL_KEY` and `KIE_API_KEY`. Both are set in the cloud environment's settings and take effect in a new session.
