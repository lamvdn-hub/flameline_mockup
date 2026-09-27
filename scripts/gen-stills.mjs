#!/usr/bin/env node
// Scene stills on fal.ai.  node scripts/gen-stills.mjs --tier draft|final [--only field,gallery] [--ref <image>]
// --ref uploads a local reference frame and generates through the model's /edit endpoint (one scene at a time).
// Draft: Nano Banana 2 Lite. Final: the pro model recorded in prompts/models.md.
// Never runs without an explicit go from the user for the tier's quoted cost.
import { readFile, mkdir } from "node:fs/promises";
import { postJson, saveMedia, requireEnv } from "./lib/http.mjs";
import { writeSidecar } from "./lib/sidecar.mjs";
import { parseArgs, selectIds } from "./lib/cli.mjs";

import { stillRequest } from "./lib/stills.mjs";
import { uploadPublic } from "./lib/upload.mjs";

const args = parseArgs(process.argv.slice(2));
const tier = args.tier === "final" ? "final" : "draft";
const key = requireEnv("FAL_KEY");
const refUrl = args.ref ? await uploadPublic(String(args.ref)) : undefined;
if (refUrl) console.log(`reference uploaded → ${refUrl}`);
const WORK = "generations";
await mkdir(WORK, { recursive: true });

for (const id of selectIds(args.only)) {
  const prompt = (await readFile(`prompts/still_${id}.txt`, "utf8")).trim();
  const req = stillRequest(tier, prompt, refUrl);
  process.stdout.write(`still ${id} (${tier}, ${req.slug}) … `);
  const res = await postJson(`https://fal.run/${req.slug}`, req.body, { Authorization: `Key ${key}` });
  const url = res?.images?.[0]?.url;
  if (!url) throw new Error(`no image url in response: ${JSON.stringify(res).slice(0, 400)}`);
  const out = `${WORK}/still_${id}.png`;
  await saveMedia(url, out);
  const params = Object.fromEntries(Object.entries(req.body).filter(([k]) => k !== "prompt" && k !== "sync_mode" && k !== "image_urls"));
  await writeSidecar(out, { model: req.slug, prompt, refs: args.ref ? [String(args.ref)] : [], params: { tier, ...params } });
  console.log(`ok → ${out}`);
}
