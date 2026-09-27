import { postJson, download } from "./http.mjs";

export const KIE = "https://api.kie.ai/api/v1";

/**
 * Kie serves results from tempfile.aiquickdraw.com, which this container's
 * network policy denies. Kie's download-url API converts any result URL into a
 * presigned Cloudflare R2 link (reachable), valid for 20 minutes. Pure.
 */
export function kieDownloadRequest(resultUrl) {
  return { url: `${KIE}/common/download-url`, body: { url: resultUrl } };
}

/** Convert then download; falls back to the original URL if conversion fails. */
export async function downloadKieResult(resultUrl, toPath, key) {
  const { url, body } = kieDownloadRequest(resultUrl);
  let direct = resultUrl;
  try {
    const r = await postJson(url, body, { Authorization: `Bearer ${key}` });
    if (r?.data) direct = r.data;
  } catch (e) {
    console.error(`download-url conversion failed (${e.message.split("\n")[0]}); trying the result url directly`);
  }
  return download(direct, toPath);
}
