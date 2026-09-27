import { readFile } from "node:fs/promises";
import { extname, basename } from "node:path";
import { postJson, publicFalUrl, requireEnv } from "./http.mjs";

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };

/**
 * Upload a local frame and return a public https URL for the video model.
 * fal storage: initiate → PUT bytes → file_url. initiate returns v3b.fal.media
 * URLs; the same signed path is served on v3.fal.media (verified 2026-09-27 with
 * a free probe: PUT 200, GET 200), and only v3 is reachable from this container.
 * The returned URL is checked with a HEAD request.
 */
export async function uploadPublic(filePath) {
  const key = requireEnv("FAL_KEY");
  const contentType = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  const init = await postJson(
    "https://rest.alpha.fal.ai/storage/upload/initiate",
    { file_name: basename(filePath), content_type: contentType },
    { Authorization: `Key ${key}` },
  );
  const put = await fetch(publicFalUrl(init.upload_url), { method: "PUT", headers: { "content-type": contentType }, body: await readFile(filePath) });
  if (!put.ok) throw new Error(`upload PUT failed: ${put.status}`);
  const fileUrl = publicFalUrl(init.file_url);
  const head = await fetch(fileUrl, { method: "HEAD" });
  if (!head.ok) throw new Error(`uploaded file not reachable: ${head.status} ${fileUrl}`);
  return fileUrl;
}
