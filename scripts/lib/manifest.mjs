import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** Pure core: from a list of paths relative to public/, which stills and clips exist per scene. */
export function buildManifest(files, sceneIds) {
  const set = new Set(files);
  const manifest = { stills: {}, clips: {} };
  for (const id of sceneIds) {
    if (set.has(`assets/stills/${id}.webp`)) manifest.stills[id] = `/assets/stills/${id}.webp`;
    if (set.has(`assets/vid/${id}.mp4`)) manifest.clips[id] = `/assets/vid/${id}.mp4`;
  }
  return manifest;
}

async function listRelative(root, sub) {
  try {
    const names = await readdir(join(root, sub));
    return names.map((n) => `${sub}/${n}`);
  } catch {
    return [];
  }
}

/** Scans publicDir/assets and writes publicDir/assets/manifest.json. */
export async function writeManifest(publicDir, sceneIds) {
  const files = [...(await listRelative(publicDir, "assets/stills")), ...(await listRelative(publicDir, "assets/vid"))];
  const manifest = buildManifest(files, sceneIds);
  await writeFile(join(publicDir, "assets/manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}
