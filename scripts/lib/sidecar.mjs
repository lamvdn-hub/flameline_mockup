import { writeFile } from "node:fs/promises";

/** Provenance beside every generated file: same basename, .json extension. */
export async function writeSidecar(mediaPath, { model, prompt, refs = [], params = {} }) {
  const jsonPath = mediaPath.replace(/\.[^.]+$/, ".json");
  await writeFile(jsonPath, JSON.stringify({ model, prompt, refs, params, created: new Date().toISOString() }, null, 2) + "\n");
  return jsonPath;
}
