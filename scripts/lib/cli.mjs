/** Minimal argv parser: --key value, --flag, --only a,b. Pure. */
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) { out[k] = next; i++; } else out[k] = true;
    } else out._.push(a);
  }
  return out;
}
export const SCENE_IDS = ["field", "gallery", "humidor", "light"];
export function selectIds(only) {
  return only ? String(only).split(",").map((s) => s.trim()).filter(Boolean) : SCENE_IDS;
}
