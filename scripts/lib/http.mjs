import { writeFile } from "node:fs/promises";

export async function postJson(url, body, headers = {}) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url}\n${text.slice(0, 800)}`);
  return JSON.parse(text);
}

export async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url}\n${text.slice(0, 800)}`);
  return JSON.parse(text);
}

export async function download(url, toPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} downloading ${url}`);
  await writeFile(toPath, Buffer.from(await res.arrayBuffer()));
  return toPath;
}

/** `data:<mime>;base64,<payload>` → { mime, bytes }; anything else → null. Pure. */
export function decodeDataUri(s) {
  const m = /^data:([^;,]+);base64,(.*)$/s.exec(String(s));
  return m ? { mime: m[1], bytes: Buffer.from(m[2], "base64") } : null;
}

/**
 * fal's CDN answers on two hosts, v3.fal.media and v3b.fal.media, for the same
 * signed path. Only v3 is allow-listed by this container's network policy, so
 * every fal URL we fetch or hand to another provider goes through here. Pure.
 */
export function publicFalUrl(url) {
  return String(url).replace(/^https:\/\/v3b\.fal\.media\//, "https://v3.fal.media/");
}

/** Save a model output that is either a data URI (sync_mode) or an https URL. */
export async function saveMedia(urlOrDataUri, toPath) {
  const d = decodeDataUri(urlOrDataUri);
  if (d) { await writeFile(toPath, d.bytes); return toPath; }
  return download(publicFalUrl(urlOrDataUri), toPath);
}

export function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`${name} not set: add it in the cloud environment settings (Edit cloud environment → Environment variables) and start a new session.`);
    process.exit(3);
  }
  return v;
}
