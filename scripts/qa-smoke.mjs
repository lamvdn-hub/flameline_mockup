#!/usr/bin/env node
// Smoke QA against the static export: serves out/, loads the page in Chromium,
// checks the hero copy, scrolls through the film, asserts the end state and a
// clean console, and writes .impeccable/review/desktop.png.
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const OUT = "out";
const PORT = Number(process.env.QA_PORT || 4173);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp4": "video/mp4", ".png": "image/png", ".woff2": "font/woff2", ".ico": "image/x-icon", ".txt": "text/plain" };

export function serveStatic(root, port) {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    let file = join(root, p);
    try {
      const s = await stat(file);
      if (s.isDirectory()) file = join(file, "index.html");
    } catch {
      if (!extname(file)) file = join(root, p + ".html");
    }
    try {
      const data = await readFile(file);
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
      res.end(data);
    } catch {
      res.writeHead(404); res.end("not found");
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

export async function launch() {
  try { return await chromium.launch(); }
  catch { return chromium.launch({ executablePath: process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }); }
}

const fail = (msg) => { console.error("SMOKE FAIL:", msg); process.exitCode = 1; };

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = await serveStatic(OUT, PORT);
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });

  const title = await page.locator(".sw-copy__title").first().textContent().catch(() => null);
  if (!title || !title.includes("The line from")) fail(`hero title missing or wrong: ${JSON.stringify(title)}`);

  await mkdir(".impeccable/review", { recursive: true });
  await page.waitForTimeout(400);
  await page.screenshot({ path: ".impeccable/review/desktop.png", fullPage: false });

  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 1; i <= 8; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round((total * i) / 8));
    await page.waitForTimeout(150);
  }
  const ended = await page.evaluate(() => !!document.querySelector(".sw-root")?.classList.contains("sw-ended"));
  if (!ended) fail("sw-ended not set after scrolling to the bottom");
  await page.screenshot({ path: ".impeccable/review/desktop-end.png", fullPage: false });

  if (errors.length) fail(`console errors:\n${errors.join("\n")}`);
  await browser.close();
  server.close();
  console.log(process.exitCode ? "smoke: FAILED" : "smoke: PASS");
}
