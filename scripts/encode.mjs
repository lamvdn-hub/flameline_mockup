#!/usr/bin/env node
// Encode rendered legs for scrubbing and stills to webp posters, then rewrite the manifest.
//   node scripts/encode.mjs [--posters] [--legs]   (default: both)
import { stat } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { ffmpeg, encodeArgs, posterArgs } from "./lib/ffmpeg.mjs";
import { legPlan } from "./lib/chain.mjs";
import { writeManifest } from "./lib/manifest.mjs";
import { parseArgs, SCENE_IDS } from "./lib/cli.mjs";

const exists = (p) => stat(p).then(() => true, () => false);
const size = async (p) => `${((await stat(p)).size / 1048576).toFixed(1)} MB`;

const args = parseArgs(process.argv.slice(2));
const doPosters = args.posters || !args.legs;
const doLegs = args.legs || !args.posters;
await mkdir("public/assets/vid", { recursive: true });
await mkdir("public/assets/stills", { recursive: true });

if (doLegs) {
  for (const leg of legPlan(SCENE_IDS, { workDir: "generations", assetsDir: "public/assets" })) {
    if (!(await exists(leg.raw))) { console.log(`leg ${leg.id}: no raw render, skipped`); continue; }
    await ffmpeg(encodeArgs(leg.raw, leg.encoded));
    console.log(`enc ${leg.encoded} ${await size(leg.encoded)}`);
  }
}
if (doPosters) {
  for (const id of SCENE_IDS) {
    const png = `generations/still_${id}.png`;
    if (!(await exists(png))) { console.log(`still ${id}: no render, skipped`); continue; }
    const webp = `public/assets/stills/${id}.webp`;
    await ffmpeg(posterArgs(png, webp));
    console.log(`poster ${webp} ${await size(webp)}`);
  }
}
const manifest = await writeManifest("public", SCENE_IDS);
console.log("manifest:", JSON.stringify(manifest));
