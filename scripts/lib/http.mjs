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

export function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`${name} not set: add it in the cloud environment settings (Edit cloud environment → Environment variables) and start a new session.`);
    process.exit(3);
  }
  return v;
}
