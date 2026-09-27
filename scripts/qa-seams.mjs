#!/usr/bin/env node
// Seam, scrub, reduced-motion and phone QA against the static export.
// Requires all four clips in public/assets/manifest.json (run after encode.mjs).
import { mkdir, readFile, cp, rm } from "node:fs/promises";
import { join } from "node:path";
import { serveStatic, launch } from "./qa-smoke.mjs";
import { ffmpeg, vp9ShimArgs } from "./lib/ffmpeg.mjs";

const PORT = Number(process.env.QA_PORT || 4176);
const VH = 900;
const SCROLLS = [1.7, 1.4, 1.4, 1.8]; // spec pacing per scene, in viewport heights
const fail = (m) => { console.error("SEAMS FAIL:", m); process.exitCode = 1; };
const at = (page, y) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
// The engine lerps toward the scroll target and never queues a seek while the
// decoder is busy, so a capture is valid only once every clip has stopped
// seeking for a few consecutive frames. Software decode in headless Chromium
// can take seconds to get there; a real browser with hardware decode takes ms.
async function settle(page, ms = 15000) {
  const deadline = Date.now() + ms;
  let idle = 0;
  while (Date.now() < deadline) {
    const seeking = await page.evaluate(() => [...document.querySelectorAll(".sw-scene__video")].some((v) => v.seeking));
    idle = seeking ? 0 : idle + 1;
    if (idle >= 4) return true;
    await page.waitForTimeout(150);
  }
  return false;
}

const manifest = JSON.parse(await readFile("public/assets/manifest.json", "utf8"));
if (Object.keys(manifest.clips).length < 4) { console.error("qa-seams: needs 4 clips in the manifest; run scripts/encode.mjs first"); process.exit(4); }

const browser = await launch();
await mkdir(".impeccable/review", { recursive: true });

// Playwright's Chromium ships without H.264. When it cannot decode avc1, test
// the real page against a scratch copy of the export whose clips are VP9.
let root = "out";
let shim = "";
{
  const page = await browser.newPage();
  const canAvc = await page.evaluate(() => document.createElement("video").canPlayType('video/mp4; codecs="avc1.64001f"'));
  await page.close();
  if (!canAvc) {
    root = ".next/qa-vp9-shim/out";
    await rm(root, { recursive: true, force: true });
    await cp("out", root, { recursive: true });
    for (const id of Object.keys(manifest.clips)) {
      const rel = manifest.clips[id].replace(/^\//, "");
      await ffmpeg(vp9ShimArgs(join("out", rel), join(root, rel)));
    }
    shim = " (VP9 shim: this Chromium has no H.264 decoder; clips transcoded for QA only, shipped assets unchanged)";
    console.error("qa-seams NOTICE:" + shim);
  }
}
const server = await serveStatic(root, PORT);

// ---- desktop: clips load, seams hold, scrub tracks ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: VH } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  const total = SCROLLS.reduce((a, b) => a + b, 0) * VH;
  // walk the film slowly so every clip lazy-loads
  for (let y = 0; y <= total; y += VH / 2) { await at(page, y); await page.waitForTimeout(120); }
  await at(page, 0);
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    const n = await page.evaluate(() => document.querySelectorAll(".sw-scene.has-clip").length);
    if (n >= 4) break;
    await page.waitForTimeout(500);
  }
  const loaded = await page.evaluate(() => document.querySelectorAll(".sw-scene.has-clip").length);
  if (loaded < 4) fail(`only ${loaded}/4 clips painted`);

  const seek = await page.evaluate(() => [...document.querySelectorAll(".sw-scene__video")].map((v) => v.seekable.length > 0 && v.seekable.end(0) > 0));
  if (!seek.every(Boolean)) fail(`seekable ranges: ${JSON.stringify(seek)}`);

  let seam = 0;
  for (let k = 0; k < 3; k++) {
    seam += SCROLLS[k] * VH;
    await at(page, seam - 0.05 * VH); if (!(await settle(page))) fail(`seam ${k + 1} before: clips still seeking after 15 s`);
    await page.screenshot({ path: `.impeccable/review/seam${k + 1}-before.png` });
    await at(page, seam + 0.05 * VH); if (!(await settle(page))) fail(`seam ${k + 1} after: clips still seeking after 15 s`);
    await page.screenshot({ path: `.impeccable/review/seam${k + 1}-after.png` });
  }

  const mid1 = SCROLLS[0] * VH + (SCROLLS[1] * VH) / 2;
  await at(page, mid1); if (!(await settle(page))) fail("mid-leg: clips still seeking after 15 s");
  const ratio = await page.evaluate(() => { const v = document.querySelectorAll(".sw-scene__video")[1]; return v ? v.currentTime / v.duration : -1; });
  if (ratio < 0.4 || ratio > 0.6) fail(`scrub does not track scroll: section 1 at mid-leg is ${ratio.toFixed(2)} of duration`);

  // finale: scene 4 at 70% of its leg, copy held, the CTA pair in the world's treatment
  const finaleY = (SCROLLS[0] + SCROLLS[1] + SCROLLS[2]) * VH + 0.7 * SCROLLS[3] * VH;
  await at(page, finaleY); if (!(await settle(page))) fail("finale: clips still seeking after 15 s");
  const cta = await page.evaluate(() => [...document.querySelectorAll(".sw-btn")].map((b) => {
    const cs = getComputedStyle(b); const r = b.getBoundingClientRect();
    return { text: b.textContent, visible: r.width > 0 && r.height > 0 && cs.opacity !== "0", radius: cs.borderRadius, font: cs.fontFamily, href: b.getAttribute("href") };
  }));
  if (cta.length !== 2) fail(`finale: expected 2 CTA buttons, found ${cta.length}`);
  for (const b of cta) {
    if (!b.visible) fail(`finale: CTA "${b.text}" not visible`);
    if (b.radius !== "0px") fail(`finale: CTA "${b.text}" has rounded corners (${b.radius})`);
    if (!/JetBrains Mono/i.test(b.font)) fail(`finale: CTA "${b.text}" is not set in the mono face (${b.font})`);
  }
  const copyOp = await page.evaluate(() => getComputedStyle(document.querySelectorAll(".sw-copy")[3]).opacity);
  if (Number(copyOp) < 0.95) fail(`finale: scene 4 copy not held (opacity ${copyOp})`);
  await page.screenshot({ path: ".impeccable/review/finale.png" });

  await at(page, 0); await settle(page);
  await page.screenshot({ path: ".impeccable/review/desktop.png" });
  await page.screenshot({ path: ".impeccable/review/hero-repro.png" });
  if (errors.length) fail(`console errors:\n${errors.join("\n")}`);
  await page.close();
}

// ---- reduced motion: stills only ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: VH }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  const total = SCROLLS.reduce((a, b) => a + b, 0) * VH;
  for (let y = 0; y <= total; y += VH / 2) { await at(page, y); await page.waitForTimeout(80); }
  const videos = await page.evaluate(() => document.querySelectorAll("video").length);
  if (videos !== 0) fail(`reduced motion created ${videos} video elements`);
  await at(page, 0); await page.waitForTimeout(200);
  const visible = await page.locator(".sw-copy__title").first().isVisible();
  if (!visible) fail("reduced motion: hero title not visible");
  await ctx.close();
}

// ---- phone sanity ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const still = await page.locator(".sw-scene__still").first().isVisible();
  if (!still) fail("phone: first still not visible");
  const box = await page.locator(".sw-copy").first().boundingBox();
  if (!box || box.y + box.height > 844 - 40) fail(`phone: copy bottom at ${box ? box.y + box.height : "?"}, expected above ${844 - 40}`);
  await page.screenshot({ path: ".impeccable/review/mobile.png" });
  await ctx.close();
}

await browser.close();
server.close();
console.log((process.exitCode ? "seams: FAILED" : "seams: PASS") + shim);
