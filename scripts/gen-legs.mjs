#!/usr/bin/env node
// Camera legs on Kie AI (Kling 3.0 pro), sequential with frame handoff.
//   node scripts/gen-legs.mjs --from <index> [--to <index>] [--attempt n]
// Leg i starts from leg i-1's ACTUAL last frame. The script stops after each
// leg and prints the last-frame path: inspect it before running the next index.
// Attempt 2+ strips filter trigger words and appends the tasteful clause.
import { readFile, mkdir } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { postJson, getJson, requireEnv } from "./lib/http.mjs";
import { KIE as KIE_BASE, downloadKieResult } from "./lib/kie.mjs";
import { writeSidecar } from "./lib/sidecar.mjs";
import { uploadPublic } from "./lib/upload.mjs";
import { lastFrame } from "./lib/ffmpeg.mjs";
import { legPlan } from "./lib/chain.mjs";
import { parseArgs, SCENE_IDS } from "./lib/cli.mjs";

const KIE = `${KIE_BASE}/jobs`;
const MODEL = "kling-3.0/video";
const TRIGGERS = /\b(bed|pool|waterfall|wine|swim|flame|smoke)\b/gi;

export function promptForAttempt(prompt, attempt) {
  if (attempt <= 1) return prompt;
  return prompt.replace(TRIGGERS, "").replace(/\s{2,}/g, " ").trim() + " Unoccupied, architectural, tasteful.";
}

async function poll(taskId, key) {
  for (;;) {
    const r = await getJson(`${KIE}/recordInfo?taskId=${encodeURIComponent(taskId)}`, { Authorization: `Bearer ${key}` });
    const state = r?.data?.state;
    if (state === "success") return JSON.parse(r.data.resultJson).resultUrls[0];
    if (state === "fail") throw new Error(`kie task failed: ${r.data.failMsg || r.data.failCode || JSON.stringify(r.data).slice(0, 300)}`);
    process.stdout.write(".");
    await sleep(8000);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const key = requireEnv("KIE_API_KEY");
  const from = Number(args.from ?? 0);
  const to = Number(args.to ?? from);
  const attempt = Number(args.attempt ?? 1);
  const plan = legPlan(SCENE_IDS, { workDir: "generations", assetsDir: "public/assets" });
  await mkdir("generations", { recursive: true });

  for (const leg of plan.slice(from, to + 1)) {
    const prompt = promptForAttempt((await readFile(leg.prompt, "utf8")).trim(), attempt);
    console.log(`leg ${leg.index} ${leg.id}: start image ${leg.startImage} (attempt ${attempt})`);
    const imageUrl = await uploadPublic(leg.startImage);
    const input = { prompt, image_urls: [imageUrl], duration: "10", aspect_ratio: "16:9", mode: "pro" };
    const created = await postJson(`${KIE}/createTask`, { model: MODEL, input }, { Authorization: `Bearer ${key}` });
    const taskId = created?.data?.taskId;
    if (!taskId) throw new Error(`no taskId: ${JSON.stringify(created).slice(0, 300)}`);
    process.stdout.write(`  task ${taskId} `);
    let videoUrl;
    try { videoUrl = await poll(taskId, key); }
    catch (e) { console.error(`\n${e.message}\nRe-roll: node scripts/gen-legs.mjs --from ${leg.index} --attempt ${attempt + 1}`); process.exit(2); }
    await downloadKieResult(videoUrl, leg.raw, key);
    await lastFrame(leg.raw, leg.lastFrame);
    await writeSidecar(leg.raw, { model: MODEL, prompt, refs: [leg.startImage], params: { ...input, image_urls: undefined, attempt, taskId } });
    console.log(`\n  ok → ${leg.raw}\n  INSPECT ${leg.lastFrame} before running --from ${leg.index + 1}: it must read as a calm forward-glide frame.`);
  }
}
