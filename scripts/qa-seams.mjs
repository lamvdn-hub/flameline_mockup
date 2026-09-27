#!/usr/bin/env node
// Seam, scrub, reduced-motion and phone QA against the static export.
// Requires all four clips in public/assets/manifest.json (run after encode.mjs).
import { mkdir, readFile } from "node:fs/promises";
import { serveStatic, launch } from "./qa-smoke.mjs";

const PORT = Number(process.env.QA_PORT || 4176);
const VH = 900;
const SCROLLS = [1.7, 1.4, 1.4, 1.8]; // spec pacing per scene, in viewport heights
const fail = (m) => { console.error("SEAMS FAIL:", m); process.exitCode = 1; };
const at = (page, y) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);

const manifest = JSON.parse(await readFile("public/assets/manifest.json", "utf8"));
if (Object.keys(manifest.clips).length < 4) { console.error("qa-seams: needs 4 clips in the manifest; run scripts/encode.mjs first"); process.exit(4); }

const server = await serveStatic("out", PORT);
const browser = await launch();
await mkdir(".impeccable/review", { recursive: true });

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
    await at(page, seam - 0.05 * VH); await page.waitForTimeout(400);
    await page.screenshot({ path: `.impeccable/review/seam${k + 1}-before.png` });
    await at(page, seam + 0.05 * VH); await page.waitForTimeout(400);
    await page.screenshot({ path: `.impeccable/review/seam${k + 1}-after.png` });
  }

  const mid1 = SCROLLS[0] * VH + (SCROLLS[1] * VH) / 2;
  await at(page, mid1); await page.waitForTimeout(700);
  const ratio = await page.evaluate(() => { const v = document.querySelectorAll(".sw-scene__video")[1]; return v ? v.currentTime / v.duration : -1; });
  if (ratio < 0.4 || ratio > 0.6) fail(`scrub does not track scroll: section 1 at mid-leg is ${ratio.toFixed(2)} of duration`);

  await at(page, 0); await page.waitForTimeout(400);
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
console.log(process.exitCode ? "seams: FAILED" : "seams: PASS");
