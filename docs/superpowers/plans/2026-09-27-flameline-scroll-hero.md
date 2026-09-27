# Flameline Scroll-Scrubbed Hero Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A statically exported Next.js demo landing page for Flameline AB whose hero is a scroll-scrubbed, four-scene continuous camera film, with placeholder-grade body sections, plus the scripts that generate, chain, encode and QA the film's assets.

**Architecture:** The scroll-world scrub engine (vanilla JS) is adapted into an ES module and mounted from one client component; a pure `buildConfig` turns the scene list plus an asset manifest into the engine config, so the page renders on placeholder SVGs, then stills, then clips without code changes. Asset generation is a separate set of Node scripts: pure libraries (prompts, chain order, manifest) under test, thin paid CLIs (fal stills, Kie Kling legs) that are gated on user approval and require network access this container does not yet have.

**Tech Stack:** Next.js 16 (App Router, TypeScript, `output: "export"`), plain CSS custom properties, vitest + jsdom, Playwright (pre-installed Chromium), Node 22 ESM scripts, ffmpeg-static, fal.ai REST, Kie AI REST.

**Spec:** `docs/superpowers/specs/2026-09-27-flameline-scroll-hero-design.md`

## Global Constraints

- Next.js 16, TypeScript, App Router, `output: "export"`, `images: { unoptimized: true }`. No Tailwind. No `src/` dir. Import alias `@/*`.
- Tokens, verbatim, as CSS custom properties: `--ground #0c0a08`, `--panel #14110e`, `--line #3a312a`, `--ember #d49152`, `--amber #e7b46a`, `--bronze #b89968`, `--cream #e9e2d3`, `--muted #c9bfa8`, `--dim #6f6350`, `--oxblood #8b2d20`.
- Fonts: Cormorant Garamond (300, 400, 500, 600, italic 300/400), Inter Tight (300, 400, 500, 600), JetBrains Mono (300, 400). Square corners everywhere. Hairline rules `1px solid var(--line)`.
- Engine overrides: `--sw-bg` = ground, `--sw-ink` = cream, `--sw-ink-soft` = muted, `--sw-accent` = ember, display font Cormorant Garamond, body Inter Tight, mono JetBrains Mono.
- Scenes in this order and with these ids: `field`, `gallery`, `humidor`, `light`. Copy exactly as the spec's table (section 4). Titles: "leaf" italic ember in scene 1 only.
- Pacing: `diveScroll` 1.4, `crossfade` 0.08, `connectors: []`; field `scroll` 1.7 `linger` 0.35; gallery and humidor `linger` 0.25; light `scroll` 1.8 `linger` 0.45. `nav: false`, `atmosphere: false`, `hint: "scroll"`, no `brand`.
- Kling 3.0 on Kie: model `kling-3.0/video`, `duration: "10"`, `aspect_ratio: "16:9"`, `mode: "pro"`, one `image_urls` entry. One model and one mode for every leg.
- Encode: `-an -vf unsharp=5:5:0.8:5:5:0.0 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart`. Posters webp 1800 px wide, quality 84.
- Stills: 16:9, no faces, no text, letters or logos; hands allowed in `gallery` only. One byte-identical preamble.
- No paid API call runs without the user's explicit go for that phase (drafts, finals, legs). Quote the estimate first.
- Motion: one authored moment (the film). No bounce or elastic easing, no hover scale, no per-section scroll reveals beyond a single 300 ms opacity fade.
- Every generated raster or clip has a JSON sidecar `{model, prompt, refs, params, created}` beside it.
- Commit after each task with a conventional message; never commit `.env`, raw `generations/*.mp4|png`, `node_modules`, `out`, `.next`.

## Review Focus

1. The visitor scrolls past the end of the film: the finale copy, route rail, scroll hint, progress bar and copy scrim must be gone over the body sections. Pinned by Task 3's `sw-ended` test.
2. A clip URL 404s or only some clips exist: the still stays up, nothing throws, the scroll continues. Pinned by Task 2's `buildConfig` omission test and Task 4's console-clean Playwright run on a manifest with no clips.
3. `prefers-reduced-motion: reduce`: no `<video>` is created, stills dissolve, copy still appears. Pinned by Task 10.
4. CTA anchors `#experience` and `#b2b` must land on sections that exist in the built page. Pinned by Task 5.
5. Prompt drift between scenes: every still prompt must start with the identical preamble, and every leg prompt must carry both handoff clauses verbatim. Pinned by Task 6.

---

### Task 1: Scaffold the Next.js static-export project with tokens, fonts and the design contract

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `vitest.config.ts`, `tests/build.test.ts`
- Modify: `.gitignore` (already lists node_modules, .next, out, generations)

**Interfaces:**
- Produces: CSS custom properties from Global Constraints on `:root`; class hooks `.mono`, `.display`, `.kicker`, `.rule` in `globals.css`; `app/page.tsx` default export composing sections (empty placeholders for now).

- [ ] **Step 1: Scaffold**

Run from the repo root (it must not create a subfolder):
```bash
npx --yes create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm --skip-install --yes
npm install
npm install -D vitest jsdom @vitest/coverage-v8 playwright ffmpeg-static
```
If create-next-app refuses a non-empty directory, run it into `/tmp/scaffold` and move `app`, `public`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `next-env.d.ts` into the repo root. Delete the scaffold's sample `app/page.module.css`, `public/*.svg`.

- [ ] **Step 2: Configure static export**

`next.config.ts`: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: false`.

- [ ] **Step 3: Write the failing build test**

`tests/build.test.ts` (vitest, node environment):
```ts
import { existsSync, readFileSync } from "node:fs";
test("static export exists and carries the design contract", () => {
  expect(existsSync("out/index.html")).toBe(true);
  const html = readFileSync("out/index.html", "utf8");
  expect(html).toContain("THESIS:");
  expect(html).toContain("FINISH:");
  expect(html).toContain("--ember: #d49152");
});
```
`vitest.config.ts`: `test: { include: ["tests/**/*.test.ts"], environment: "node" }`. Add scripts: `"test": "vitest run"`, `"build": "next build"`, `"qa": "node scripts/qa-seams.mjs"`.

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test -- tests/build.test.ts`
Expected: FAIL, `out/index.html` missing.

- [ ] **Step 5: Layout, fonts, tokens, contract**

`app/layout.tsx`: load the three faces with `next/font/google` (weights per Global Constraints, `display: "swap"`, CSS variables `--font-display`, `--font-body`, `--font-mono`) and apply them on `<html>`. Metadata title `Flameline · Premium Cigar Distribution`. As the first child of `<body>`, render the design contract as an HTML comment via `<div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />` where `CONTRACT` is a `<!-- ... -->` string with five blocks, 150 words max: THESIS (a continuous camera flight from leaf to light replaces the hero-grid-plus-cards default), OWN-WORLD (near-black ground, ember key light, Cormorant display, mono labels, hairlines, square corners, grain), STORY (a distributor understands one house holds the whole line and enters the portal), FIRST VIEWPORT (full-bleed field still, copy pinned left 42vw, nav fixed top, route rail right, hint bottom), FORM (photoreal continuous walkthrough, scroll-world architecture A), then `FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance`.
If `next build` cannot fetch Google Fonts, replace `next/font/google` with the prototype's `<link rel="preconnect">` + `<link href="https://fonts.googleapis.com/css2?...">` tags in `<head>` and set the three font variables in `globals.css` directly.

`app/globals.css`: `:root` tokens (Global Constraints, exact hex, one per line as `--ember: #d49152;` so the test's substring matches), engine overrides (`--sw-*`), reset, `body { background: var(--ground); color: var(--cream); font: 300 16px/1.55 var(--font-body); letter-spacing: 0.01em; }`, the prototype's `body::before` SVG grain overlay at `opacity: .5; mix-blend-mode: overlay; z-index: 9999; pointer-events: none`, `::selection`, and utility classes `.mono` (JetBrains Mono, 10.5px, tracking .22em, uppercase), `.display` (Cormorant, weight 300), `.kicker` (mono + muted), `.rule` (flex 1, 1px, line). Type scale from base 16 and ratio 1.25 for body sizes; display sizes use `clamp()` as in the prototype.

`app/page.tsx`: `export default function Page()` returning `<main>` with a placeholder `<section id="hero" />` for now.

- [ ] **Step 6: Build and run the test**

Run: `npm run build && npm test -- tests/build.test.ts`
Expected: build succeeds, `out/index.html` written, test PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js static export with Flameline tokens, fonts and design contract"
```

---

### Task 2: Scene data and the pure engine-config builder

**Files:**
- Create: `lib/scroll-world/scenes.ts`, `lib/scroll-world/config.ts`, `tests/config.test.ts`

**Interfaces:**
- Produces:
```ts
// scenes.ts
export type SceneId = "field" | "gallery" | "humidor" | "light";
export type Cta = { primary: { label: string; href: string }; secondary?: { label: string; href: string } };
export type Scene = { id: SceneId; label: string; eyebrow: string; title: string; titleEm?: string; body: string; tags: string[]; scroll?: number; linger?: number; cta?: Cta };
export const SCENES: readonly Scene[];   // 4 entries, spec section 4 table, in order
export const SCENE_IDS: readonly SceneId[];
// config.ts
export type Manifest = { stills: Partial<Record<SceneId, string>>; clips: Partial<Record<SceneId, string>> };
export type EngineSection = { id: string; label: string; still: string; clip?: string; accent: string; eyebrow: string; titleHtml: string; body: string; tags: string[]; scroll?: number; linger?: number; cta?: Cta };
export type EngineConfig = { diveScroll: 1.4; crossfade: 0.08; connectors: []; nav: false; atmosphere: false; hint: "scroll"; sections: EngineSection[] };
export function titleToHtml(title: string, em?: string): string;  // escapes, wraps `em` substring in <em>
export function placeholderStill(id: SceneId): string;           // `/assets/stills/placeholder-${id}.svg`
export function buildConfig(scenes: readonly Scene[], manifest: Manifest): EngineConfig;
```

- [ ] **Step 1: Write the failing tests**

`tests/config.test.ts`:
```ts
import { SCENES, SCENE_IDS } from "@/lib/scroll-world/scenes";
import { buildConfig, titleToHtml, placeholderStill } from "@/lib/scroll-world/config";
test("four scenes in order with spec copy", () => {
  expect(SCENE_IDS).toEqual(["field", "gallery", "humidor", "light"]);
  expect(SCENES[0].title).toBe("The line from leaf to light.");
  expect(SCENES[0].titleEm).toBe("leaf");
  expect(SCENES[3].cta?.primary).toEqual({ label: "Explore the cigar experience", href: "#experience" });
  expect(SCENES[3].cta?.secondary).toEqual({ label: "B2B partner login", href: "#b2b" });
});
test("titleToHtml escapes and wraps the em", () => {
  expect(titleToHtml("The line from leaf to light.", "leaf")).toBe("The line from <em>leaf</em> to light.");
  expect(titleToHtml("a < b")).toBe("a &lt; b");
});
test("buildConfig omits clip when missing and falls back to placeholder still", () => {
  const cfg = buildConfig(SCENES, { stills: { field: "/assets/stills/field.webp" }, clips: { field: "/assets/vid/field.mp4" } });
  expect(cfg.connectors).toEqual([]);
  expect(cfg.diveScroll).toBe(1.4);
  expect(cfg.sections[0]).toMatchObject({ id: "field", still: "/assets/stills/field.webp", clip: "/assets/vid/field.mp4", scroll: 1.7, linger: 0.35 });
  expect(cfg.sections[1].clip).toBeUndefined();
  expect(cfg.sections[1].still).toBe(placeholderStill("gallery"));
  expect(cfg.sections[3]).toMatchObject({ scroll: 1.8, linger: 0.45 });
  expect(cfg.sections.every(s => s.accent === "#d49152")).toBe(true);
});
```
Add `resolve.alias["@"] = __dirname` in `vitest.config.ts`.

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/config.test.ts` — Expected: FAIL, modules not found.

- [ ] **Step 3: Implement `scenes.ts` and `config.ts`** per the Interfaces block, copy verbatim from spec section 4, `linger` 0.25 on gallery and humidor, `accent` ember on all.

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- tests/config.test.ts` — Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib tests/config.test.ts vitest.config.ts
git commit -m "feat: scene data and pure engine config builder"
```

---

### Task 3: Adapt the scrub engine as an ES module with the demo's behaviour changes

**Files:**
- Create: `lib/scroll-world/scrub-engine.js` (copied from `.claude/skills/scroll-world/references/scrub-engine.js`, then modified), `tests/engine.test.ts`

**Interfaces:**
- Produces: `export function mountScrollWorld(container: HTMLElement, config: EngineConfig): () => void` (returns an unmount function that removes listeners and the injected DOM). Section field `titleHtml` (pre-escaped HTML) is rendered instead of `title`. Container gets class `sw-ended` when `scrollY > lastSegment.end + 0.5 * vh`.

- [ ] **Step 1: Write the failing tests** (vitest environment `jsdom` via `// @vitest-environment jsdom` pragma; stub `window.matchMedia = () => ({ matches: false, addEventListener(){}, removeEventListener(){} })` and `requestAnimationFrame = cb => setTimeout(cb, 0)` in a `beforeEach`)

`tests/engine.test.ts`:
```ts
import { mountScrollWorld } from "@/lib/scroll-world/scrub-engine.js";
import { buildConfig } from "@/lib/scroll-world/config";
import { SCENES } from "@/lib/scroll-world/scenes";
const mount = () => { const el = document.createElement("div"); document.body.appendChild(el); const un = mountScrollWorld(el, buildConfig(SCENES, { stills: {}, clips: {} })); return { el, un }; };
test("no topbar when brand, nav and cta are absent", () => { const { el } = mount(); expect(el.querySelector(".sw-topbar")).toBeNull(); });
test("title renders titleHtml with the em", () => { const { el } = mount(); expect(el.querySelector(".sw-copy__title")!.innerHTML).toBe("The line from <em>leaf</em> to light."); });
test("sw-ended is set past the film and the finale copy fades", () => {
  const { el } = mount();
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  window.dispatchEvent(new Event("resize"));
  const total = (1.7 + 1.4 + 1.4 + 1.8) * 1000;
  window.scrollY = total + 600; window.dispatchEvent(new Event("scroll"));
  return new Promise(r => setTimeout(r, 10)).then(() => {
    expect(el.classList.contains("sw-ended")).toBe(true);
    const copies = el.querySelectorAll(".sw-copy");
    expect(Number((copies[3] as HTMLElement).style.opacity)).toBe(0);
  });
});
test("unmount removes injected nodes", () => { const { el, un } = mount(); un(); expect(el.querySelector(".sw-stage")).toBeNull(); });
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/engine.test.ts` — Expected: FAIL (module missing).

- [ ] **Step 3: Copy the engine and apply exactly these modifications**

1. Replace the trailing `module.exports` / `window.mountScrollWorld` lines with `export { mountScrollWorld };`.
2. Return an unmount function: remove `scroll`, `resize`, `orientationchange`, `load`, `pointerdown`, `touchstart` listeners, cancel the rAF loop with a `stopped` flag, and `container.replaceChildren()`.
3. Only create and append `topbar` when `config.brand || config.nav !== false || (config.cta && config.cta.label)`.
4. In the copy template, render `s.titleHtml` unescaped when present, else `esc(s.title)`.
5. In `read()`: compute `lastEnd = SEGMENTS[NSEG-1].end`; `container.classList.toggle('sw-ended', y > lastEnd + 0.5 * vh)`. For `i === N-1`: `cop = before ? 0 : (y > seg.end ? smooth(1 - (y - seg.end) / (0.5 * vh)) : smooth(pr / 0.4))`.
6. Add to injected CSS: `.sw-root.sw-ended .sw-route,.sw-root.sw-ended .sw-hint,.sw-root.sw-ended .sw-scrollbar,.sw-root.sw-ended .sw-copylayer::before{opacity:0;pointer-events:none;transition:opacity .3s}` and `.sw-scrollbar{transition:opacity .3s}`.
7. Theming to the design system inside the injected CSS: fonts from `--sw-font-display`, `--sw-font-body`, and a new `--sw-font-mono` used by `.sw-copy__num`, `.sw-copy__eyebrow`, `.sw-copy__tags li`, `.sw-hint`, `.sw-route__label`, `.sw-btn`; `border-radius: 0` on `.sw-copy__tags li`, `.sw-btn`, `.sw-route__label`; `.sw-btn--primary{background:var(--sw-accent);color:var(--sw-bg)}`, `.sw-btn--ghost{border:1px solid color-mix(in srgb,var(--sw-ink) 25%,transparent);color:var(--sw-ink)}`; remove the `translateY(-2px)` hover transforms; eyebrow letter-spacing .22em, size 10.5px, weight 400; title weight 300, `font-size: clamp(2.6rem, 5.4vw, 5rem)`, line-height .98, letter-spacing -.02em; `.sw-copy__title em{font-style:italic;color:var(--sw-accent)}`.

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- tests/engine.test.ts` — Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scroll-world/scrub-engine.js tests/engine.test.ts
git commit -m "feat: adapt scroll-world engine as ESM with end-state, titleHtml and dark theming"
```

---

### Task 4: HeroFilm client component, placeholder stills, first visual smoke test

**Files:**
- Create: `components/HeroFilm.tsx`, `public/assets/stills/placeholder-field.svg`, `public/assets/stills/placeholder-gallery.svg`, `public/assets/stills/placeholder-humidor.svg`, `public/assets/stills/placeholder-light.svg`, `public/assets/manifest.json`, `scripts/qa-smoke.mjs`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `mountScrollWorld`, `buildConfig`, `SCENES`, `Manifest`.
- Produces: `export default function HeroFilm({ manifest }: { manifest: Manifest })` (client component). `app/page.tsx` imports `public/assets/manifest.json` at build time and passes it. `manifest.json` shape is `Manifest`; initial content `{ "stills": {}, "clips": {} }`.

- [ ] **Step 1: Write the placeholder SVGs**

Each 1920×1080 `viewBox`, background `#0c0a08`, a diagonal linear gradient from `#14110e` to `#0c0a08`, one radial ember glow (`#d49152` at 18% opacity to transparent) positioned differently per scene (field: low right; gallery: centre left; humidor: top centre; light: centre), a hairline `#3a312a` horizon at 62% height, no text.

- [ ] **Step 2: Write the smoke script**

`scripts/qa-smoke.mjs`: serve `out/` with `npx serve -l 4173 out` (or Node `http` static handler) in-process, launch Playwright Chromium (`executablePath` from `process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` when `chromium.launch()` fails), 1440×900, collect `console.error` and `pageerror`, load `http://localhost:4173/`, assert `.sw-copy__title` text contains "The line from", scroll to `document.body.scrollHeight` in 8 steps, assert `document.querySelector('.sw-root').classList.contains('sw-ended')` at the end, assert zero console errors, write `.impeccable/review/desktop.png` (full page from top) and exit 1 on any failure.

- [ ] **Step 3: Run smoke to verify it fails**

Run: `npm run build && node scripts/qa-smoke.mjs` — Expected: FAIL, `.sw-copy__title` not found.

- [ ] **Step 4: Implement `HeroFilm.tsx`**

`"use client"`. `useEffect` mounts `mountScrollWorld(ref.current, buildConfig(SCENES, manifest))` and returns the unmount. Server markup inside the container: a `<noscript>`-free progressive fallback: four `<section>`s each with the placeholder `<img>` and the copy (`h2` with `dangerouslySetInnerHTML={titleToHtml(...)}`), hidden with a `.sw-fallback` class that the mount replaces (the engine's `replaceChildren` at unmount and the initial `container.replaceChildren()` before build, add that call at the top of `mountScrollWorld`). `app/page.tsx`: `import manifest from "@/public/assets/manifest.json"` and render `<HeroFilm manifest={manifest as Manifest} />`; add `"resolveJsonModule": true` to tsconfig if absent.

- [ ] **Step 5: Build and run smoke**

Run: `npm run build && node scripts/qa-smoke.mjs` — Expected: PASS, screenshot written. Open `.impeccable/review/desktop.png` and confirm the field placeholder, headline with italic ember "leaf", route rail, and hint are visible.

- [ ] **Step 6: Commit**

```bash
git add components public/assets scripts/qa-smoke.mjs app/page.tsx tsconfig.json
git commit -m "feat: HeroFilm client component with placeholder stills and smoke QA"
```

---

### Task 5: Nav, body sections and footer from the prototype

**Files:**
- Create: `components/Nav.tsx`, `components/Pathways.tsx`, `components/EventsTeaser.tsx`, `components/TradeBand.tsx`, `components/Footer.tsx`, `components/ImageSlot.tsx`, `tests/anchors.test.ts`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Produces: sections with ids `experience` (Pathways), `events` (EventsTeaser), `b2b` (TradeBand). `ImageSlot({ label, ratio })` renders a dashed `var(--line)` box with a mono label.

- [ ] **Step 1: Write the failing test**

`tests/anchors.test.ts`:
```ts
import { readFileSync } from "node:fs";
test("CTA anchors resolve to sections in the export", () => {
  const html = readFileSync("out/index.html", "utf8");
  for (const id of ["experience", "events", "b2b"]) expect(html).toContain(`id="${id}"`);
  expect(html).toContain("Three ways");
  expect(html).toContain("Smoking harms your health");
});
```

- [ ] **Step 2: Run to verify failure** — `npm run build && npm test -- tests/anchors.test.ts` — Expected: FAIL.

- [ ] **Step 3: Implement the components**

Copy structure and copy from `Flameline Website v2.dc.html` lines 53–63 (Nav: fixed, `rgba(12,10,8,.92)`, `backdrop-filter: blur(8px)`, bottom hairline, wordmark button, four mono links as anchors `#hero #events #experience #b2b`, outlined "B2B Login" button; hide the link row under 860px), 95–124 (Pathways, three cards, `id="experience"`), 126–150 (EventsTeaser with the three package rows, `id="events"`; body paragraph replaced by two sentences of lorem ipsum), 152–162 (TradeBand, `id="b2b"`; paragraph lorem), 739–746 (Footer). Add one `ImageSlot` ("Lounge photo", 16:9) beside the EventsTeaser package list. Section numbering `01`, `02`, `03` in mono ember with the flex hairline. All styles in `globals.css` under section-scoped classes; spacing on the 8-point grid; the film's `<div id="hero">` wraps `HeroFilm` so the nav anchor lands at the top. Body sections sit after the film with `position: relative; z-index: 2; background: var(--ground)`.

- [ ] **Step 4: Build, test, smoke**

Run: `npm run build && npm test && node scripts/qa-smoke.mjs` — Expected: all PASS; in `.impeccable/review/desktop.png` the body sections appear below the film with no engine chrome over them.

- [ ] **Step 5: Run the design detector and fix mechanical findings**

Run: `node /root/.claude/skills/synced/7ac6d1b8-9702-4a51-92f8-6e39576553b6_cae6d5e4-a56e-4fbb-b41d-80acb9ece85e/impeccable/scripts/detect.mjs --json app components lib/scroll-world/scrub-engine.js` (use the skill's reported base dir if it differs). Fix what is mechanical; carry the rest to Task 11.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: nav, pathways, events teaser, trade band and footer from the prototype"
```

---

### Task 6: Pure pipeline libraries and committed prompt files

**Files:**
- Create: `scripts/lib/prompts.mjs`, `scripts/lib/chain.mjs`, `scripts/lib/manifest.mjs`, `prompts/preamble.txt`, `prompts/still_field.txt`, `prompts/still_gallery.txt`, `prompts/still_humidor.txt`, `prompts/still_light.txt`, `prompts/leg_field.txt`, `prompts/leg_gallery.txt`, `prompts/leg_humidor.txt`, `prompts/leg_light.txt`, `tests/pipeline.test.ts`

**Interfaces:**
- Produces:
```js
// prompts.mjs
export const PREAMBLE_PATH = "prompts/preamble.txt";
export function buildStillPrompt(preamble, subject) // `${preamble.trim()}\nSubject: ${subject.trim()}`
export const HANDOFF_OPEN = "Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward glide.";
export function handoffClose(next) // `In the final second, settle back into a slow, steady forward glide toward ${next}.`
export function buildLegPrompt({ move, into, next, styleTail }) // `${HANDOFF_OPEN} ${move} The camera moves into ${into}. ${handoffClose(next)} ${styleTail} Smooth, graceful, slow motion, subtle parallax. No text, no captions.`
// chain.mjs
export function legPlan(sceneIds, { workDir, assetsDir }) // [{ index, id, startImage, prompt: `prompts/leg_${id}.txt`, raw: `${workDir}/leg_${id}.mp4`, lastFrame: `${workDir}/last_${id}.png`, encoded: `${assetsDir}/vid/${id}.mp4` }]; startImage = `${workDir}/still_${id}.png` for index 0 else `${workDir}/last_${prev}.png`
// manifest.mjs
export function buildManifest(files, sceneIds) // files: relative paths under public/, e.g. "assets/stills/field.webp"; returns { stills: { field: "/assets/stills/field.webp" }, clips: { field: "/assets/vid/field.mp4" } } only for files present
export async function writeManifest(publicDir, sceneIds) // scans publicDir/assets, writes publicDir/assets/manifest.json, returns the manifest
```

- [ ] **Step 1: Write the failing tests**

`tests/pipeline.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { buildStillPrompt, buildLegPrompt, HANDOFF_OPEN, handoffClose } from "../scripts/lib/prompts.mjs";
import { legPlan } from "../scripts/lib/chain.mjs";
import { buildManifest } from "../scripts/lib/manifest.mjs";
const ids = ["field", "gallery", "humidor", "light"];
test("all committed still prompts start with the identical preamble", () => {
  const pre = readFileSync("prompts/preamble.txt", "utf8").trim();
  for (const id of ids) { const p = readFileSync(`prompts/still_${id}.txt`, "utf8"); expect(p.startsWith(pre)).toBe(true); expect(p).toContain("\nSubject: "); }
});
test("all committed leg prompts carry both handoff clauses", () => {
  for (const id of ids) { const p = readFileSync(`prompts/leg_${id}.txt`, "utf8"); expect(p).toContain(HANDOFF_OPEN); expect(p).toMatch(/In the final second, settle back into a slow, steady forward glide toward /); }
});
test("buildStillPrompt and buildLegPrompt shapes", () => {
  expect(buildStillPrompt("PRE\n", " a field ")).toBe("PRE\nSubject: a field");
  expect(buildLegPrompt({ move: "M.", into: "X", next: "Y", styleTail: "S." })).toBe(`${HANDOFF_OPEN} M. The camera moves into X. ${handoffClose("Y")} S. Smooth, graceful, slow motion, subtle parallax. No text, no captions.`);
});
test("legPlan chains start images from the previous last frame", () => {
  const plan = legPlan(ids, { workDir: "generations", assetsDir: "public/assets" });
  expect(plan[0].startImage).toBe("generations/still_field.png");
  expect(plan[1].startImage).toBe("generations/last_field.png");
  expect(plan[3]).toMatchObject({ index: 3, id: "light", raw: "generations/leg_light.mp4", encoded: "public/assets/vid/light.mp4" });
});
test("buildManifest lists only present files", () => {
  expect(buildManifest(["assets/stills/field.webp", "assets/vid/field.mp4", "assets/stills/placeholder-field.svg"], ids))
    .toEqual({ stills: { field: "/assets/stills/field.webp" }, clips: { field: "/assets/vid/field.mp4" } });
});
```

- [ ] **Step 2: Run to verify failure** — `npm test -- tests/pipeline.test.ts` — Expected: FAIL.

- [ ] **Step 3: Write the prompt files**

`prompts/preamble.txt` (one paragraph, used verbatim): "Ultra-photorealistic cinematic photograph, anamorphic 35mm lens, deep near-black shadows, a single warm ember-amber key light, low golden-hour sun, rich tobacco-brown and dark-cedar palette with shadows near #0c0a08 and highlights near #d49152 and #e7b46a, fine film grain, shallow depth of field, editorial luxury magazine quality, no faces, no text, no letters, no logos, 16:9 landscape composition with the focal subject centred."
Still subjects: the four from spec section 5 (field, gallery, humidor, light), each as `Subject: ...` on its own line after the preamble. Leg prompts built with `buildLegPrompt` and the four mid-leg moves from spec section 5; `into` and `next` name the scene and the next scene ("the finale: a single cigar being lit" for the last `next`, and for `leg_light` the `next` is "the ember, holding steady"); `styleTail` = the preamble's first sentence up to "film grain".

- [ ] **Step 4: Implement the three libraries** per the Interfaces block.

- [ ] **Step 5: Run to verify pass** — `npm test -- tests/pipeline.test.ts` — Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add scripts/lib prompts tests/pipeline.test.ts
git commit -m "feat: pipeline libraries (prompts, chain, manifest) and committed prompt files"
```

---

### Task 7: Still generation CLI (fal.ai) — requires network access and FAL_KEY; paid, gated

**Files:**
- Create: `scripts/lib/http.mjs`, `scripts/lib/sidecar.mjs`, `scripts/gen-stills.mjs`, `prompts/models.md`

**Interfaces:**
- Produces:
```js
// http.mjs
export async function postJson(url, body, headers) // fetch, throws on !ok with status + body text
export async function download(url, toPath)
// sidecar.mjs
export async function writeSidecar(mediaPath, { model, prompt, refs = [], params }) // writes `${mediaPath minus ext}.json` with created ISO time
// gen-stills.mjs CLI: node scripts/gen-stills.mjs --tier draft|final [--only field,gallery]
```
Draft model `google/nano-banana-2-lite` at `https://fal.run/google/nano-banana-2-lite`, body `{ prompt, aspect_ratio: "16:9", num_images: 1 }`, header `Authorization: Key ${FAL_KEY}`. Final model: confirm the current slug and request schema on fal.ai's model page before the first paid call; first candidate `fal-ai/flux-pro/v1.1-ultra` with `{ prompt, aspect_ratio: "16:9", raw: false }`; record the confirmed slug, schema and price in `prompts/models.md`. Output `generations/still_<id>.png` (final overwrites draft after the user approves finals) plus sidecar. Exit non-zero if `FAL_KEY` is unset, with the message "FAL_KEY not set: add it in the cloud environment settings".

- [ ] **Step 1: Preflight**

Run: `curl -sS -o /dev/null -w "%{http_code}\n" https://fal.run/ ; test -n "$FAL_KEY" && echo key-ok` — Expected: an HTTP code other than 000 and `key-ok`. If not, stop this task and report the environment gap.

- [ ] **Step 2: Implement `http.mjs`, `sidecar.mjs`, `gen-stills.mjs`.**

- [ ] **Step 3: Quote and get the go**

State to the user: 4 drafts on Nano Banana 2 Lite, about $0.16 total. Wait for an explicit go.

- [ ] **Step 4: Draft run**

Run: `node scripts/gen-stills.mjs --tier draft` — Expected: 4 PNGs and 4 JSON sidecars in `generations/`. Open all four side by side; they must share light direction, grade and lens. Re-roll off-style ones with `--only <id>`.

- [ ] **Step 5: Quote finals and get the go** (4 images on the confirmed pro model, state the price from `prompts/models.md`). Run `node scripts/gen-stills.mjs --tier final`. Inspect again.

- [ ] **Step 6: Posters and manifest**

Run: `node scripts/encode.mjs --posters` (Task 9 ships this flag; if executing before Task 9, run the equivalent ffmpeg webp command from Global Constraints per still) then `node -e "import('./scripts/lib/manifest.mjs').then(m => m.writeManifest('public', ['field','gallery','humidor','light']))"` and `npm run build && node scripts/qa-smoke.mjs` — Expected: manifest lists 4 stills, smoke PASS, screenshot shows the real field still.

- [ ] **Step 7: Commit**

```bash
git add scripts prompts/models.md public/assets generations/*.json
git commit -m "feat: fal still generation CLI; final stills and posters"
```

---

### Task 8: Leg generation CLI (Kie AI, Kling 3.0 pro) with frame handoff — requires network and KIE_API_KEY; paid, gated

**Files:**
- Create: `scripts/lib/upload.mjs`, `scripts/lib/ffmpeg.mjs`, `scripts/gen-legs.mjs`, `tests/ffmpeg.test.ts`

**Interfaces:**
- Produces:
```js
// ffmpeg.mjs
export const FFMPEG // path from ffmpeg-static
export async function lastFrame(videoPath, pngPath) // `-sseof -0.15 -i video -frames:v 1 -q:v 2 png`
export async function firstFrame(videoPath, pngPath)
export function encodeArgs(inPath, outPath) // returns the argv array from Global Constraints (pure)
export function posterArgs(pngPath, webpPath) // `-vf scale=1800:-2 -c:v libwebp -quality 84` (pure)
// upload.mjs
export async function uploadPublic(filePath) // returns https URL; fal storage (initiate at https://rest.alpha.fal.ai/storage/upload/initiate, PUT bytes, return file_url) first; confirm the endpoint from fal docs before use, else Kie's upload API
// gen-legs.mjs CLI: node scripts/gen-legs.mjs --from <index> [--attempt n]
```
Per leg: `uploadPublic(startImage)` → POST `https://api.kie.ai/api/v1/jobs/createTask` with `{ model: "kling-3.0/video", input: { prompt, image_urls: [url], duration: "10", aspect_ratio: "16:9", mode: "pro" } }`, header `Authorization: Bearer ${KIE_API_KEY}` → poll `GET .../recordInfo?taskId=` every 8 s until `state` is `success` or `fail` → parse `resultJson` (a JSON string) → download to `raw` → `lastFrame(raw, lastFrame)` → sidecar. Stop after each leg and print the path of the last frame; the user or executor inspects it before `--from <index+1>`. `fail` prints the failure message and exits 2; the executor re-rolls with `--attempt`, up to 3, stripping trigger words and appending "unoccupied, architectural, tasteful" on attempt 2.

- [ ] **Step 1: Write the failing test** for the pure argv builders:
```ts
import { encodeArgs, posterArgs } from "../scripts/lib/ffmpeg.mjs";
test("encodeArgs matches the spec", () => {
  expect(encodeArgs("a.mp4", "b.mp4").join(" ")).toBe("-y -i a.mp4 -an -vf unsharp=5:5:0.8:5:5:0.0 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart b.mp4");
});
test("posterArgs", () => { expect(posterArgs("a.png", "a.webp").join(" ")).toBe("-y -i a.png -vf scale=1800:-2 -c:v libwebp -quality 84 a.webp"); });
```
Run `npm test -- tests/ffmpeg.test.ts` — Expected: FAIL. Implement `ffmpeg.mjs`. Run again — Expected: PASS.

- [ ] **Step 2: Preflight** — `curl -sS -o /dev/null -w "%{http_code}\n" https://api.kie.ai/ ; test -n "$KIE_API_KEY" && echo key-ok`; confirm `uploadPublic` against docs with one free upload of a placeholder SVG and a `curl -I` on the returned URL (200).

- [ ] **Step 3: Implement `upload.mjs` and `gen-legs.mjs`.**

- [ ] **Step 4: Quote and get the go** — 4 legs × 10 s at Kling 3.0 pro, about $17–37 including up to 4 re-rolls; state it and wait.

- [ ] **Step 5: Generate sequentially** — `node scripts/gen-legs.mjs --from 0`; open `generations/last_field.png`, confirm it reads as a calm forward-glide frame (no sideways blur, no half-finished move); then `--from 1`, `--from 2`, `--from 3`, inspecting each. Re-roll per the attempt rule.

- [ ] **Step 6: Commit** — `git add scripts tests/ffmpeg.test.ts generations/*.json && git commit -m "feat: Kie Kling leg generation with frame handoff"`

---

### Task 9: Encode, posters, manifest, rebuild

**Files:**
- Create: `scripts/encode.mjs`

**Interfaces:**
- Consumes: `legPlan`, `encodeArgs`, `posterArgs`, `writeManifest`.
- CLI: `node scripts/encode.mjs [--posters] [--legs]` (default both). Legs: for each plan entry with an existing `raw`, run `encodeArgs(raw, encoded)`. Posters: for each `generations/still_<id>.png`, run `posterArgs` to `public/assets/stills/<id>.webp`. Then `writeManifest("public", ["field","gallery","humidor","light"])` (scripts are plain ESM and do not import the TS scene module). Prints file sizes.

- [ ] **Step 1: Implement `encode.mjs`.**
- [ ] **Step 2: Run** — `node scripts/encode.mjs` — Expected: 4 mp4 under `public/assets/vid/` of roughly 6–12 MB each, 4 webp posters, manifest with 4 stills and 4 clips. `ffmpeg -i public/assets/vid/field.mp4` reports 1920×1080, no audio stream.
- [ ] **Step 3: Rebuild and smoke** — `npm run build && npm test && node scripts/qa-smoke.mjs` — Expected: PASS.
- [ ] **Step 4: Commit** — `git add scripts/encode.mjs public/assets && git commit -m "feat: encode legs and posters, regenerate manifest"`

---

### Task 10: Seam QA, reduced motion and phone pass

**Files:**
- Create: `scripts/qa-seams.mjs`
- Modify: `package.json` (`"qa": "node scripts/qa-smoke.mjs && node scripts/qa-seams.mjs"`)

**Interfaces:**
- Consumes: served `out/`, `buildConfig` pacing values to compute seam scroll positions: with `vh = 900`, seam k is at `sum(scroll of sections 0..k) * vh`.

- [ ] **Step 1: Write `qa-seams.mjs`**

Playwright, 1440×900. Load, wait for `.sw-scene.has-clip` count to reach 4 (poll up to 30 s, scrolling slowly to trigger lazy loads). For each of the 3 seams: scroll to `seam - 0.05*vh`, wait 400 ms, screenshot `.impeccable/review/seam<k>-before.png`; scroll to `seam + 0.05*vh`, wait 400 ms, screenshot `seam<k>-after.png`. Assert via `page.evaluate` that every `.sw-scene__video` has `seekable.length > 0 && seekable.end(0) > 0`, and that after scrolling to the middle of section 1 its video `currentTime` is between 40% and 60% of `duration`. Collect console errors (zero allowed). Then a second context with `reducedMotion: "reduce"`: scroll through, assert `document.querySelectorAll("video").length === 0` and `.sw-copy__title` visible. Then a 390×844 context: load, assert the first `.sw-scene__still` is visible and `.sw-copy` bounding box bottom is above `innerHeight - 40`; screenshot `.impeccable/review/mobile.png`. Exit 1 on any failure.

- [ ] **Step 2: Run** — `npm run build && npm run qa` — Expected: PASS. Open each `seam<k>-before/after` pair: same composition, prop-level differences only. A composition jump means the chain used a wrong start image; regenerate that leg (Task 8) from the correct last frame.

- [ ] **Step 3: Commit** — `git add scripts/qa-seams.mjs package.json .impeccable/review && git commit -m "test: seam, reduced-motion and phone QA"`

---

### Task 11: Finish review, design record, push

**Files:**
- Create: `DESIGN.md`, `.impeccable/review/hero-repro.png` (the hero capture from Task 10's desktop run, cropped to the first viewport)

- [ ] **Step 1: Detector** — run the Impeccable detector once more over `app components lib/scroll-world/scrub-engine.js`; fix mechanical findings.
- [ ] **Step 2: Finish review** — spawn the `impeccable-finish-reviewer` agent (fresh context) with: the original request, the spec path, the plan path, `out/index.html`, the screenshot paths in `.impeccable/review/`, the design contract text, remaining detector findings, the craft-floor reference path `/root/.claude/skills/synced/.../impeccable/reference/craft-floor.md`, and a line stating this is a code-led build with no comp. Act on its disposition: `fix` → one batch, recapture, verdict pass; `rebuild` → rebuild the named regions and re-review; `ship` → continue.
- [ ] **Step 3: Documenter** — spawn `impeccable-documenter` with project root, `app/`, `components/`, `lib/scroll-world/`, the contract, `PRODUCT.md` and the `document.md` reference path; it writes `DESIGN.md`.
- [ ] **Step 4: Provenance** — `node .../impeccable/scripts/embed-prompt.mjs --scan public/assets/stills` and clear every reported file using the sidecar prompt.
- [ ] **Step 5: Final verification** — `npm run build && npm test && npm run qa` all PASS; `git status` clean after commit.
- [ ] **Step 6: Commit and push** — `git add -A && git commit -m "docs: DESIGN.md and finish review artefacts" && git push -u origin claude/happy-archimedes-d9rbjf`

---

## Execution notes

- Tasks 1–6 and 9–11 (with placeholder assets) run in any container. Tasks 7 and 8 need `FAL_KEY`, `KIE_API_KEY` and the allow-listed hosts; they run in a session started after the environment edit.
- Each paid step quotes its estimate and waits for the user's go. Never batch drafts, finals and legs into one approval.
- If a leg keeps failing Kling's content filter after 3 attempts, set that scene's clip absent in the manifest (the still dissolve carries the seam) and report it; never swap models mid-chain.
