import { readFileSync } from "node:fs";
import { test, expect } from "vitest";
import { buildStillPrompt, buildLegPrompt, HANDOFF_OPEN, handoffClose } from "../scripts/lib/prompts.mjs";
import { legPlan, startImageFor } from "../scripts/lib/chain.mjs";
import { buildManifest } from "../scripts/lib/manifest.mjs";
import { stillRequest } from "../scripts/lib/stills.mjs";

const ids = ["field", "gallery", "humidor", "light"];

test("all committed still prompts start with the identical preamble", () => {
  const pre = readFileSync("prompts/preamble.txt", "utf8").trim();
  for (const id of ids) {
    const p = readFileSync(`prompts/still_${id}.txt`, "utf8");
    expect(p.startsWith(pre)).toBe(true);
    expect(p).toContain("\nSubject: ");
  }
});

test("all committed leg prompts carry both handoff clauses", () => {
  for (const id of ids) {
    const p = readFileSync(`prompts/leg_${id}.txt`, "utf8");
    expect(p).toContain(HANDOFF_OPEN);
    expect(p).toMatch(/In the final second, settle back into a slow, steady forward glide toward /);
  }
});

test("buildStillPrompt and buildLegPrompt shapes", () => {
  expect(buildStillPrompt("PRE\n", " a field ")).toBe("PRE\nSubject: a field");
  expect(buildLegPrompt({ move: "M.", into: "X", next: "Y", styleTail: "S." })).toBe(
    `${HANDOFF_OPEN} M. The camera moves into X. ${handoffClose("Y")} S. Smooth, graceful, slow motion, subtle parallax. No text, no captions.`,
  );
});

test("legPlan chains start images from the previous last frame", () => {
  const plan = legPlan(ids, { workDir: "generations", assetsDir: "public/assets" });
  expect(plan[0].startImage).toBe("generations/still_field.png");
  expect(plan[1].startImage).toBe("generations/last_field.png");
  expect(plan[3]).toMatchObject({
    index: 3,
    id: "light",
    prompt: "prompts/leg_light.txt",
    raw: "generations/leg_light.mp4",
    lastFrame: "generations/last_light.png",
    encoded: "public/assets/vid/light.mp4",
  });
});

test("buildManifest lists only present files", () => {
  expect(
    buildManifest(["assets/stills/field.webp", "assets/vid/field.mp4", "assets/stills/placeholder-field.svg"], ids),
  ).toEqual({ stills: { field: "/assets/stills/field.webp" }, clips: { field: "/assets/vid/field.mp4" } });
});

test("startImageFor honours an explicit override, else the chain's start image", () => {
  const leg = legPlan(ids, { workDir: "generations", assetsDir: "public/assets" })[2];
  expect(startImageFor(leg)).toBe("generations/last_gallery.png");
  expect(startImageFor(leg, "generations/still_humidor.png")).toBe("generations/still_humidor.png");
});

test("stillRequest targets the edit endpoint with image_urls when a reference is given", () => {
  const plain = stillRequest("final", "P");
  expect(plain.slug).toBe("google/nano-banana-pro");
  expect(plain.body).toMatchObject({ prompt: "P", aspect_ratio: "16:9", resolution: "4K", sync_mode: true });
  expect(plain.body).not.toHaveProperty("image_urls");
  const ref = stillRequest("final", "P", "https://v3.fal.media/x.png");
  expect(ref.slug).toBe("google/nano-banana-pro/edit");
  expect(ref.body).toMatchObject({ image_urls: ["https://v3.fal.media/x.png"] });
  expect(stillRequest("draft", "P", "https://v3.fal.media/x.png").slug).toBe("google/nano-banana-2-lite/edit");
});
