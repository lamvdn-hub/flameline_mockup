import { readFile } from "node:fs/promises";
import { extname, basename } from "node:path";
import { postJson, requireEnv } from "./http.mjs";

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };

/**
 * Upload a local frame and return a public https URL for the video model.
 * Uses fal's storage (initiate → PUT). Confirm the endpoint in prompts/models.md
 * before the first leg; the URL is checked with a HEAD request.
 */
export async function uploadPublic(filePath) {
  const key = requireEnv("FAL_KEY");
  const contentType = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  const init = await postJson(
    "https://rest.alpha.fal.ai/storage/upload/initiate",
    { file_name: basename(filePath), content_type: contentType },
    { Authorization: `Key ${key}` },
  );
  const put = await fetch(init.upload_url, { method: "PUT", headers: { "content-type": contentType }, body: await readFile(filePath) });
  if (!put.ok) throw new Error(`upload PUT failed: ${put.status}`);
  const head = await fetch(init.file_url, { method: "HEAD" });
  if (!head.ok) throw new Error(`uploaded file not reachable: ${head.status} ${init.file_url}`);
  return init.file_url;
}
