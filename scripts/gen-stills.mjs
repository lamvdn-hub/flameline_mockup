#!/usr/bin/env node
// Scene stills on fal.ai.  node scripts/gen-stills.mjs --tier draft|final [--only field,gallery]
// Draft: Nano Banana 2 Lite. Final: the pro model recorded in prompts/models.md.
// Never runs without an explicit go from the user for the tier's quoted cost.
import { readFile, mkdir } from "node:fs/promises";
import { postJson, download, requireEnv } from "./lib/http.mjs";
import { writeSidecar } from "./lib/sidecar.mjs";
import { parseArgs, selectIds } from "./lib/cli.mjs";

const MODELS = {
  draft: { slug: "google/nano-banana-2-lite", body: (prompt) => ({ prompt, aspect_ratio: "16:9", num_images: 1 }) },
  final: { slug: "fal-ai/flux-pro/v1.1-ultra", body: (prompt) => ({ prompt, aspect_ratio: "16:9", raw: false, safety_tolerance: "2" }) },
};

const args = parseArgs(process.argv.slice(2));
const tier = args.tier === "final" ? "final" : "draft";
const key = requireEnv("FAL_KEY");
const model = MODELS[tier];
const WORK = "generations";
await mkdir(WORK, { recursive: true });

for (const id of selectIds(args.only)) {
  const prompt = (await readFile(`prompts/still_${id}.txt`, "utf8")).trim();
  process.stdout.write(`still ${id} (${tier}, ${model.slug}) … `);
  const res = await postJson(`https://fal.run/${model.slug}`, model.body(prompt), { Authorization: `Key ${key}` });
  const url = res?.images?.[0]?.url;
  if (!url) throw new Error(`no image url in response: ${JSON.stringify(res).slice(0, 400)}`);
  const out = `${WORK}/still_${id}.png`;
  await download(url, out);
  await writeSidecar(out, { model: model.slug, prompt, params: { tier, aspect_ratio: "16:9" } });
  console.log(`ok → ${out}`);
}
